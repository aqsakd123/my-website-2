// import {  } from '@apollo/client'

export type MemoInput = {
  id?: string
  name: string
  color: string
  type: 'memo' | 'study'
  status: number
  tabCardList: TabDataInput[]
}

export type TabDataInput = {
  id?: string
  tabName: string
  tabContent: string
  position?: number
}

export const GET_LIST_MEMOS = `
  query GetListMemos($specification: MemoSpecificationInput) {
    getListMemo(specification: $specification) {
      id
      color
      name
      type
      status
      createdBy
      createdAt
      tabCardList {
        id
        tabName
        tabContent
        position
      }
    }
  }
`
export const INSERT_MEMO = `
  mutation InsertMemo($memo: MemoInput!) {
    insertMemo(memo: $memo)
  }
`

export const UPDATE_MEMO = `
  mutation UpdateMemo($id: ID!, $memo: MemoInput!) {
    updateMemo(id: $id, memo: $memo)
  }
`

export const CHANGE_STATUS_MEMO = `
  mutation ChangeStatus($id: ID!, $status: Int!) {
    changeStatus(id: $id, status: $status)
  }
`

export const DELETE_MEMO = `
  mutation DeleteMemo($id: ID!) {
    deleteMemo(id: $id)
  }
`
