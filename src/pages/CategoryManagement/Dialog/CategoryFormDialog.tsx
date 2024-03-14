import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useDispatch, useSelector } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import CategoryFormInput from './CategoryFormInput'
import { CategoryInput } from '../CategoryList'
import { RootState } from '@app/store/store'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { insertCategory, updateCategory } from '@app/api/category/category-api'

import categoryStore from '@app/store/categoryStore/CategoryStore'

type FormProps = {
  type: string
  mode: DialogState
  onReturn: () => void
  parentId?: string
}

const CategoryFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, mode, type, parentId } = props

  const { editItem, dirty: isDirty } = useSelector((state: RootState) => state.categoryStore)

  const confirm = useConfirm()
  const dispatch = useDispatch()

  const handleSubmit = async (data: CategoryInput) => {
    try {
      if (mode === 'add') {
        await insertCategory({
          ...data,
          type,
          parentCategoryId: parentId,
        })
      } else if (mode === 'edit' && editItem?.id) {
        const newData: CategoryInput = {
          name: data.name,
          description: data.description,
          type: editItem.type,
        }
        await updateCategory(editItem?.id, newData)
      }
      dispatch(categoryStore.actions.setLoadingStatus('NotLoad'))
      onReturn()
    } catch (error) {
      console.error(error)
      dispatch(categoryStore.actions.setLoadingStatus('Loaded'))
    }
  }

  const handleClickReturn = async () => {
    if (
      isDirty &&
      !(await confirm({
        title: 'Confirm',
        message: 'Are you sure to close dialog? All your data will be lost!',
      }))
    ) {
      return
    }
    onReturn()
  }

  let defaultValue: CategoryInput | undefined = undefined
  if (mode === 'edit') {
    defaultValue = { ...editItem }
  }

  return (
    <Dialog
      open
      title={mode === 'add' ? 'Add Form' : 'Edit Form'}
      onClickReturn={handleClickReturn}
      fullWidth
      selfContentAndActions
    >
      <CategoryFormInput
        id={mode === 'add' ? 'add-category' : 'edit-category'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default CategoryFormDialog
