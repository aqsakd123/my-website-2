import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import WorkSpaceFormDialog from './Dialog/WorkSpaceFormDialog'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import workSpaceStore from '@app/store/workSpaceStore/WorkSpaceStore'
import { RootState } from '@app/store/store'
import { useUnmount } from 'react-use'
import { Popconfirm } from 'antd'
import styled from 'styled-components'

import LoadingComponent from '@app/components/common/Loading/Loading'
import { deleteWorkSpace } from '@app/api/workSpace/work-space-api'
import { useNavigate } from 'react-router-dom'

const StyledList = styled.div`
  border-radius: 20px;
  padding: 10px;
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

export type WorkSpace = {
  id: string
} & WorkSpaceBase

export type WorkSpaceInput = {
  id: string
} & WorkSpaceBase

type WorkSpaceBase = {
  name: string
  description: string
  startDate: Date
  endDate?: Date
  taskList?: any /* TODO: replace any by relation */
}

const WorkSpaceList: React.FC = () => {
  const [workSpaceFormDialogMode, setWorkSpaceFormDialogMode] = useState<DialogState>('none')

  const { loadingStatus, dataList } = useSelector((state: RootState) => state.workSpaceStore)
  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const workSpaceList = dataList || []

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useUnmount(() => {
    dispatch(workSpaceStore.actions.clearAll())
  })

  const handleClickEditWorkSpace = (item: WorkSpace) => {
    dispatch(workSpaceStore.actions.setEditItem(item))
    setWorkSpaceFormDialogMode('edit')
  }

  const handleClickAddNew = () => {
    setWorkSpaceFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setWorkSpaceFormDialogMode('none')
    dispatch(workSpaceStore.actions.setEditItem(undefined))
  }

  const handleClickDeleteWorkSpace = async (item: WorkSpace) => {
    try {
      if (item.id) {
        await deleteWorkSpace(item.id)
        dispatch(workSpaceStore.actions.setLoadingStatus('NotLoad'))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleNavigateToWorkspaceDetails = (id: string) => {
    navigate(`/work-spaces/${id}`)
  }

  return (
    <StyledList>
      {loadingStatus !== 'Loaded' && <LoadingComponent />}
      {workSpaceFormDialogMode !== 'none' && (
        <WorkSpaceFormDialog mode={workSpaceFormDialogMode} onReturn={handleReturnFormDialog} />
      )}
      <Box mb={1} mt={1} display='flex' flexDirection='row-reverse' alignItems='center' gap={1}>
        <Button variant='outlined' onClick={handleClickAddNew}>
          Add new
        </Button>
      </Box>

      <Box>
        {workSpaceList.map((workSpace) => {
          return (
            <StyledItem
              key={workSpace.id}
              $darkMode={darkMode}
              onClick={() => handleNavigateToWorkspaceDetails(workSpace.id)}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Name: {workSpace.name}</span>
                <span>Description: {workSpace.description}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={() => handleClickEditWorkSpace(workSpace)}>
                  <Edit fontSize='small' />
                </Button>
                <Popconfirm
                  title='Are you sure you want to delete this workSpace?'
                  onConfirm={() => handleClickDeleteWorkSpace(workSpace)}
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

export default WorkSpaceList
