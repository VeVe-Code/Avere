const PRODUCT_CATEGORIES = [
  'Microsoft / Productivity Section',
  'Cloud Section',
  'System & Network',
  'Devices / Endpoint',
  'License & Subscription',
  'Security / Firewall',
]

const PRODUCT_CATEGORY_META = {
  'Microsoft / Productivity Section':
    'Microsoft productivity suites, collaboration tools, and workplace platforms.',
  'Cloud Section':
    'Public and hybrid cloud platforms for scalable infrastructure and apps.',
  'System & Network':
    'Servers, networking gear, and core IT infrastructure products.',
  'Devices / Endpoint':
    'Endpoints, workstations, and device management solutions.',
  'License & Subscription':
    'Software licenses, subscriptions, and compliance-ready entitlements.',
  'Security / Firewall':
    'Firewalls, endpoint security, and protection for modern networks.',
}

function isValidProductCategory(value) {
  return PRODUCT_CATEGORIES.includes(value)
}

function groupProductsByCategory(products = []) {
  return PRODUCT_CATEGORIES.map((category) => ({
    category,
    description: PRODUCT_CATEGORY_META[category] || '',
    items: products
      .filter((p) => p.category === category)
      .slice()
      .sort((a, b) =>
        String(a.title || '').localeCompare(String(b.title || ''), undefined, {
          sensitivity: 'base',
        })
      ),
  }))
}

module.exports = {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_META,
  isValidProductCategory,
  groupProductsByCategory,
}
