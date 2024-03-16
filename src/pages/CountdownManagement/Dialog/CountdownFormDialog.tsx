import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useDispatch, useSelector } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import CountdownFormInput from './CountdownFormInput'
import { CountdownInput, Countdown } from '../CountdownList'
import { RootState } from '@app/store/store'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { insertCountdown, updateCountdown } from '@app/api/countdown/countdown-api'

import countdownStore from '@app/store/countdownStore/CountdownStore'
import dayjs from 'dayjs'

type FormProps = {
  mode: DialogState
  onReturn: () => void
}

const CountdownFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, mode } = props

  const { editItem, dirty: isDirty } = useSelector((state: RootState) => state.countdownStore)

  const confirm = useConfirm()
  const dispatch = useDispatch()

  const handleSubmit = async (data: Countdown) => {
    try {
      if (mode === 'add') {
        await insertCountdown({
          ...data,
        })
      } else if (mode === 'edit' && editItem?.id) {
        const newData: Countdown = {
          ...editItem,
          ...data,
        }
        await updateCountdown(editItem?.id, newData)
      }
      dispatch(countdownStore.actions.setLoadingStatus('NotLoad'))
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

  let defaultValue: CountdownInput | undefined = undefined
  if (mode === 'edit' && editItem) {
    defaultValue = { ...editItem, endDate: dayjs(editItem?.endDate) }
  }

  return (
    <Dialog
      open
      title={mode === 'add' ? 'Add Form' : 'Edit Form'}
      onClickReturn={handleClickReturn}
      fullWidth
      selfContentAndActions
    >
      <CountdownFormInput
        id={mode === 'add' ? 'add-countdown' : 'edit-countdown'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default CountdownFormDialog
