import React, { useEffect, useState } from 'react'
import { Box, Button, Tooltip } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import AwardFormDialog from './Dialog/AwardFormDialog'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import awardStore from '@app/store/awardStore/AwardStore'
import { deleteAward, fetchAwardList } from '@app/api/award/award-api'
import { RootState } from '@app/store/store'
import { useUnmount } from 'react-use'
import { Popconfirm } from 'antd'
import styled from 'styled-components'
import ColorUtils from '@app/helpers/ColorUtils'
import TextInput from '@app/components/common/TextInputField/TextInput'

const StyledList = styled.div`
  .header-searcher {
    align-items: center;
    .input-container {
      flex-grow: 1;
      margin-right: 10px;
    }
  }

  .add-btn {
    height: 40px;
  }
`

const StyledItem = styled.div<{ $color: string; $darkMode: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ $color }) => $color || ''};
  border: 1px solid
    ${({ $color, $darkMode }) =>
      $color ? ColorUtils.getContrastingColor($color) : $darkMode ? 'white' : 'black'};
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
  color: ${({ $color }) => ($color ? ColorUtils.getContrastingColor($color) : '')};
  font-weight: bolder;

  & .MuiButton-root {
    color: ${({ $color }) => ($color ? ColorUtils.getContrastingColor($color) : '')};
  }

  .data {
    justify-content: space-between;
  }
`

export type Award = {
  id: string
} & AwardBase

export type AwardInput = {
  id?: string
} & AwardBase

type AwardBase = {
  name: string
  description: string
  color: string
  status: number
  awardPoint: number
  type?: string
  icon?: string
}
const AwardList: React.FC = () => {
  const [awardFormDialogMode, setAwardFormDialogMode] = useState<DialogState>('none')
  const [awardNameSearch, setAwardNameSearch] = useState<string>('')

  const { loadingStatus, dataList } = useSelector((state: RootState) => state.awardStore)
  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const awardList =
    dataList
      .filter((data) => data?.name?.includes(awardNameSearch)) // Filter the dataList
      .sort((a, b) => a?.awardPoint - b?.awardPoint) || [] // Sort the filtered awardList by awardPoint

  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        dispatch(awardStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchAwardList()
        dispatch(awardStore.actions.setAwardList(fetchedData || []))
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(awardStore.actions.setLoadingStatus('Loaded'))
      }
    }

    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus])

  useUnmount(() => {
    dispatch(awardStore.actions.clearAll())
  })

  const handleClickEditAward = (item: Award) => {
    dispatch(awardStore.actions.setEditItem(item))
    setAwardFormDialogMode('edit')
  }

  const handleClickAddNew = () => {
    setAwardFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setAwardFormDialogMode('none')
    dispatch(awardStore.actions.setEditItem(undefined))
  }

  const handleClickDeleteAward = async (item: Award) => {
    if (item.id) {
      await deleteAward(item.id)
      dispatch(awardStore.actions.setLoadingStatus('NotLoad'))
    }
  }

  return (
    <StyledList>
      {awardFormDialogMode !== 'none' && (
        <AwardFormDialog mode={awardFormDialogMode} onReturn={handleReturnFormDialog} />
      )}

      <Box className='header-searcher' mb={1} mt={1} display='flex'>
        <div className='input-container'>
          <TextInput
            variant='filled'
            id='search-name'
            name='name'
            label='Search Name'
            value={awardNameSearch}
            onChange={setAwardNameSearch}
            fullWidth
          />
        </div>
        <Button className='add-btn' variant='outlined' onClick={handleClickAddNew}>
          Add new
        </Button>
      </Box>
      <Box>
        {awardList.map((award) => {
          return (
            <StyledItem $color={award.color} $darkMode={darkMode}>
              <Tooltip
                title={
                  award.description ? (
                    <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                      {award.description}
                    </span>
                  ) : undefined
                }
                arrow
              >
                <div className='data'>
                  <span>[POINT: {award.awardPoint}]</span>
                  &nbsp;
                  <span>{award.name}</span>
                </div>
              </Tooltip>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button>
                  <Edit fontSize='small' onClick={() => handleClickEditAward(award)} />
                </Button>
                <Popconfirm
                  title='Are you sure you want to delete this award?'
                  onConfirm={() => handleClickDeleteAward(award)}
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

export default AwardList
