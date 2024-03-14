export const GET_LIST_WORK_SPACES = `
query getListWorkSpace{
    getListWorkSpace{ 
        id, 
        name, 
        description
    }
}
`

export const INSERT_WORK_SPACE = `
mutation insertWorkSpace($workSpace: WorkSpaceInput) {
    insertWorkSpace(workSpace: $workSpace)
}
`

export const UPDATE_WORK_SPACE = `
mutation updateWorkSpace($id: ID!, $workSpace: WorkSpaceInput) {
    updateWorkSpace(id: $id, workSpace: $workSpace)
}
`

export const DELETE_WORK_SPACE = `
mutation deleteWorkSpace($id: ID!) {
    deleteWorkSpace(id: $id)
}
`
