export const GET_LIST_TASK_LISTS = `
query getListTaskList($specification: TaskListSpecificationInput){
    getListTaskList(specification: $specification){ 
        id, 
        name, 
        description, 
        icon, 
        priority, 
    }
}
`

export const INSERT_TASK_LIST = `
mutation insertTaskList($taskList: TaskListInput) {
    insertTaskList(taskList: $taskList)
}
`

export const UPDATE_TASK_LIST = `
mutation updateTaskList($id: ID!, $taskList: TaskListInput) {
    updateTaskList(id: $id, taskList: $taskList)
}
`

export const DELETE_TASK_LIST = `
mutation deleteTaskList($id: ID!) {
    deleteTaskList(id: $id)
}
`
