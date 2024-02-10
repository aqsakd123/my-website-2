import { Button, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import Memo from '../memo/Components/Memo'
import { Specfication, fetchMemoList, insertMemo } from '@app/api/memo/memo-api'
import AddEditDialog from '../memo/Dialog/AddEditDialog'
import { MemoInput, TabDataInput } from '@app/api/memo/memo-type'
import { RootState } from '@app/store/store'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUnmount } from 'react-use'
import memoStore from '@app/store/memoStore/MemoStore'
import React from 'react'
import SearchButton from '../memo/Components/SearchButton'

type Props = {
  screenId?: string
}

const StudyList: React.FC<Props> = () => {
  const { loadingStatus, dataList } = useSelector((state: RootState) => state.memoStore)

  const [isDialogOpen, setDialogOpen] = useState(false)
  const [specification, setSpecification] = useState<Specfication>({ type: 'study' })

  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        dispatch(memoStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchMemoList(specification)
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

  const handleSetSpecification = (item: Specfication) => {
    setSpecification(item)
    dispatch(memoStore.actions.setLoadingStatus('NotLoad'))
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
      <SearchButton setSpecification={handleSetSpecification} specification={specification} />
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
