import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useDispatch, useSelector } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import WorkSpaceFormInput from './WorkSpaceFormInput'
import { WorkSpaceInput, WorkSpace } from '../WorkSpaceList'
import { RootState } from '@app/store/store'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { insertWorkSpace, updateWorkSpace } from '@app/api/workSpace/work-space-api'

import workSpaceStore from '@app/store/workSpaceStore/WorkSpaceStore'
import dayjs from 'dayjs'

type FormProps = {
  mode: DialogState
  onReturn: () => void
}

const WorkSpaceFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, mode } = props

  const { editItem, dirty: isDirty } = useSelector((state: RootState) => state.workSpaceStore)

  const confirm = useConfirm()
  const dispatch = useDispatch()

  const handleSubmit = async (data: WorkSpace) => {
    try {
      if (mode === 'add') {
        await insertWorkSpace({
          ...data,
        })
      } else if (mode === 'edit' && editItem?.id) {
        const newData: WorkSpace = {
          ...editItem,
          ...data,
        }
        await updateWorkSpace(editItem?.id, newData)
      }
      dispatch(workSpaceStore.actions.setLoadingStatus('NotLoad'))
      onReturn()
    } catch (error) {
      console.error(error)
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

  let defaultValue: WorkSpaceInput | undefined = undefined
  if (mode === 'edit' && editItem) {
    defaultValue = {
      ...editItem,
      startDate: dayjs(editItem?.startDate),
      endDate: dayjs(editItem?.endDate),
    }
  }

  return (
    <Dialog
      open
      title={mode === 'add' ? 'Add Form' : 'Edit Form'}
      onClickReturn={handleClickReturn}
      fullWidth
      selfContentAndActions
    >
      <WorkSpaceFormInput
        id={mode === 'add' ? 'add-workSpace' : 'edit-workSpace'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default WorkSpaceFormDialog
