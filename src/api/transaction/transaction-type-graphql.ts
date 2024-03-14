export const GET_LIST_TRANSACTIONS = `
query getListTransaction($specification: TransactionSpecificationInput) {
    getListTransaction(specification: $specification) {
        id
        name
        date
        type
        specificType
        note
        moneyAmount
    }
}
`

export const INSERT_TRANSACTION = `
mutation insertTransaction($transaction: TransactionInput) {
    insertTransaction(transaction: $transaction)
}
`

export const UPDATE_TRANSACTION = `
mutation updateTransaction($id: ID!, $transaction: TransactionInput) {
    updateTransaction(id: $id, transaction: $transaction)
}
`

export const DELETE_TRANSACTION = `
mutation deleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
}
`
