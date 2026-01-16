// Configuración de Datos Bancarios para Depósitos

export interface BankAccount {
  id: string
  bankName: string
  accountType: string
  accountNumber: string
  accountHolder: string
  ci: string
  swift: string
  email: string
  active: boolean
}

export const bankAccounts: BankAccount[] = [
  {
    id: "banco-guayaquil-1",
    bankName: "Banco de Guayaquil",
    accountType: "Cuenta de Ahorros",
    accountNumber: "0045454253",
    accountHolder: "Tejena Alonso Rosa Irene",
    ci: "1717378457",
    swift: "GUAYECEG",
    email: "soportecvvinvest@proton.me",
    active: true,
  },
]

export function getActiveBankAccounts(): BankAccount[] {
  return bankAccounts.filter((account) => account.active)
}

export function getBankAccountById(id: string): BankAccount | undefined {
  return bankAccounts.find((account) => account.id === id)
}

export function getBankAccountByName(bankName: string): BankAccount | undefined {
  return bankAccounts.find(
    (account) => account.bankName.toLowerCase() === bankName.toLowerCase() && account.active
  )
}
