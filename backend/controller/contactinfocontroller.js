const ContactInfo = require('../model/ContactInfo')

const DEFAULTS = {
  key: 'site',
  companyName: 'AVERE CO., LTD.',
  email: 'info@avere.example.com',
  phone: '+66 21245263',
  address:
    '2823/3 Charoen Krung Road, Bang Kho Laem,\nBang Kho Laem, Bangkok 10120',
  note: 'We reply within 24 hours.',
}

async function getOrCreate() {
  return ContactInfo.findOneAndUpdate(
    { key: 'site' },
    { $setOnInsert: DEFAULTS },
    { new: true, upsert: true }
  )
}

function trimStr(value, fallback) {
  if (value === undefined || value === null) return fallback
  return String(value).trim()
}

let contactinfocontroller = {
  show: async (req, res) => {
    try {
      let info = await getOrCreate()
      return res.json(info)
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  publicShow: async (req, res) => {
    try {
      let info = await getOrCreate()
      return res.json({
        companyName: info.companyName,
        email: info.email,
        phone: info.phone,
        address: info.address,
        note: info.note,
      })
    } catch (e) {
      return res.status(500).json({ msg: 'server error' })
    }
  },

  update: async (req, res) => {
    try {
      let existing = await getOrCreate()
      let companyName = trimStr(req.body.companyName, existing.companyName)
      let email = trimStr(req.body.email, existing.email)
      let phone = trimStr(req.body.phone, existing.phone)
      let address = trimStr(req.body.address, existing.address)
      let note = trimStr(req.body.note, existing.note)

      if (!companyName) {
        return res.status(400).json({ msg: 'Company name is required' })
      }
      if (!email) {
        return res.status(400).json({ msg: 'Email is required' })
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ msg: 'Invalid email format' })
      }
      if (!phone) {
        return res.status(400).json({ msg: 'Phone is required' })
      }
      if (!address) {
        return res.status(400).json({ msg: 'Address is required' })
      }

      existing.companyName = companyName
      existing.email = email
      existing.phone = phone
      existing.address = address
      existing.note = note
      await existing.save()
      return res.json(existing)
    } catch (e) {
      return res.status(500).json({ msg: 'Failed to update contact info' })
    }
  },
}

module.exports = contactinfocontroller
