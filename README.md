# Social Support

## How to Run

1. Install dependencies:
   npm install

2. Create a `.env` file in the root with your OpenAI API key:

   VITE_OPENAI_API_KEY=your_api_key_here
   
3. Start development server:

   npm run dev
   

## Application Structure

Project Organization

   -  `components`/ contains generic, reusable UI bits (Button, InputField, SelectField, TextAreaField).
   - `features` / applicationForm holds the wizard, step components, context, and validation logic.
   - `hooks` / and utils/ keep side‐effect logic and helpers modular.

## OpenAI Integration

Uses `fetch` to call the OpenAI GPT API

## Features & Architecture

- Context API used for state management across wizard steps.
- React Hook Form for form handling and validation.
- React-i18next for language support (English + Arabic).
- LocalStorage for saving progress.
- TypeScript for type safety.
- Tailwind CSS for modern Web 3.0 UI.
