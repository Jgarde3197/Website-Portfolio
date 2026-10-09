import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChatCircleDots, PaperPlaneTilt, X } from '@phosphor-icons/react'
import { CHAT_ERROR, CHAT_MAX_LENGTH, sendChatMessage } from '@/lib/chat'
import '@/styles/automation-assistant.css'

type Message = { id: number; role: 'assistant' | 'visitor'; text: string }
const initial: Message = { id: 0, role: 'assistant', text: 'Hi! I can help you explore my automation projects, tools, and workflow services. What would you like to automate?' }
const suggestions = ['View my automation projects', 'Ask about Make.com', 'Ask about Zapier', 'Discuss a workflow']

export default function AutomationAssistant() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [messages, setMessages] = useState<Message[]>([initial])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inFlight = useRef(false)
  const sequence = useRef(1)
  const panelId = useId()
  const titleId = useId()
  const [keyboard, setKeyboard] = useState({ height: 0, bottom: 0 })

  // Modal portals are owned by existing components. Observe their mount rather
  // than changing their behavior, and keep this conversation alive in App.
  useEffect(() => {
    const update = () => {
      const modal = !!document.querySelector('.pmodal, dialog[open], .a11y.is-open')
      setBlocked(modal)
      if (modal) setOpen(false)
    }
    const observer = new MutationObserver(update)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open', 'class'] })
    update()
    return () => observer.disconnect()
  }, [])
  useEffect(() => { if (open) inputRef.current?.focus({ preventScroll: true }) }, [open])
  useEffect(() => {
    if (open && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, pending, error, open])
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const update = () => setKeyboard({ height: viewport.height, bottom: Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) })
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    update()
    return () => { viewport.removeEventListener('resize', update); viewport.removeEventListener('scroll', update) }
  }, [])

  const close = () => {
    setOpen(false)
    // On mobile the launcher is hidden while open; focus after React restores it.
    requestAnimationFrame(() => {
      if (!buttonRef.current?.closest('[hidden]')) buttonRef.current?.focus({ preventScroll: true })
    })
  }
  async function send(text = input) {
    const message = text.trim()
    if (!message || message.length > CHAT_MAX_LENGTH || inFlight.current) return
    inFlight.current = true
    setPending(true)
    setError(false)
    setInput('')
    setMessages(previous => [...previous, { id: sequence.current++, role: 'visitor', text: message }])
    try {
      const reply = await sendChatMessage(message, pathname)
      setMessages(previous => [...previous, { id: sequence.current++, role: 'assistant', text: reply }])
    } catch { setError(true) }
    finally { inFlight.current = false; setPending(false) }
  }

  return <div className="automation-chat" hidden={blocked} style={{ '--chat-keyboard-bottom': `${keyboard.bottom}px`, '--chat-visible-height': keyboard.height ? `${keyboard.height}px` : '100dvh' } as React.CSSProperties}>
    {open && <section id={panelId} className="automation-chat__panel" role="dialog" aria-modal="false" aria-labelledby={titleId} data-lenis-prevent
      onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close() } }}>
      <header className="automation-chat__header">
        <div><h2 id={titleId}>Automation Assistant</h2><p>Ask about workflows, tools, or project ideas.</p></div>
        <button type="button" aria-label="Close automation assistant" onClick={close}><X size={20} aria-hidden="true" /></button>
      </header>
      <div className="automation-chat__messages" ref={logRef} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" aria-busy={pending} tabIndex={0}>
        {messages.map(message => <p className={`automation-chat__message automation-chat__message--${message.role}`} key={message.id}><span className="sr-only">{message.role === 'visitor' ? 'You: ' : 'Assistant: '}</span>{message.text}</p>)}
        {messages.length === 1 && !input && <div className="automation-chat__suggestions">{suggestions.map(s => <button type="button" key={s} disabled={pending} onClick={() => void send(s)}>{s}</button>)}</div>}
        {pending && <p className="automation-chat__status" role="status">Assistant is thinking…</p>}
        {error && <div className="automation-chat__error" role="alert"><p>{CHAT_ERROR}</p><Link to="/contact" onClick={close}>Use the contact form ↗</Link></div>}
      </div>
      <form className="automation-chat__form" onSubmit={event => { event.preventDefault(); void send() }}>
        <div className="automation-chat__composer">
          <textarea ref={inputRef} value={input} onChange={event => setInput(event.target.value)} rows={2} maxLength={CHAT_MAX_LENGTH} placeholder="Ask about automation..." aria-label="Message to automation assistant"
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send() }
            }} />
          <button type="submit" aria-label="Send message" disabled={pending || !input.trim()}><PaperPlaneTilt size={20} aria-hidden="true" /></button>
        </div>
        <p>Please don't share passwords, API keys, or sensitive account information.</p>
      </form>
    </section>}
    <button type="button" className="automation-chat__launcher" ref={buttonRef} aria-label={open ? 'Close automation assistant' : 'Open automation assistant'} aria-expanded={open} aria-controls={open ? panelId : undefined} aria-haspopup="dialog" onClick={() => open ? close() : setOpen(true)}>
      <ChatCircleDots size={22} aria-hidden="true" /><span>Ask about automation</span>
    </button>
  </div>
}
