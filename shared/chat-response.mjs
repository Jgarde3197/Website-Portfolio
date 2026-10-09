// Canonical, runtime-ready ESM shared by the browser bundle and Node functions.
// Keep this module free of browser globals, TypeScript syntax and environment values.
export const CHAT_ERROR = "I couldn't reach the automation right now. Please try again, or use the contact form if you'd like to discuss a workflow."
export const CHAT_MAX_LENGTH = 2000

/** @param {unknown} data @returns {{ success: true, reply: string }} */
export function normalizeChatResponse(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(CHAT_ERROR)
  const record = /** @type {Record<string, unknown>} */ (data)
  if (record.success === false) throw new Error(CHAT_ERROR)
  for (const key of ['reply', 'response', 'message', 'answer']) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return { success: true, reply: value.trim() }
  }
  throw new Error(CHAT_ERROR)
}
