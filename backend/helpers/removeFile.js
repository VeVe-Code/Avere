let fs = require('fs').promises
let path = require('path')

// photo in DB is like "/filename.png"
// files live in public/images (host-ready); also check public/ for old files
let removeFile = async (filePath) => {
  let filename = path.basename(filePath || '')
  if (!filename) return

  let candidates = [
    path.join(__dirname, '../public/images', filename),
    path.join(__dirname, '../public', filename),
    filePath
  ]

  for (let p of candidates) {
    try {
      await fs.access(p)
      await fs.unlink(p)
      return
    } catch (e) {
      // try next
    }
  }
}

module.exports = removeFile
