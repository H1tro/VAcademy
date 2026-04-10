# Learnova | AI STEM Olympiad Preparation

This is a Next.js project built with React, Tailwind CSS, ShadCN UI, and Genkit for AI-driven functionality.

## 🚀 Getting Started Locally

To run this project on your own computer, follow these steps:

### 1. Download the Project
In the Firebase Studio interface, look for the **Download** or **Export** button (usually in the top-right toolbar). This will download a `.zip` file containing all the project files.

### 2. Prerequisites
- **Node.js**: Version 18.0.0 or higher.
- **NPM**: Usually comes with Node.js.

### 3. Installation
Extract the zip file, open your terminal in the project root folder and run:
```bash
npm install
```

### 4. Environment Setup
Create a file named `.env` in the root directory and add your Google Gemini API key:
```env
GOOGLE_GENAI_API_KEY=your_api_key_here
```
You can get an API key from the [Google AI Studio](https://aistudio.google.com/).

### 5. Running the App
Start the development server:
```bash
npm run dev
```
The application will be available at [http://localhost:9002](http://localhost:9002).

### 6. AI Development (Genkit)
To test and debug AI flows using the Genkit UI:
```bash
npm run genkit:dev
```

## Project Structure
- `src/app`: Next.js App Router pages and layouts.
- `src/ai`: Genkit AI flows and configuration.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and static data.
