import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiApiKey = process.env.GEMINI_API_KEY

if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY is required')
}

const gemini = new GoogleGenerativeAI(geminiApiKey)

export const geminiModel = gemini.getGenerativeModel({
  model: 'gemini-1.5-flash',
})
