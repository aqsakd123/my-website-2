export const GET_LIST_COUNTDOWNS = `
query getListCountdown($specification: CountdownSpecificationInput){
    getListCountdown(specification: $specification){ 
        id, 
        name, 
        description, 
        priority, 
        isFinish, 
        endDate, 
        selectionType,
        innerSubTasks { id, name },
        tags { id, name },
        workspaces { id, name },
        taskLists { id, name },
        subTask {id, name }
    }
}
`

export const INSERT_COUNTDOWN = `
mutation insertCountdown($countdown: CountdownInput) {
    insertCountdown(countdown: $countdown)
}
`

export const UPDATE_COUNTDOWN = `
mutation updateCountdown($id: ID!, $countdown: CountdownInput) {
    updateCountdown(id: $id, countdown: $countdown)
}
`

export const DELETE_COUNTDOWN = `
mutation deleteCountdown($id: ID!) {
    deleteCountdown(id: $id)
}
`
