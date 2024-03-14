import React, { useEffect, useState } from 'react'
import { Box, Button, Grid } from '@mui/material'
import FinanceFormDialog from './Dialog/FinanceFormDialog'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import financeStore from '@app/store/financeStore/FinanceStore'
import { fetchFinanceList } from '@app/api/finance/finance-api'
import { RootState } from '@app/store/store'
import { useUnmount } from 'react-use'
import FinanceItem from './FinanceItem'

export type Finance = {
  id: string
  totalSum?: number
} & FinanceBase

export type FinanceInput = {
  id?: string
} & FinanceBase

type FinanceBase = {
  name: string
  initialAmount: number
  color?: string
  icon?: string
  description?: string
  transactions?: any
}
const FinanceList: React.FC = () => {
  const [financeFormDialogMode, setFinanceFormDialogMode] = useState<DialogState>('none')

  const { loadingStatus, dataList } = useSelector((state: RootState) => state.financeStore)

  const financeList = dataList || []

  let eachGridXs = 4
  if (financeList.length < 3) {
    eachGridXs = 12 / financeList.length
  }

  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        dispatch(financeStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchFinanceList()
        dispatch(financeStore.actions.setFinanceList(fetchedData || []))
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(financeStore.actions.setLoadingStatus('Loaded'))
      }
    }

    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus])

  useUnmount(() => {
    dispatch(financeStore.actions.clearAll())
  })

  const handleClickAddNew = () => {
    setFinanceFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setFinanceFormDialogMode('none')
    dispatch(financeStore.actions.setEditItem(undefined))
  }

  return (
    <>
      {financeFormDialogMode !== 'none' && (
        <FinanceFormDialog mode={financeFormDialogMode} onReturn={handleReturnFormDialog} />
      )}

      <Box mb={1} mt={1} display='flex' flexDirection='row-reverse'>
        <Button variant='outlined' onClick={handleClickAddNew}>
          Add Wallet
        </Button>
      </Box>
      <Box>
        <Grid container xs={12} spacing={3}>
          {financeList.map((finance) => {
            return (
              <Grid key={finance.id} item xs={12} sm={12} md={eachGridXs}>
                <FinanceItem finance={finance} handleCloseDialog={setFinanceFormDialogMode} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </>
  )
}

export default FinanceList
