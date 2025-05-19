'use server';

/**
 * @fileOverview A search refinement AI agent.
 *
 * - refineSearchQuery - A function that refines the user's search query.
 * - RefineSearchQueryInput - The input type for the refineSearchQuery function.
 * - RefineSearchQueryOutput - The return type for the refineSearchQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineSearchQueryInputSchema = z.object({
  query: z.string().describe('The user search query.'),
});
export type RefineSearchQueryInput = z.infer<typeof RefineSearchQueryInputSchema>;

const RefineSearchQueryOutputSchema = z.object({
  refinedQuery: z.string().describe('The refined search query.'),
});
export type RefineSearchQueryOutput = z.infer<typeof RefineSearchQueryOutputSchema>;

export async function refineSearchQuery(input: RefineSearchQueryInput): Promise<RefineSearchQueryOutput> {
  return refineSearchQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineSearchQueryPrompt',
  input: {schema: RefineSearchQueryInputSchema},
  output: {schema: RefineSearchQueryOutputSchema},
  prompt: `You are a search refinement expert. The user will provide a search query, and you will correct any typos or suggest a better search query based on the user's intent. If the search query is good, return it unchanged. Do not respond in the form of a conversation.

Search query: {{{query}}}`,
});

const refineSearchQueryFlow = ai.defineFlow(
  {
    name: 'refineSearchQueryFlow',
    inputSchema: RefineSearchQueryInputSchema,
    outputSchema: RefineSearchQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
