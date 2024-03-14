import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch } from 'react-redux'
import { Popconfirm } from 'antd'
import styled from 'styled-components'

import { deleteQuesAndAns } from '@app/api/memo/ques-and-ans-api'
import QuesAndAnsFormDialog from '../memo/Dialog/QuesAndAnsFormDialog'
import { MemoInput } from '@app/api/memo/memo-type'
import Dialog, { DialogContent } from '@app/components/common/Dialog/Dialog'
import memoStore from '@app/store/memoStore/MemoStore'

const StyledList = styled.div`
  border: 1px solid gray;
  border-radius: 20px;
  padding: 20px;
`

const StyledItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
  border-radius: 20px;
  padding: 20px;
`

export type QuesAndAns = {
  id: string
} & QuesAndAnsBase

export type QuesAndAnsInput = {
  id: string
} & QuesAndAnsBase

type QuesAndAnsBase = {
  question: string
  answer: string
  memo?: MemoInput
}

type Props = {
  dataList: QuesAndAns[]
  editMode: boolean
  parent: MemoInput
  handleClose: () => void
  changeQuesAnsState: (item: QuesAndAns[]) => void
}

const QuesAndAnsList: React.FC<Props> = (props: Props) => {
  const { dataList: quesAndAnsList = [], editMode, parent, handleClose, changeQuesAnsState } = props
  const [quesAndAnsFormDialogMode, setQuesAndAnsFormDialogMode] = useState<DialogState>('none')

  const [editItem, setEditItem] = React.useState<QuesAndAns | undefined>(undefined)
  const [editIdx, setEditIdx] = React.useState<number | undefined>(undefined)

  const dispatch = useDispatch()

  const handleClickEditQuesAndAns = (item: QuesAndAns, idx: number) => {
    setEditItem(item)
    if (editMode) {
      setEditIdx(idx)
    }
    setQuesAndAnsFormDialogMode('edit')
  }

  const handleClickAddNew = () => {
    setQuesAndAnsFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setQuesAndAnsFormDialogMode('none')
    setEditItem(undefined)
  }

  const handleClickDeleteQuesAndAns = async (item: QuesAndAns, idx: number) => {
    try {
      if (editMode) {
        const newDataList = [...quesAndAnsList]
        newDataList.splice(idx, 1)
        changeQuesAnsState(newDataList)
      } else {
        if (item.id) {
          await deleteQuesAndAns(item.id)
          dispatch(memoStore.actions.setLoadingStatus('NotLoad'))
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Dialog open onClickReturn={handleClose} title='Question and Answer'>
      <DialogContent>
        <StyledList>
          {quesAndAnsFormDialogMode !== 'none' && (
            <QuesAndAnsFormDialog
              parent={parent}
              editItem={editItem}
              editIdx={editIdx}
              memoEditMode={editMode}
              mode={quesAndAnsFormDialogMode}
              onReturn={handleReturnFormDialog}
              dataList={quesAndAnsList}
              changeQuesAnsState={changeQuesAnsState}
            />
          )}
          <Box mb={1} mt={1} display='flex' flexDirection='row-reverse' alignItems='center' gap={1}>
            <Button variant='outlined' onClick={handleClickAddNew}>
              Add new
            </Button>
          </Box>

          <Box>
            {quesAndAnsList.map((quesAndAns, idx) => {
              return (
                <StyledItem key={quesAndAns.id || idx}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Id: {quesAndAns.id}</span>
                    <span>Question: {quesAndAns.question}</span>
                    <span>Answer: {quesAndAns.answer}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button onClick={() => handleClickEditQuesAndAns(quesAndAns, idx)}>
                      <Edit fontSize='small' />
                    </Button>
                    <Popconfirm
                      title='Are you sure you want to delete this Q&A?'
                      onConfirm={() => handleClickDeleteQuesAndAns(quesAndAns, idx)}
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
      </DialogContent>
    </Dialog>
  )
}

export default QuesAndAnsList
