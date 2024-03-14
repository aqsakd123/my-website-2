import React, { useEffect, useState } from 'react'
import { Box, Button, Tooltip } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import TaskListFormDialog from './Dialog/TaskListFormDialog'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import { useUnmount } from 'react-use'
import { Popconfirm } from 'antd'
import styled from 'styled-components'

import LoadingComponent from '@app/components/common/Loading/Loading'
import { fetchTaskListList, deleteTaskList } from '@app/api/taskList/task-list-api'

import taskListStore from '@app/store/taskListStore/TaskListStore'
import SubTaskList, { SubTask } from '../SubTaskManagement/SubTaskList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName } from '@fortawesome/fontawesome-svg-core'
import { useParams } from 'react-router-dom'

const StyledList = styled.div`
  padding: 20px;
  padding-right: 40px;
  margin-right: 20px;
  width: fit-content;
  max-height: 600px;
`

const StyledItem = styled.div<{ $darkMode: boolean }>`
  width: 100%;
  max-height: 580px;
  width: 500px;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
  border-radius: 20px;
  padding: 20px;
  padding-left: 0px;
  background-color: ${({ $darkMode }) => ($darkMode ? '#1f1f1fe0' : '#80808063')};

  .header-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .tooltip-header {
    margin-left: 130px;
  }
  .task-list-header {
    font-size: 18px;
  }
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
  const darkMode = useSelector((state: RootState) => state.commonStore.darkMode)

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

  const handleClickEditTaskList = (item: TaskList) => {
    dispatch(taskListStore.actions.setEditItem(item))
    setTaskListFormDialogMode('edit')
  }

  const handleClickAddNew = () => {
    setTaskListFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setTaskListFormDialogMode('none')
    dispatch(taskListStore.actions.setEditItem(undefined))
  }

  const handleClickDeleteTaskList = async (item: TaskList) => {
    try {
      if (item.id) {
        await deleteTaskList(item.id)
        dispatch(taskListStore.actions.setLoadingStatus('NotLoad'))
      }
    } catch (e) {
      console.error(e)
    }
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
            <StyledItem $darkMode={darkMode} key={taskList.id}>
              <div className='header-container'>
                <Tooltip
                  title={
                    taskList.description ? (
                      <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                        {taskList.description}
                      </span>
                    ) : undefined
                  }
                  arrow
                  className='tooltip-header'
                >
                  <span className='task-list-header'>
                    {taskList.icon && <FontAwesomeIcon icon={['fas', taskList.icon as IconName]} />}
                    &nbsp;
                    {taskList.name}
                  </span>
                </Tooltip>
                <div style={{ display: 'flex', alignItems: 'center', minWidth: '130px' }}>
                  <Button onClick={() => handleClickEditTaskList(taskList)}>
                    <Edit fontSize='small' />
                  </Button>
                  <Popconfirm
                    title='Are you sure you want to delete this taskList?'
                    onConfirm={() => handleClickDeleteTaskList(taskList)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button variant='text' onClick={(e) => e.stopPropagation()}>
                      <Close />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
              <SubTaskList taskList={taskList} />
            </StyledItem>
          )
        })}
      </Box>
    </StyledList>
  )
}

export default TaskListList
