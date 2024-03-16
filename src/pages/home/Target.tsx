import { Box } from '@mui/material'
import { fetchSubTaskList } from '@app/api/subTask/sub-task-api'
import { useDispatch, useSelector } from 'react-redux'
import taskListStore from '@app/store/taskListStore/TaskListStore'
import { useEffect, useState } from 'react'
import { RootState } from '@app/store/store'
import { SubTask } from '../SubTaskManagement/SubTaskList'
import React from 'react'
import { DialogState, Loading } from '@app/store/commonStore/CommonStore'
import TaskListFormDialog from '../TaskListManagement/Dialog/TaskListFormDialog'
import SubTaskItem from '../SubTaskManagement/SubTaskItem'
import { useUnmount } from 'react-use'

type Props = {
  screenId?: string
}

const Target: React.FC<Props> = () => {
  const dispatch = useDispatch()

  const { loadingStatus } = useSelector((state: RootState) => state.tasklistStore)
  const [subTaskList, setSubTaskList] = React.useState<SubTask[]>([])
  const [taskListFormDialogMode, setTaskListFormDialogMode] = useState<DialogState>('none')

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        dispatch(taskListStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchSubTaskList({
          startDate: today,
          endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        })
        setSubTaskList(fetchedData || [])
      } catch (error) {
        console.error(error)
      } finally {
        dispatch(taskListStore.actions.setLoadingStatus('Loaded'))
      }
    }
    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus])

  useUnmount(() => {
    dispatch(taskListStore.actions.clearAll())
  })

  const handleReturnFormDialog = () => {
    setTaskListFormDialogMode('none')
    dispatch(taskListStore.actions.setEditItem(undefined))
  }

  const handleSetLoadingStatus = (value: Loading) => {
    dispatch(taskListStore.actions.setLoadingStatus(value))
  }

  return (
    <Box>
      {taskListFormDialogMode !== 'none' && (
        <TaskListFormDialog mode={taskListFormDialogMode} onReturn={handleReturnFormDialog} />
      )}

      {subTaskList &&
        subTaskList?.length > 0 &&
        subTaskList?.map((it) => {
          return (
            <SubTaskItem
              key={it.id}
              subTask={it}
              setSubTaskFormDialogMode={setTaskListFormDialogMode}
              setLoadingStatus={handleSetLoadingStatus}
            />
          )
        })}
    </Box>
  )
}

export default Target
