# Learnova | AI STEM Olympiad Preparation

This is a Next.js project built with React, Tailwind CSS, ShadCN UI, and Genkit for AI-driven functionality.

## Getting Started Locally

Follow these steps to set up the project on your machine:

### 1. Prerequisites
- **Node.js**: Version 18.0.0 or higher.
- **NPM**: Usually comes with Node.js.

### 2. Installation
Open your terminal in the project root and run:
```bash
npm install
```

### 3. Environment Setup
Create a file named `.env` in the root directory and add your Google Gemini API key:
```env
GOOGLE_GENAI_API_KEY=your_api_key_here
```
You can get an API key from the [Google AI Studio](https://aistudio.google.com/).

### 4. Running the App
Start the development server:
```bash
npm run dev
```
The application will be available at [http://localhost:9002](http://localhost:9002).

### 5. Running Genkit Developer UI
To test and debug AI flows using the Genkit UI:
```bash
npm run genkit:dev
```
This will start the Genkit UI, usually at [http://localhost:4000](http://localhost:4000).

## Project Structure
- `src/app`: Next.js App Router pages and layouts.
- `src/ai`: Genkit AI flows and configuration.
- `src/components`: Reusable UI components (including ShadCN).
- `src/hooks`: Custom React hooks.
- `src/lib`: Utility functions and static data.

## Tech Stack
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI)
- **AI Engine**: Genkit with Google Gemini
- **Icons**: Lucide React
