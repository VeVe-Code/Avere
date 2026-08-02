function parseBool(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    let v = value.toLowerCase().trim();
    if (v === "true" || v === "1" || v === "yes") return true;
    if (v === "false" || v === "0" || v === "no") return false;
  }
  return Boolean(value);
}

/** Exclude hidden docs from public listings */
function excludeHidden(query = {}) {
  return { ...query, hidden: { $ne: true } };
}

module.exports = { parseBool, excludeHidden };
