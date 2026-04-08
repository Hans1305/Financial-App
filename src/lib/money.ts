export function formatZarFromCents(valueCents: number) {
  const value = valueCents / 100
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(value)
}

export function toCents(value: number) {
  return Math.round(value * 100)
}

