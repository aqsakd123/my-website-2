import { Category } from '@app/pages/CategoryManagement/CategoryList'
import { Tag } from '@app/pages/Tags/TagList'
import { QuesAndAns } from '@app/pages/cards/StudyCard/QuesAndAnsList'

export type MemoInput = {
  id?: string
  name: string
  color: string
  type: 'memo' | 'study'
  status: number
  category?: Category
  tabCardList: TabDataInput[]
  qaList: QuesAndAns[]
  tags: Tag[]
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
      tabCardList {
        id
        tabName
        tabContent
        position
      }
      tags {
        id
        name
        description 
        color 
        type
        icon
      }
      qaList {
        id
        question
        answer
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
  mutation ChangeStatusMemo($id: ID!, $status: Int!) {
    changeStatusMemo(id: $id, status: $status)
  }
`

export const DELETE_MEMO = `
  mutation DeleteMemo($id: ID!) {
    deleteMemo(id: $id)
  }
`
