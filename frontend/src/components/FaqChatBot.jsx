import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send, UserRound } from 'lucide-react'
import { QUICK_PROMPTS, matchFaq, wantsHuman, isGreeting, GREETING_REPLY, relatedPath } from '../data/faqBot'
import { openCrispLiveChat } from '../helpers/crisp'

const WELCOME =
  'Hi there — thanks for stopping by. I’m here to help with simple questions about Avere, our services, and how to reach us. If I’m not sure, I can connect you to a real teammate.'

function botReply(text) {
  if (wantsHuman(text)) {
    return {
      type: 'handoff',
      text: 'Of course. I’ll open live chat so a teammate can help you personally…',
    }
  }

  if (isGreeting(text)) {
    return { type: 'answer', text: GREETING_REPLY }
  }

  const hit = matchFaq(text)
  if (hit) {
    return {
      type: 'answer',
      text: hit.answer,
      related: relatedPath(hit.id),
    }
  }

  return {
    type: 'unknown',
    text: 'I’m not fully sure I understood that. You can try asking about our company or services, or talk to a human — we’re happy to help.',
  }
}

export default function FaqChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ id: 'w', role: 'bot', text: WELCOME }])
  const listRef = useRef(null)

  useEffect(() => {
    if (!open || !listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  function handoffToHuman(reason) {
    const note = reason
      ? `Visitor asked for help: ${reason}`
      : 'Visitor requested live chat from the website assistant.'
    setMessages((m) => [
      ...m,
      {
        id: `h-${Date.now()}`,
        role: 'bot',
        text: 'Opening live chat now — a teammate will take it from here.',
      },
    ])
    setOpen(false)
    openCrispLiveChat(note)
  }

  function sendText(raw) {
    const text = String(raw || '').trim()
    if (!text) return

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text }
    const reply = botReply(text)

    setMessages((m) => [...m, userMsg])
    setInput('')

    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `b-${Date.now()}`,
          role: 'bot',
          text: reply.text,
          related: reply.related || null,
          showHandoff: reply.type === 'unknown' || reply.type === 'handoff',
        },
      ])
      if (reply.type === 'handoff') {
        window.setTimeout(() => handoffToHuman(text), 450)
      }
    }, 280)
  }

  function onSubmit(e) {
    e.preventDefault()
    sendText(input)
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9990] flex flex-col items-end gap-3 pointer-events-none">
      {open && (
        <div
          className="pointer-events-auto w-[min(100vw-1.5rem,22rem)] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/20 flex flex-col max-h-[min(70vh,32rem)]"
          role="dialog"
          aria-label="Avere assistant"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-950 text-white">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Avere Assistant</p>
              <p className="text-[11px] text-slate-400">FAQ · live handoff available</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 hover:bg-white/10 transition"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-slate-50 dark:bg-slate-950/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.related && (
                    <Link
                      to={msg.related}
                      className="mt-2 inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      Open page →
                    </Link>
                  )}
                  {msg.showHandoff && (
                    <button
                      type="button"
                      onClick={() => handoffToHuman(messages.filter((x) => x.role === 'user').at(-1)?.text)}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold py-2 hover:opacity-90 transition"
                    >
                      <UserRound size={14} />
                      Talk to a human
                    </button>
                  )}
                </div>
              </div>
            ))}

            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendText(q)}
                    className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={() => handoffToHuman()}
              className="mb-2 w-full rounded-lg border border-slate-200 dark:border-slate-600 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
            >
              <UserRound size={13} />
              Talk to a human (live chat)
            </button>
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Avere…"
                className="flex-1 min-w-0 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3 transition"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 flex items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        aria-label={open ? 'Close assistant' : 'Open assistant'}
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}
