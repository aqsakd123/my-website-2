import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useDispatch, useSelector } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import TagFormInput from './TagFormInput'
import { TagInput } from '../TagList'
import { RootState } from '@app/store/store'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { insertTag, updateTag } from '@app/api/tag/tag-api'
import tagStore from '@app/store/tagStore/TagStore'

type FormProps = {
  mode: DialogState
  onReturn: () => void
}

const TagFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, mode } = props

  const { editItem, type, dirty: isDirty } = useSelector((state: RootState) => state.tagStore)

  const confirm = useConfirm()
  const dispatch = useDispatch()

  const handleSubmit = async (data: TagInput) => {
    try {
      dispatch(tagStore.actions.setLoadingStatus('Loading'))
      if (mode === 'add') {
        const newData: TagInput = {
          ...data,
          type,
        }
        await insertTag(newData)
      } else if (mode === 'edit' && editItem?.id) {
        const newData: TagInput = {
          ...editItem,
          ...data,
        }
        await updateTag(editItem?.id, newData)
      }
      dispatch(tagStore.actions.setLoadingStatus('NotLoad'))
      onReturn()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickReturn = async () => {
    if (
      isDirty &&
      !(await confirm({ title: 'Confirm', message: 'Are you sure to close dialog?' }))
    ) {
      return
    }
    onReturn()
  }

  let defaultValue: TagInput | undefined = undefined
  if (mode === 'edit') {
    defaultValue = editItem
  }

  return (
    <Dialog
      open
      title={mode === 'add' ? 'Add Form' : 'Edit Form'}
      onClickReturn={handleClickReturn}
      fullWidth
      selfContentAndActions
    >
      <TagFormInput
        id={mode === 'add' ? 'add-tag' : 'edit-tag'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default TagFormDialog
