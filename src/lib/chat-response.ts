export const CHAT_ERROR = "I couldn't reach the automation right now. Please try again, or use the contact form if you'd like to discuss a workflow."
export const CHAT_MAX_LENGTH = 2000

// Shared by the server proxy and frontend API module. UI gets only this shape.
export function normalizeChatResponse(data: unknown): { success: true; reply: string } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(CHAT_ERROR)
  const record = data as Record<string, unknown>
  if (record.success === false) throw new Error(CHAT_ERROR)
  for (const key of ['reply', 'response', 'message', 'answer']) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return { success: true, reply: value.trim() }
  }
  throw new Error(CHAT_ERROR)
}
