import React, { useEffect, useState } from 'react'
import { Box, Button, Tooltip } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import SubTaskFormDialog from './Dialog/SubTaskFormDialog'
import { DialogState, Loading } from '@app/store/commonStore/CommonStore'
import { useDispatch } from 'react-redux'

import { Popconfirm } from 'antd'
import styled from 'styled-components'
import taskListStore from '@app/store/taskListStore/TaskListStore'
import { fetchSubTaskList, deleteSubTask, changeStatusSubTask } from '@app/api/subTask/sub-task-api'
import { TaskList } from '../TaskListManagement/TaskListList'
import DateUtils from '@app/helpers/DateUtils'
import CheckboxInner from '@app/components/common/Checkbox/Checkbox'

const StyledList = styled.div`
  .task-container {
    max-height: 450px;
    overflow: auto;
    position: relative;
  }
`

const StyledItem = styled.div`
  border-radius: 20px;

  .period {
    border-radius: 2px;
    font-size: 10px;
    background-color: green;
    padding-left: 3px;
    padding-right: 3px;
    width: fit-content;
    color: white;
  }

  .task-header-container {
    word-break: break-word;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name-container {
      display: flex;
    }
  }

  .sub-inner-task-container {
    padding-left: 20px;
  }

  .completed {
    color: gray;
    text-decoration: line-through;
  }
`

export type SubTask = {
  id: string
  estimate?: number
} & SubTaskBase

export type SubTaskInput = {
  id: string
  estimate?: string
} & SubTaskBase

type SubTaskBase = {
  name: string
  description?: string
  isFinish?: boolean
  startDate?: Date
  endDate?: Date
  parentTaskList?: TaskList
  innerTasks?: SubTask[]
}

export type SubTaskSpecification = {
  parentTaskListId?: string
}
type Props = {
  taskList: TaskList
}

const SubTaskList: React.FC<Props> = (props: Props) => {
  const { taskList } = props

  const [subTaskFormDialogMode, setSubTaskFormDialogMode] = useState<DialogState>('none')
  const [specification] = useState<SubTaskSpecification>({
    parentTaskListId: taskList.id,
  })

  const [loadingStatus, setLoadingStatus] = React.useState<Loading>('NotLoad')
  const [dataList, setDataList] = React.useState<SubTask[]>([])
  const subTaskList = dataList || []

  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        setLoadingStatus('Loading')
        const fetchedData = await fetchSubTaskList(specification)
        setDataList(fetchedData || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingStatus('Loaded')
      }
    }
    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus])

  const handleClickEditSubTask = (item: SubTask) => {
    dispatch(taskListStore.actions.setSubTaskEditItem(item))
    setSubTaskFormDialogMode('edit')
  }

  const handleClickAddNew = () => {
    setSubTaskFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setSubTaskFormDialogMode('none')
    dispatch(taskListStore.actions.setSubTaskEditItem(undefined))
  }

  const handleClickDeleteSubTask = async (item: SubTask) => {
    try {
      if (item.id) {
        await deleteSubTask(item.id)
        setLoadingStatus('NotLoad')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleChangeStatusSubTask = async (item: SubTask, value: boolean) => {
    try {
      if (item.id) {
        await changeStatusSubTask(item.id, value)
        setLoadingStatus('NotLoad')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <StyledList>
      {subTaskFormDialogMode !== 'none' && (
        <SubTaskFormDialog
          setLoadingStatus={setLoadingStatus}
          parent={taskList}
          mode={subTaskFormDialogMode}
          onReturn={handleReturnFormDialog}
        />
      )}
      <Box mb={1} mt={1} display='flex' flexDirection='row-reverse' alignItems='center' gap={1}>
        <Button className='add-btn' size='small' variant='outlined' onClick={handleClickAddNew}>
          Add new
        </Button>
      </Box>

      <Box className='task-container'>
        {subTaskList.map((subTask) => {
          return (
            <StyledItem key={subTask.id}>
              <div className='task-header-container'>
                <div className='name-container'>
                  <div className='checkbox-change-sts'>
                    <CheckboxInner
                      id='isFinish'
                      name='isFinish'
                      checked={subTask.isFinish}
                      onChange={(v) => handleChangeStatusSubTask(subTask, v)}
                    />
                  </div>
                  <Tooltip
                    title={
                      subTask.description ? (
                        <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                          {subTask.description}
                        </span>
                      ) : undefined
                    }
                    arrow
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className={subTask.isFinish ? 'completed' : ''}>{subTask.name}</span>
                      <div>
                        <div className='period'>
                          {subTask.startDate
                            ? 'Start:' +
                              DateUtils.formatDate(new Date(subTask.startDate)) +
                              (subTask.startDate ? '-' : '')
                            : ''}
                          {subTask.endDate
                            ? 'End:' + DateUtils.formatDate(new Date(subTask.endDate))
                            : ''}
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button onClick={() => handleClickEditSubTask(subTask)}>
                    <Edit fontSize='small' />
                  </Button>
                  <Popconfirm
                    title='Are you sure you want to delete this subTask?'
                    onConfirm={() => handleClickDeleteSubTask(subTask)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button variant='text' onClick={(e) => e.stopPropagation()}>
                      <Close />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
              <div className='sub-inner-task-container'>
                <>
                  {subTask?.innerTasks &&
                    subTask?.innerTasks?.length > 0 &&
                    subTask?.innerTasks.map((innerTask) => {
                      return (
                        <div>
                          <CheckboxInner
                            id='isFinish'
                            name='isFinish'
                            checked={innerTask.isFinish}
                            onChange={(v) => handleChangeStatusSubTask(innerTask, v)}
                            disabled={subTask.isFinish}
                          />
                          <span
                            className={
                              innerTask.isFinish || subTask.isFinish ? 'completed' : 'not-done'
                            }
                          >
                            {innerTask.name}
                          </span>
                        </div>
                      )
                    })}
                </>
              </div>
            </StyledItem>
          )
        })}
      </Box>
    </StyledList>
  )
}

export default SubTaskList
