'use server';
/**
 * @fileOverview A Genkit flow for generating a personalized learning strategy for students.
 *
 * - generatePersonalLearningStrategy - A function that handles the generation of a personalized learning strategy.
 * - GeneratePersonalLearningStrategyInput - The input type for the generatePersonalLearningStrategy function.
 * - GeneratePersonalLearningStrategyOutput - The return type for the generatePersonalLearningStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalLearningStrategyInputSchema = z.object({
  subjects: z
    .array(z.string())
    .describe('A list of STEM subjects the student wants to prepare for.'),
  targetOlympiadOrExam: z
    .string()
    .describe('The name of the target Olympiad or exam (e.g., "International Mathematical Olympiad", "AP Physics C").'),
  knowledgeLevelSelfAssessment: z
    .string()
    .describe(
      'A brief self-assessment of the student\u0027s current knowledge level for the chosen subjects. ' +
        'This should include strengths, weaknesses, and any specific areas they want to focus on.'
    ),
});
export type GeneratePersonalLearningStrategyInput = z.infer<typeof GeneratePersonalLearningStrategyInputSchema>;

const RecommendedTopicSchema = z.object({
  title: z.string().describe('The title of the recommended topic.'),
  description: z.string().describe('A brief description of the topic and why it is recommended.'),
  estimatedStudyTimeHours: z.number().describe('Estimated hours required to study this topic.'),
});

const RecommendedVideoLessonSchema = z.object({
  title: z.string().describe('The title of the recommended video lesson.'),
  url: z.string().url().describe('A hypothetical URL to the video lesson (e.g., internal platform link).'),
  durationMinutes: z.number().describe('Estimated duration of the video lesson in minutes.'),
});

const RecommendedPracticeAssignmentSchema = z.object({
  title: z.string().describe('The title of the recommended practice assignment.'),
  description: z.string().describe('A brief description of the assignment.'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The difficulty level of the assignment.'),
});

const GeneratePersonalLearningStrategyOutputSchema = z.object({
  strategyOverview: z.string().describe('A general overview of the personalized learning strategy.'),
  recommendedTopics: z
    .array(RecommendedTopicSchema)
    .describe('A list of recommended topics to study.'),
  recommendedVideoLessons: z
    .array(RecommendedVideoLessonSchema)
    .describe('A list of recommended video lessons.'),
  recommendedPracticeAssignments: z
    .array(RecommendedPracticeAssignmentSchema)
    .describe('A list of recommended practice assignments.'),
});
export type GeneratePersonalLearningStrategyOutput = z.infer<typeof GeneratePersonalLearningStrategyOutputSchema>;

export async function generatePersonalLearningStrategy(
  input: GeneratePersonalLearningStrategyInput
): Promise<GeneratePersonalLearningStrategyOutput> {
  return generatePersonalLearningStrategyFlow(input);
}

const generatePersonalLearningStrategyPrompt = ai.definePrompt({
  name: 'generatePersonalLearningStrategyPrompt',
  input: {schema: GeneratePersonalLearningStrategyInputSchema},
  output: {schema: GeneratePersonalLearningStrategyOutputSchema},
  prompt: `You are an AI assistant designed to create personalized learning strategies for students preparing for STEM olympiads and exams.

Based on the following information, generate a comprehensive learning strategy:

Student's Chosen Subjects: {{{subjects}}}
Target Olympiad/Exam: {{{targetOlympiadOrExam}}}
Student's Knowledge Level Self-Assessment: {{{knowledgeLevelSelfAssessment}}}

Your strategy should include:
1. A general overview of the learning strategy.
2. A list of recommended topics, including their title, a brief description, and estimated study time.
3. A list of recommended video lessons, including their title, a hypothetical URL (e.g., '/lessons/math-algebra-1'), and estimated duration in minutes.
4. A list of recommended practice assignments, including their title, description, and difficulty level (Beginner, Intermediate, Advanced).

Focus on a structured and progressive approach, addressing potential weaknesses identified in the self-assessment and building upon strengths.
Ensure the recommendations are highly relevant to the specified subjects and target. The URLs for video lessons should be placeholders, assuming an internal platform structure.
`,
});

const generatePersonalLearningStrategyFlow = ai.defineFlow(
  {
    name: 'generatePersonalLearningStrategyFlow',
    inputSchema: GeneratePersonalLearningStrategyInputSchema,
    outputSchema: GeneratePersonalLearningStrategyOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalLearningStrategyPrompt(input);
    return output!;
  }
);
