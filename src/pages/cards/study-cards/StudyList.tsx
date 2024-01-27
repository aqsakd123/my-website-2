import { Button, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import Memo from '../memo/Components/Memo'
import { fetchMemoList, insertMemo } from '@app/api/memo/memo-api'
import AddEditDialog from '../memo/Dialog/AddEditDialog'
import { MemoInput, TabDataInput } from '@app/api/memo/memo-type'
import { RootState } from '@app/store/store'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUnmount } from 'react-use'
import memoStore from '@app/store/memoStore/MemoStore'
import React from 'react'

type Props = {
  screenId?: string
}

const StudyList: React.FC<Props> = () => {
  const { loadingStatus, dataList } = useSelector((state: RootState) => state.memoStore)

  const [isDialogOpen, setDialogOpen] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        dispatch(memoStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchMemoList()
        dispatch(memoStore.actions.setMemoList(fetchedData))
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(memoStore.actions.setLoadingStatus('Loaded'))
      }
    }

    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus])

  useUnmount(() => {
    dispatch(memoStore.actions.clearAll())
  })

  const handleAddButtonClick = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleAddStudyCard = async (value: TabDataInput) => {
    const addMemo: MemoInput = {
      color: '#FFFFFF',
      status: 1,
      type: 'study',
      name: value.tabName,
      tabCardList: [
        {
          tabContent: '',
          tabName: 'Default',
        },
      ],
    }
    await insertMemo(addMemo)
    dispatch(memoStore.actions.setLoadingStatus('NotLoad'))
    handleDialogClose()
  }

  if (loadingStatus === 'Loading' || loadingStatus === 'NotLoad') {
    return <>...Loading</>
  }

  return (
    <Grid container spacing={2}>
      {isDialogOpen && (
        <AddEditDialog
          handleDialogClose={handleDialogClose}
          handleSubmit={handleAddStudyCard}
          mode='study'
        />
      )}

      <Grid item xs={12}>
        <Button variant='contained' onClick={handleAddButtonClick}>
          Add New
        </Button>
      </Grid>
      {dataList?.map((memo) => {
        return <Memo key={memo.id} listData={memo} type='study' />
      })}
    </Grid>
  )
}

export default StudyList
