import { Box } from '@mui/material'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useMemo, useState } from 'react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import { fetchSubTaskList } from '@app/api/subTask/sub-task-api'
import { DialogState, Loading } from '@app/store/commonStore/CommonStore'
import taskListStore from '@app/store/taskListStore/TaskListStore'
import { SubTask } from '../SubTaskManagement/SubTaskList'
import { DatesSetArg, EventInput } from '@fullcalendar/core'
import { useUnmount } from 'react-use'

type Props = {
  screenId?: string
}
const Next7Days: React.FC<Props> = () => {
  const dispatch = useDispatch()

  const { loadingStatus } = useSelector((state: RootState) => state.tasklistStore)
  const [subTaskList, setSubTaskList] = React.useState<SubTask[]>([])
  const [taskListFormDialogMode, setTaskListFormDialogMode] = useState<DialogState>('none')

  const [currentMonth, setCurrentMonth] = useState<DatesSetArg | undefined>(undefined)

  const convertSubTaskToEvent = (subTask: SubTask): EventInput => {
    const event: EventInput = {
      id: subTask.id,
      title: subTask.name,
      start: subTask.startDate,
      end: subTask.endDate,
    }

    return event
  }

  const subTaskEvents = useMemo(() => {
    return subTaskList.map(convertSubTaskToEvent)
  }, [subTaskList])

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        if (!currentMonth) {
          return
        }
        const startDate = currentMonth?.start
        const endDate = currentMonth?.end

        dispatch(taskListStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchSubTaskList({
          startDate: startDate,
          endDate: endDate,
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
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        events={subTaskEvents}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth',
        }}
        datesSet={(v) => setCurrentMonth(v)}
      />
    </Box>
  )
}

export default Next7Days
