export const GET_LIST_FINANCES = `
query getListFinance {
    getListFinance {
        id
        name
        initialAmount
        color
        icon
        description
        totalSum
    }
}
`

export const INSERT_FINANCE = `
mutation insertFinance($finance: FinanceInput) {
    insertFinance(finance: $finance)
}
`

export const UPDATE_FINANCE = `
mutation updateFinance($id: ID!, $finance: FinanceInput) {
    updateFinance(id: $id, finance: $finance)
}
`

export const DELETE_FINANCE = `
mutation deleteFinance($id: ID!) {
    deleteFinance(id: $id)
}
`
