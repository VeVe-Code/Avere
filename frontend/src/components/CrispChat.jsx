import { useEffect } from 'react'
import { hideCrispLauncher } from '../helpers/crisp'

const WEBSITE_ID = import.meta.env.VITE_CRISP_WEBSITE_ID

/**
 * Loads Crisp in the background for live handoff.
 * Default launcher stays hidden — FaqChatBot opens it when needed.
 */
export default function CrispChat() {
  useEffect(() => {
    if (!WEBSITE_ID || typeof window === 'undefined') return

    window.$crisp = window.$crisp || []
    window.CRISP_WEBSITE_ID = WEBSITE_ID

    // Hide Crisp bubble so visitors use our FAQ bot first
    hideCrispLauncher()
    window.$crisp.push(['on', 'session:loaded', () => {
      hideCrispLauncher()
    }])

    if (document.getElementById('crisp-chat-script')) return

    const script = document.createElement('script')
    script.id = 'crisp-chat-script'
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  return null
}
