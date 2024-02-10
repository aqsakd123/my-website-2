export const GET_LIST_TAGS = `
  query getListTag($specification: TagSpecificationInput) {
    getListTag(specification: $specification) {
      id
      name
      description
      color
      status
      type
      icon
    }
  }
`

export const INSERT_TAG = `
  mutation insertTag($tag: TagInput) {
    insertTag(tag: $tag)
  }
`

export const UPDATE_TAG = `
  mutation updateTag($id: ID!, $tag: TagInput) {
    updateTag(id: $id, tag: $tag)
  }
`

export const DELETE_TAG = `
  mutation deleteTag($id: ID!) {
    deleteTag(id: $id)
  }
`
