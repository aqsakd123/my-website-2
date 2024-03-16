import React from 'react'
import { Button, Tooltip } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import { Popconfirm } from 'antd'
import styled from 'styled-components'

import { deleteTaskList } from '@app/api/taskList/task-list-api'

import taskListStore from '@app/store/taskListStore/TaskListStore'
import SubTaskList from '../SubTaskManagement/SubTaskList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName } from '@fortawesome/fontawesome-svg-core'
import { TaskList } from './TaskListList'

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

type Props = {
  taskList: TaskList
  setTaskListFormDialogMode: (value: DialogState) => void
}

const TaskListItem: React.FC<Props> = (props: Props) => {
  const { taskList, setTaskListFormDialogMode } = props
  const darkMode = useSelector((state: RootState) => state.commonStore.darkMode)

  const dispatch = useDispatch()

  const handleClickEditTaskList = (item: TaskList) => {
    dispatch(taskListStore.actions.setEditItem(item))
    setTaskListFormDialogMode('edit')
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
}

export default TaskListItem
