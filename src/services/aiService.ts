
import { ApplicationData, SituationInfo } from '../features/applicationForm/applicationContext';

export interface SituationSuggestionResult extends SituationInfo {}

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const API_KEY = (import.meta as any).env.VITE_OPENAI_API_KEY as string;
if (!API_KEY) {
  throw new Error('VITE_OPENAI_API_KEY is not defined in your environment.');
}

/** Standard error codes used internally */
const ERROR_CODES = {
  RATE_LIMIT: 'rate_limit',
  TIMEOUT: 'timeout',
  CLIENT: 'client_error',
  SERVER: 'server_error',
  NETWORK: 'network_error',
};


const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Build a prompt that includes every personal + family field,
 * plus the existing situation fields, and asks ChatGPT to
 * rewrite/improve only the three “Situation” sections.
 */
function buildSituationPrompt({ personal, family, situation }: ApplicationData): string {
  return `
You are an expert social support advisor. Below is all of the user’s information. Improve and rewrite only the three “Situation” sections—each under its original heading exactly—while taking into account their personal & family context.

Personal Information:
  Name: ${personal.name}
  National ID: ${personal.nationalId}
  Date of Birth: ${personal.dob}
  Gender: ${personal.gender}
  Address: ${personal.address}, ${personal.city}, ${personal.state}, ${personal.country}
  Phone: ${personal.phone}
  Email: ${personal.email}

Family & Financial Info:
  Marital Status: ${family.maritalStatus}
  Dependents: ${family.dependents}
  Employment Status: ${family.employmentStatus}
  Monthly Income: ${family.monthlyIncome}
  Housing Status: ${family.housingStatus}

Situation Descriptions (current):
  Current Financial Situation: ${situation.currentFinancial || '[none provided]'}
  Employment Circumstances: ${situation.employmentCircumstances || '[none provided]'}
  Reason for Applying: ${situation.reason || '[none provided]'}

Rewrite and improve each of these three sections. Return your answer in the following exact format (leave no extra text):

Current Financial Situation:
[rewritten paragraph here]

Employment Circumstances:
[rewritten paragraph here]

Reason for Applying:
[rewritten paragraph here]
`.trim();
}

/**
 * Perform a fetch with timeout.
 * Rejects with AbortError on timeout.
 */
async function fetchWithTimeout(input: RequestInfo, init: RequestInit, timeout = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Classify response status and throw a corresponding Error code
 */
async function handleResponseErrors(response: Response): Promise<void> {
  if (response.ok) return;

  if (response.status === 429) {
    throw new Error(ERROR_CODES.RATE_LIMIT);
  }
  if (response.status >= 400 && response.status < 500) {
    let message = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        message = errJson.error.message;
      }
    } catch {
      /* ignore JSON parse issues */
    }
    throw new Error(`${ERROR_CODES.CLIENT}:${message}`);
  }
  if (response.status >= 500 && response.status < 600) {
    throw new Error(ERROR_CODES.SERVER);
  }

  // For any other unexpected code
  throw new Error(`unexpected_status:${response.status}`);
}

/**
 * Low‐level function to call OpenAI’s chat/completions endpoint
 */
async function callOpenAI(prompt: string): Promise<string> {
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  };
  const init: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  };

  let attempt = 0;
  let backoffMs = 1000;

  while (attempt < 3) {
    attempt++;
    try {
      const response = await fetchWithTimeout(OPENAI_ENDPOINT, init, 15000);
      await handleResponseErrors(response);

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw || typeof raw !== 'string') {
        throw new Error('unexpected_format');
      }
      return raw.trim();
    } catch (err: any) {
      // Timeout
      if (err.name === 'AbortError') {
        if (attempt < 3) {
          await sleep(backoffMs);
          backoffMs *= 2;
          continue;
        }
        throw new Error(ERROR_CODES.TIMEOUT);
      }

      const code = err.message;
      // Retry on SERVER or network errors
      if (
        (code === ERROR_CODES.SERVER || code.includes('NetworkError') || code.includes('Failed to fetch')) &&
        attempt < 3
      ) {
        await sleep(backoffMs);
        backoffMs *= 2;
        continue;
      }

      // Propagate other errors
      throw err;
    }
  }

  // If we somehow exit loop without success
  throw new Error('unknown_error');
}

/**
 * Parse the AI’s output into three separate fields. 
 */
function parseSituationSections(
  raw: string,
  original: SituationInfo
): SituationSuggestionResult {
  const financialPattern =
    /Current Financial Situation:\s*([\s\S]*?)(?=\n\s*Employment Circumstances:|$)/i;
  const employmentPattern =
    /Employment Circumstances:\s*([\s\S]*?)(?=\n\s*Reason for Applying:|$)/i;
  const reasonPattern = /Reason for Applying:\s*([\s\S]*)$/i;

  const financialMatch = financialPattern.exec(raw);
  const employmentMatch = employmentPattern.exec(raw);
  const reasonMatch = reasonPattern.exec(raw);

  return {
    currentFinancial: financialMatch?.[1]?.trim() || original.currentFinancial,
    employmentCircumstances:
      employmentMatch?.[1]?.trim() || original.employmentCircumstances,
    reason: reasonMatch?.[1]?.trim() || original.reason,
  };
}

/**
 * Public function: given the entire ApplicationData, ask OpenAI
 * to rewrite/improve the three “Situation” fields. Returns
 * a typed object with the three rewritten sections.

 */
export async function generateSituationSections(
  appData: ApplicationData
): Promise<SituationSuggestionResult> {
  const prompt = buildSituationPrompt(appData);
  const raw = await callOpenAI(prompt);
  return parseSituationSections(raw, appData.situation);
}