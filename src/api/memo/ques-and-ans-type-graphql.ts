export const GET_LIST_QUES_AND_ANSS = `
query getListQuesAndAns{
    getListQuesAndAns{ 
        id, 
        question, 
        answer
    }
}
`

export const INSERT_QUES_AND_ANS = `
mutation insertQuesAndAns($quesAndAns: QuesAndAnsInput) {
    insertQuesAndAns(quesAndAns: $quesAndAns)
}
`

export const UPDATE_QUES_AND_ANS = `
mutation updateQuesAndAns($id: ID!, $quesAndAns: QuesAndAnsInput) {
    updateQuesAndAns(id: $id, quesAndAns: $quesAndAns)
}
`

export const DELETE_QUES_AND_ANS = `
mutation deleteQuesAndAns($id: ID!) {
    deleteQuesAndAns(id: $id)
}
`
