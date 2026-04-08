export type SouthAfricanBankId =
  | 'absa'
  | 'african_bank'
  | 'capitec'
  | 'discovery'
  | 'fnb'
  | 'investec'
  | 'nedbank'
  | 'standard_bank'
  | 'tymebank'
  | 'bank_zero'

export type SouthAfricanBank = {
  id: SouthAfricanBankId
  name: string
}

export const SOUTH_AFRICAN_BANKS: SouthAfricanBank[] = [
  { id: 'absa', name: 'Absa' },
  { id: 'capitec', name: 'Capitec' },
  { id: 'discovery', name: 'Discovery Bank' },
  { id: 'fnb', name: 'FNB' },
  { id: 'investec', name: 'Investec' },
  { id: 'nedbank', name: 'Nedbank' },
  { id: 'standard_bank', name: 'Standard Bank' },
  { id: 'tymebank', name: 'TymeBank' },
  { id: 'african_bank', name: 'African Bank' },
  { id: 'bank_zero', name: 'Bank Zero' },
]

