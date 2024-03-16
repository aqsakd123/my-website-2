import React, { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import TaskListFormDialog from './Dialog/TaskListFormDialog'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import { useUnmount } from 'react-use'
import styled from 'styled-components'

import LoadingComponent from '@app/components/common/Loading/Loading'
import { fetchTaskListList } from '@app/api/taskList/task-list-api'

import taskListStore from '@app/store/taskListStore/TaskListStore'
import { SubTask } from '../SubTaskManagement/SubTaskList'
import { useParams } from 'react-router-dom'
import TaskListItem from './TaskListItem'

const StyledList = styled.div`
  padding: 20px;
  padding-right: 40px;
  margin-right: 20px;
  width: fit-content;
  max-height: 600px;
`

export type TaskList = {
  id: string
} & TaskListBase

export type TaskListInput = {
  id?: string
} & TaskListBase

type TaskListBase = {
  name: string
  description?: string
  icon?: string
  priority?: string
  subTasks?: SubTask
  workspace?: { id: string }
}

const TaskListList: React.FC = () => {
  const [taskListFormDialogMode, setTaskListFormDialogMode] = useState<DialogState>('none')

  const { loadingStatus, dataList } = useSelector((state: RootState) => state.tasklistStore)

  const taskListList = dataList || []

  const dispatch = useDispatch()
  const { id: workspaceId } = useParams()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        dispatch(taskListStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchTaskListList({
          workspaceId: workspaceId,
        })
        dispatch(taskListStore.actions.setTaskListList(fetchedData || []))
      } catch (error) {
        console.error(error)
      } finally {
        dispatch(taskListStore.actions.setLoadingStatus('Loaded'))
      }
    }
    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus, workspaceId])

  useEffect(() => {
    dispatch(taskListStore.actions.setLoadingStatus('NotLoad'))
  }, [workspaceId])

  useUnmount(() => {
    dispatch(taskListStore.actions.clearAll())
  })

  const handleClickAddNew = () => {
    setTaskListFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setTaskListFormDialogMode('none')
    dispatch(taskListStore.actions.setEditItem(undefined))
  }

  return (
    <StyledList>
      {loadingStatus !== 'Loaded' && <LoadingComponent />}
      {taskListFormDialogMode !== 'none' && (
        <TaskListFormDialog
          mode={taskListFormDialogMode}
          onReturn={handleReturnFormDialog}
          workspaceId={workspaceId}
        />
      )}
      <Box mb={1} mt={1} display='flex' flexDirection='row' alignItems='center' gap={1}>
        <Button variant='outlined' onClick={handleClickAddNew}>
          Add new
        </Button>
      </Box>

      <Box display='flex' gap='20px'>
        {taskListList.map((taskList) => {
          return (
            <TaskListItem
              key={taskList.id}
              taskList={taskList}
              setTaskListFormDialogMode={setTaskListFormDialogMode}
            />
          )
        })}
      </Box>
    </StyledList>
  )
}

export default TaskListList
