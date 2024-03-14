import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useDispatch } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import QuesAndAnsFormInput from './QuesAndAnsFormInput'
import { QuesAndAnsInput, QuesAndAns } from '../../StudyCard/QuesAndAnsList'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { insertQuesAndAns, updateQuesAndAns } from '@app/api/memo/ques-and-ans-api'
import { MemoInput } from '@app/api/memo/memo-type'
import memoStore from '@app/store/memoStore/MemoStore'

type FormProps = {
  onReturn: () => void
  mode: DialogState
  memoEditMode: boolean
  editItem?: QuesAndAns
  editIdx?: number
  parent: MemoInput
  dataList: QuesAndAns[]
  changeQuesAnsState: (value: QuesAndAns[]) => void
}

const QuesAndAnsFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const {
    onReturn,
    mode,
    editItem,
    memoEditMode,
    parent,
    dataList = [],
    changeQuesAnsState,
    editIdx,
  } = props

  const [isDirty, setIsDirty] = React.useState<boolean>(false)

  const confirm = useConfirm()
  const dispatch = useDispatch()

  const handleSubmit = async (data: QuesAndAns) => {
    try {
      if (memoEditMode) {
        const newDataList = [...dataList]
        if (mode === 'add') {
          newDataList.push(data)
        } else if (mode === 'edit') {
          if (editIdx === undefined) {
            return
          }
          newDataList.splice(editIdx, 1, {
            ...newDataList[editIdx],
            question: data.question,
            answer: data.answer,
          })
        }
        changeQuesAnsState(newDataList)
      } else {
        // @ts-ignore
        const parentItem: MemoInput = {
          id: parent.id,
        }
        if (mode === 'add') {
          await insertQuesAndAns({
            ...data,
            memo: parentItem,
          })
        } else if (mode === 'edit' && editItem?.id) {
          const newData: QuesAndAns = {
            ...editItem,
            ...data,
          }
          await updateQuesAndAns(editItem?.id, newData)
        }
        dispatch(memoStore.actions.setLoadingStatus('NotLoad'))
      }
      onReturn()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClickReturn = async () => {
    if (
      isDirty &&
      !(await confirm({
        title: 'Confirm',
        message: 'Are you sure to close dialog? All your data will be lost!',
      }))
    ) {
      return
    }
    onReturn()
  }

  let defaultValue: QuesAndAnsInput | undefined = undefined
  if (mode === 'edit' && editItem) {
    defaultValue = { ...editItem }
  }

  return (
    <Dialog
      open
      title={mode === 'add' ? 'Add Form' : 'Edit Form'}
      onClickReturn={handleClickReturn}
      fullWidth
      selfContentAndActions
    >
      <QuesAndAnsFormInput
        setIsDirty={setIsDirty}
        id={mode === 'add' ? 'add-quesAndAns' : 'edit-quesAndAns'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default QuesAndAnsFormDialog
