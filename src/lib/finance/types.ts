export type AccountType = 'checking' | 'savings' | 'credit' | 'cash'

export type Account = {
  id: string
  name: string
  type: AccountType
  balanceCents: number
}

export type BudgetCategoryGroup =
  | 'Housing & Utilities'
  | 'Vehicles & Transport'
  | 'Living & Services'
  | 'Savings/Investments'
  | 'Other'

export type BudgetCategory = {
  id: string
  group: BudgetCategoryGroup
  name: string
  limitCents: number
  spentCents: number
}

export type Transaction = {
  id: string
  txnDate: string
  accountId: string
  categoryId: string
  amountCents: number
  merchant: string
  description: string
}

