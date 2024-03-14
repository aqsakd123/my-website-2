import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useSelector } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import SubTaskFormInput from './SubTaskFormInput'
import { SubTask, SubTaskInput } from '../SubTaskList'
import { RootState } from '@app/store/store'
import { DialogState, Loading } from '@app/store/commonStore/CommonStore'
import { insertSubTask, updateSubTask } from '@app/api/subTask/sub-task-api'
import dayjs from 'dayjs'
import { TaskList } from '@app/pages/TaskListManagement/TaskListList'

type FormProps = {
  mode: DialogState
  onReturn: () => void
  setLoadingStatus: (value: Loading) => void
  parent: TaskList
}

const SubTaskFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, setLoadingStatus, mode, parent } = props

  const { subTaskEditItem: editItem, subTaskDirty: isDirty } = useSelector(
    (state: RootState) => state.tasklistStore,
  )

  const confirm = useConfirm()

  const handleSubmit = async (data: SubTask) => {
    try {
      const parentItem = {
        parentTaskList: {
          id: parent.id,
          name: parent.name,
        },
      }

      if (mode === 'add') {
        await insertSubTask({
          ...data,
          ...parentItem,
        })
      } else if (mode === 'edit' && editItem?.id) {
        const newData: SubTask = {
          ...editItem,
          ...data,
          ...parentItem,
        }
        await updateSubTask(editItem?.id, newData)
      }
      setLoadingStatus('NotLoad')
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

  let defaultValue: SubTaskInput | undefined = undefined
  if (mode === 'edit') {
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
      <SubTaskFormInput
        id={mode === 'add' ? 'add-subTask' : 'edit-subTask'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default SubTaskFormDialog
