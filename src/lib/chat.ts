import { CHAT_ERROR, CHAT_MAX_LENGTH, normalizeChatResponse } from './chat-response'
export { CHAT_ERROR, CHAT_MAX_LENGTH, normalizeChatResponse } from './chat-response'
const SESSION_KEY = 'portfolio_chat_session_id'
// This project already has a server API layer. Keep the Make URL server-only.
// A proxy is recommended for production: URL hiding, validation, rate limiting
// and abuse protection belong on the server, never in chat UI components.
const endpoint = import.meta.env.VITE_CHAT_ENDPOINT || '/api/chat'
let memorySession: string | undefined

export type ChatPayload = { message: string; sessionId: string; page: string; timestamp: string; source: 'portfolio-chatbot' }

export function getChatSessionId(): string {
  if (memorySession) return memorySession
  try { memorySession = sessionStorage.getItem(SESSION_KEY) || undefined } catch { /* Private browsing may disallow storage. */ }
  memorySession ||= `session_${crypto.randomUUID()}`
  try { sessionStorage.setItem(SESSION_KEY, memorySession) } catch { /* Keep the session in memory instead. */ }
  return memorySession
}

// Adjust this one mapping if Make's webhook property names change.
export function mapChatRequest(payload: ChatPayload): ChatPayload { return payload }

export async function sendChatMessage(message: string, page: string): Promise<string> {
  const text = message.trim()
  if (!text || text.length > CHAT_MAX_LENGTH) throw new Error(CHAT_ERROR)
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 30000)
  try {
    const payload = mapChatRequest({ message: text, sessionId: getChatSessionId(), page, timestamp: new Date().toISOString(), source: 'portfolio-chatbot' })
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: controller.signal,
    })
    if (!response.ok) throw new Error(CHAT_ERROR)
    return normalizeChatResponse(await response.json()).reply
  } catch { throw new Error(CHAT_ERROR) }
  finally { window.clearTimeout(timer) }
}
