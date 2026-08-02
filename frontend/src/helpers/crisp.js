/** Helpers to open Crisp live chat (queued until Crisp is ready). */

export function hideCrispLauncher() {
  if (typeof window === 'undefined') return
  window.$crisp = window.$crisp || []
  window.$crisp.push(['do', 'chat:hide'])
}

export function openCrispLiveChat(prefillMessage) {
  if (typeof window === 'undefined') return
  window.$crisp = window.$crisp || []
  window.$crisp.push(['do', 'chat:show'])
  window.$crisp.push(['do', 'chat:open'])
  if (prefillMessage) {
    window.$crisp.push(['do', 'message:send', ['text', String(prefillMessage)]])
  }
}
