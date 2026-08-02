module.exports = function toSafeUser(user) {
  if (!user) return null
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role || "customer",
    isVerified: user.isVerified !== false,
  }
}
