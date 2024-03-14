import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useDispatch, useSelector } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import TaskListFormInput from './TaskListFormInput'
import { TaskListInput } from '../TaskListList'
import { RootState } from '@app/store/store'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { insertTaskList, updateTaskList } from '@app/api/taskList/task-list-api'
import taskListStore from '@app/store/taskListStore/TaskListStore'

type FormProps = {
  mode: DialogState
  onReturn: () => void
  workspaceId?: string
}

const TaskListFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, mode, workspaceId } = props

  const { editItem, dirty: isDirty } = useSelector((state: RootState) => state.tasklistStore)

  const confirm = useConfirm()
  const dispatch = useDispatch()

  const handleSubmit = async (data: TaskListInput) => {
    try {
      if (mode === 'add') {
        const insertData = workspaceId
          ? {
              ...data,
              workspace: { id: workspaceId },
            }
          : { ...data }
        await insertTaskList(insertData)
      } else if (mode === 'edit' && editItem?.id) {
        const newData: TaskListInput = {
          ...editItem,
          ...data,
        }
        await updateTaskList(editItem?.id, newData)
      }
      dispatch(taskListStore.actions.setLoadingStatus('NotLoad'))
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

  let defaultValue: TaskListInput | undefined = undefined
  if (mode === 'edit' && editItem) {
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
      <TaskListFormInput
        id={mode === 'add' ? 'add-taskList' : 'edit-taskList'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default TaskListFormDialog
