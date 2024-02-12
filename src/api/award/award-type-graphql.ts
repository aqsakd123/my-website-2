export const GET_LIST_AWARDS = `
query getListAward {
    getListAward {
        id
        name
        description
        awardPoint
        color
    }
}
`

export const INSERT_AWARD = `
mutation insertAward($award: AwardInput) {
    insertAward(award: $award)
}
`

export const UPDATE_AWARD = `
mutation updateAward($id: ID!, $award: AwardInput) {
    updateAward(id: $id, award: $award)
}
`

export const DELETE_AWARD = `
mutation deleteAward($id: ID!) {
    deleteAward(id: $id)
}
`
