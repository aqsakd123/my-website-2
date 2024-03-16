import React, { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import CountdownFormDialog from './Dialog/CountdownFormDialog'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import countdownStore from '@app/store/countdownStore/CountdownStore'
import { RootState } from '@app/store/store'
import { useUnmount } from 'react-use'
import { Popconfirm } from 'antd'
import styled from 'styled-components'

import LoadingComponent from '@app/components/common/Loading/Loading'
import { fetchCountdownList, deleteCountdown } from '@app/api/countdown/countdown-api'

import { priorityOptions, selectionTypeOptions } from './Dialog/CountdownFormInput'
import CheckboxInner from '@app/components/common/Checkbox/Checkbox'

const StyledList = styled.div`
  padding: 20px;
`

const StyledItem = styled.div<{ $darkMode: boolean }>`
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ $darkMode }) => (!$darkMode ? '#d4d3d3' : '#4d4c4c')};

  border-radius: 20px;
  padding: 20px;
  margin-bottom: 10px;
`

export type Countdown = {
  id: string
} & CountdownBase

export type CountdownInput = {
  id?: string
} & CountdownBase

type CountdownBase = {
  name: string
  description?: string
  priority?: string
  isFinish?: boolean
  endDate: Date
  selectionType?: string
  innerSubTasks?: any /* TODO: replace any by relation */
  tags?: any /* TODO: replace any by relation */
  workspaces?: any /* TODO: replace any by relation */
  taskLists?: any /* TODO: replace any by relation */
  subTask?: any /* TODO: replace any by relation */
}

export type CountdownSpecification = {
  isFinish?: boolean
}

const CountdownList: React.FC = () => {
  const [countdownFormDialogMode, setCountdownFormDialogMode] = useState<DialogState>('none')
  const [specification, setSpecification] = useState<CountdownSpecification>({ isFinish: false })

  const [isFinish, setIsFinish] = React.useState<boolean | undefined>(false)
  const { loadingStatus, dataList } = useSelector((state: RootState) => state.countdownStore)
  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const countdownList = dataList || []

  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        dispatch(countdownStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchCountdownList(specification)
        dispatch(countdownStore.actions.setCountdownList(fetchedData || []))
      } catch (error) {
        console.error(error)
      } finally {
        dispatch(countdownStore.actions.setLoadingStatus('Loaded'))
      }
    }
    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus])

  useUnmount(() => {
    dispatch(countdownStore.actions.clearAll())
  })

  const handleClickEditCountdown = (item: Countdown) => {
    dispatch(countdownStore.actions.setEditItem(item))
    setCountdownFormDialogMode('edit')
  }

  const handleClickAddNew = () => {
    setCountdownFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setCountdownFormDialogMode('none')
    dispatch(countdownStore.actions.setEditItem(undefined))
  }

  const handleClickDeleteCountdown = async (item: Countdown) => {
    try {
      if (item.id) {
        await deleteCountdown(item.id)
        dispatch(countdownStore.actions.setLoadingStatus('NotLoad'))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSetSpecification = () => {
    setSpecification({
      isFinish,
    })
    dispatch(countdownStore.actions.setLoadingStatus('NotLoad'))
  }

  return (
    <StyledList>
      {loadingStatus !== 'Loaded' && <LoadingComponent />}
      {countdownFormDialogMode !== 'none' && (
        <CountdownFormDialog mode={countdownFormDialogMode} onReturn={handleReturnFormDialog} />
      )}
      <Box mb={1} mt={1} display='flex' flexDirection='row-reverse' alignItems='center' gap={1}>
        <Button variant='outlined' onClick={handleClickAddNew}>
          Add new
        </Button>

        <Button variant='contained' onClick={handleSetSpecification}>
          Search
        </Button>

        <Box display='flex' flexDirection='column'>
          <CheckboxInner
            label='IsFinish'
            id='isFinish-search'
            name='isFinish'
            checked={isFinish}
            onChange={(value) => setIsFinish(value)}
          />
        </Box>
      </Box>

      <Box>
        {countdownList.map((countdown) => {
          return (
            <StyledItem key={countdown.id} $darkMode={darkMode}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Name: {countdown.name}</span>
                <span>Description: {countdown.description}</span>
                <span>
                  Priority:
                  {priorityOptions?.find((option) => option.value === countdown.priority)?.label}
                </span>
                <span>
                  Type:
                  {
                    selectionTypeOptions?.find((option) => option.value === countdown.selectionType)
                      ?.label
                  }
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={() => handleClickEditCountdown(countdown)}>
                  <Edit fontSize='small' />
                </Button>
                <Popconfirm
                  title='Are you sure you want to delete this countdown?'
                  onConfirm={() => handleClickDeleteCountdown(countdown)}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button variant='text' onClick={(e) => e.stopPropagation()}>
                    <Close />
                  </Button>
                </Popconfirm>
              </div>
            </StyledItem>
          )
        })}
      </Box>
    </StyledList>
  )
}

export default CountdownList
