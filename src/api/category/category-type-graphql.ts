export const INSERT_CATEGORY = `
mutation insertCategory($category: CategoryInput) {
    insertCategory(category: $category)
}
`

export const UPDATE_CATEGORY = `
mutation updateCategory($id: ID!, $category: CategoryInput) {
    updateCategory(id: $id, category: $category)
}
`

export const DELETE_CATEGORY = `
mutation deleteCategory($id: ID!) {
    deleteCategory(id: $id)
}
`
