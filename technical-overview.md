# Overview

I built a small multi-step “Social Support” frontend using React, TypeScript, and Tailwind CSS. The core idea was to let a citizen move through three steps (Personal → Family & Financial → Situation Description) while saving state locally and getting helpful AI‐generated suggestions on their written responses. Along the way, I wanted clean code, sensible folder structure, and a modern yet accessible UI. Below is a quick rundown of why I chose Context over Redux, how the AI integration works, the component/layout decisions, and a few other improvements that make the code feel solid.

⸻

## State Management: Context + useReducer
1.	Simplicity for this Scale
Our app only needs to share a handful of values (the current step number and a nested object of form data) between components. Redux would have introduced boilerplate (actions/types/reducers everywhere) for a relatively small state shape. React’s Context + useReducer pattern gives us almost all the benefits of a centralized store with far less ceremony.
2.	Lightweight Learning Curve
Anyone who already knows React hooks can immediately read and understand the provider, reducer, and useContext in the steps. With Redux, you’d need to onboard redux, react-redux, maybe redux-toolkit, and set up action creators, which felt overkill for three small forms.
3.	No Need for Middleware or DevTools
The app is not doing complex side effects (thunks, observables) or time‐travel debugging. React Context + useReducer works just fine for localStorage persistence. If we ever outgrow it, we can swap in Redux later—context doesn’t block that.

⸻

## How AI Integration Is Set Up
1.	Service Layer (aiService.ts)
I created generateSituationSections to accept all form data (personal + family + situation), build a full-context prompt string, call OpenAI’s chat/completions with gpt-3.5-turbo, and parse the response into three separate fields via regex.
2.	Custom Hook (useAiSuggestion.ts)
Instead of mixing loading/error states in the UI, I encapsulated AI logic in a custom hook that:
	•	Accepts the full ApplicationData as input.
	•	Returns { loading, error, sections, generate }.
	•	Caches previous suggestions so identical inputs return instantly.
	•	Debounces calls (no new request until two seconds have passed) to prevent API spamming.
3.	Step 3: Single “Help Me Write” Button
Earlier versions requested AI per-field. Now one button sends all three textarea values at once, then displays a modal with “Edit / Accept / Discard.” That gives AI full context, producing a coherent write-up rather than standalone snippets.
	4.	Error Handling & Resilience
	•	If OpenAI returns a 429 (rate limit) or any 4xx/5xx, I render a small red inline banner above the textarea instead of using alert(…), so the user doesn’t lose their in-progress text.
	•	During the API call, the “Help Me Write” button is disabled and shows a spinner, preventing duplicate requests.
	•	I used an AbortController to enforce a 15-second timeout and implemented exponential backoff with two retries for transient 5xx or network errors. This makes the integration more resilient in real-world conditions.

⸻

## Component & Folder Structure
1.	components/
	•	Shell & Navbar: Shell handles the overall page layout (header + main scroll area). Navbar is just the top bar with toggles.
	•	Button, InputField, SelectField, TextAreaField: Reusable, styled inputs that include built-in error messages and dark-mode styles.
2.	features/applicationForm/
	•	applicationContext.tsx: Provider using a reducer to store { step, data } and sync with localStorage.
	•	StepsWrapper.tsx: Decides which Step component to render, shows a ProgressBar at the top, and makes the step portion scrollable via overflow-y-auto.
	•	steps/: Three separate components for each step—each one has its own form logic and validation with React Hook Form.
3.	hooks/
	•	useAiSuggestion.ts: Manages AI calls (loading, error, cache, debounce).
4.	services/aiService.ts
	•	Low-level wrapper around the OpenAI REST call + parsing logic.

⸻

## Impressions & Improvements
	•	I use React Hook Form with mode: ‘onBlur’ so errors only show once a user leaves a field.
	•	Each input includes aria-invalid, aria-describedby, and a clear  so it’s keyboard-navigable and screen reader–friendly.

## Lazy Loading Steps
	•	I used React.lazy() + Suspense around each of Step 1, 2, and 3 so that we don’t bundle all three step components up front. That reduces initial JS payload slightly.

## Dark Mode
	•	Tailwind’s dark: classes ensure consistent backgrounds everywhere. I added bg-gray-100 dark:bg-gray-900 on each container, not just the root, so the entire page flips nicely when you toggle.

## LocalStorage Persistence
	•	The applicationContext uses a single useEffect to save every time { step, data } changes—no confusing “init” flag needed. On load, we hydrate from localStorage immediately so the user can pick up where they left off.

## AI Prompt Construction
	•	Instead of half-baked one-field prompts, I send a full-context prompt in Step 3: personal + family + existing situation fields. That means the AI’s suggestions are tailored to the user’s situation, not generic paragraphs.

## Error & Retry Logic
	•	In aiService, I wrap fetch in a 15-second timeout and retry twice (exponential backoff) for any 5xx errors or network timeouts. That small bit of resilience makes a big difference in production.

⸻

## Final Thoughts
	• I went with Context + useReducer because it’s lightweight for our small app and avoids Redux boilerplate. If this form gets more complex later—say, multiple pages or global user / auth state—we can always swap in Redux or Zustand without rewriting the entire form logic.
	•	Our AI integration lives in a clearly separated service + hook, so if we switch from OpenAI to another LLM, it’s just a few lines in aiService and our hook.
	•	Components are truly reusable—InputField, SelectField, TextAreaField each standardize styling, error display, and accessibility. This makes adding a new form step much faster.
	•	Finally, the “shell + navbar” split gives us a clear layout and makes it easy to add other pages (about page, help docs) alongside the form if needed.

This is just a few straightforward choices to keep the codebase clean and future‐proof built off the requirements provided without making too many assumptions on what enhancements would be a beneficial deliverable for the platform at hand.

⸻

## Next Steps & Future Improvements
1.	Improve AI Experience
	•	Implement streaming responses (using OpenAI’s stream: true) so users see text as it’s generated, improving perceived responsiveness.
	•	Add options for “tone” or “detail level” so users can choose concise summaries or more in-depth explanations.
2.	Styling & Design System
	•	Adopt a component library or design system (e.g., Mantine or Tailwind UI) to standardize styles, spacing, and typography for reusability.
	•	Enhance user experience with thoughtful micro-interactions—smooth form field focus transitions, inline validation feedback as soon as a field is correct or incorrect, and clear success/error banners—so people always know where they are and what’s happening.
3.	Add Automated Testing
	•	Write unit tests for all form components and validation logic using Jest + React Testing Library.
	•	Add end-to-end tests (e.g., Cypress) to simulate the full multi-step flow, including AI interactions and final submission.
4.	Performance & Bundle Optimization
	•	Further split bundles so AI-related code only loads when Step 3 is reached (dynamic imports at a finer granularity).
	•	Monitor key metrics (LCP, TTI) and employ image/asset optimization (e.g., converting to WebP, leveraging CDN).
5.	Security & Authentication
	•	Integrate a secure authentication flow (OAuth 2.0 or JWT) so each application is tied to a user account, preventing unauthorized access and enabling personalized dashboards.
	•	Move sensitive secrets (OpenAI API key) to a backend proxy or serverless function, validate all inputs server-side, and enforce HTTPS/Content Security Policy to guard against common web vulnerabilities.