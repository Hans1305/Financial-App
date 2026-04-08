import { SOUTH_AFRICAN_BANKS } from '@/lib/banking/saBanks'

export type CountryCode = 'ZA' | 'US' | 'GB' | 'EU' | 'AU' | 'CA'

export type Bank = {
  id: string
  name: string
}

export type Country = {
  code: CountryCode
  name: string
  locale: string
  currency: string
  banks: Bank[]
}

export const COUNTRIES: Country[] = [
  {
    code: 'ZA',
    name: 'South Africa',
    locale: 'en-ZA',
    currency: 'ZAR',
    banks: SOUTH_AFRICAN_BANKS.map((b) => ({ id: b.id, name: b.name })),
  },
  {
    code: 'US',
    name: 'United States',
    locale: 'en-US',
    currency: 'USD',
    banks: [
      { id: 'chase', name: 'Chase' },
      { id: 'bank_of_america', name: 'Bank of America' },
      { id: 'wells_fargo', name: 'Wells Fargo' },
      { id: 'citi', name: 'Citibank' },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    locale: 'en-GB',
    currency: 'GBP',
    banks: [
      { id: 'barclays', name: 'Barclays' },
      { id: 'hsbc', name: 'HSBC' },
      { id: 'lloyds', name: 'Lloyds' },
      { id: 'natwest', name: 'NatWest' },
    ],
  },
  {
    code: 'EU',
    name: 'Eurozone',
    locale: 'en-IE',
    currency: 'EUR',
    banks: [
      { id: 'generic_eu_1', name: 'Major Bank (EU)' },
      { id: 'generic_eu_2', name: 'Major Bank (EU)' },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    locale: 'en-AU',
    currency: 'AUD',
    banks: [
      { id: 'cba', name: 'Commonwealth Bank' },
      { id: 'westpac', name: 'Westpac' },
      { id: 'anz', name: 'ANZ' },
      { id: 'nab', name: 'NAB' },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    locale: 'en-CA',
    currency: 'CAD',
    banks: [
      { id: 'rbc', name: 'RBC' },
      { id: 'td', name: 'TD' },
      { id: 'bmo', name: 'BMO' },
      { id: 'scotia', name: 'Scotiabank' },
    ],
  },
]

export function getCountry(code: CountryCode) {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0]
}

