import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useDispatch, useSelector } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import AwardFormInput from './AwardFormInput'
import { AwardInput } from '../AwardList'
import { RootState } from '@app/store/store'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { insertAward, updateAward } from '@app/api/award/award-api'
import awardStore from '@app/store/awardStore/AwardStore'

type FormProps = {
  mode: DialogState
  onReturn: () => void
}

const AwardFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, mode } = props

  const { editItem, dirty: isDirty } = useSelector((state: RootState) => state.awardStore)

  const confirm = useConfirm()
  const dispatch = useDispatch()

  const handleSubmit = async (data: AwardInput) => {
    try {
      dispatch(awardStore.actions.setLoadingStatus('Loading'))
      if (mode === 'add') {
        await insertAward(data)
      } else if (mode === 'edit' && editItem?.id) {
        const newData: AwardInput = {
          ...editItem,
          ...data,
        }
        await updateAward(editItem?.id, newData)
      }
      dispatch(awardStore.actions.setLoadingStatus('NotLoad'))
      onReturn()
    } catch (error) {
      console.log(error)
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

  let defaultValue: AwardInput | undefined = undefined
  if (mode === 'edit') {
    defaultValue = editItem
  }

  return (
    <Dialog
      open
      title={mode === 'add' ? 'Add Form' : 'Edit Form'}
      onClickReturn={handleClickReturn}
      fullWidth
      selfContentAndActions
    >
      <AwardFormInput
        id={mode === 'add' ? 'add-award' : 'edit-award'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default AwardFormDialog
