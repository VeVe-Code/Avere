import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import axios from '../helper/axios'

export const DEFAULT_CONTACT_INFO = {
  companyName: 'AVERE CO., LTD.',
  email: 'info@avere.example.com',
  phone: '+66 21245263',
  address:
    '2823/3 Charoen Krung Road, Bang Kho Laem,\nBang Kho Laem, Bangkok 10120',
  note: 'We reply within 24 hours.',
}

export function toTelHref(phone) {
  let n = String(phone || '').replace(/[^\d+]/g, '')
  return n ? `tel:${n}` : undefined
}

let ContactInfoContext = createContext({
  info: DEFAULT_CONTACT_INFO,
  loading: true,
  refresh: async () => {},
  setInfo: () => {},
})

export function ContactInfoProvider({ children }) {
  let [info, setInfo] = useState(DEFAULT_CONTACT_INFO)
  let [loading, setLoading] = useState(true)

  let refresh = useCallback(async () => {
    try {
      let res = await axios.get('/api/publiccontactinfo')
      if (res.data) {
        setInfo({ ...DEFAULT_CONTACT_INFO, ...res.data })
      }
    } catch (e) {
      // keep last known values
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <ContactInfoContext.Provider value={{ info, loading, refresh, setInfo }}>
      {children}
    </ContactInfoContext.Provider>
  )
}

export function useContactInfo() {
  return useContext(ContactInfoContext)
}
