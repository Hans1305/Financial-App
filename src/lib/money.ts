export function formatMoneyFromCents(
  valueCents: number,
  options: {
    locale: string
    currency: string
  }
) {
  const value = valueCents / 100
  return new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: options.currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatZarFromCents(valueCents: number) {
  return formatMoneyFromCents(valueCents, { locale: 'en-ZA', currency: 'ZAR' })
}

export function toCents(value: number) {
  return Math.round(value * 100)
}

