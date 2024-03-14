import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useDispatch, useSelector } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import FinanceFormInput from './FinanceFormInput'
import { FinanceInput } from '../FinanceList'
import { RootState } from '@app/store/store'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { insertFinance, updateFinance } from '@app/api/finance/finance-api'
import financeStore from '@app/store/financeStore/FinanceStore'

type FormProps = {
  mode: DialogState
  onReturn: () => void
}

const FinanceFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, mode } = props

  const { editItem, dirty: isDirty } = useSelector((state: RootState) => state.financeStore)

  const confirm = useConfirm()
  const dispatch = useDispatch()

  const handleSubmit = async (data: FinanceInput) => {
    try {
      dispatch(financeStore.actions.setLoadingStatus('Loading'))
      if (mode === 'add') {
        await insertFinance({
          initialAmount: data.initialAmount,
          name: data.name,
          color: data.color,
          description: data.description,
          icon: data?.icon,
          id: data?.id,
        })
      } else if (mode === 'edit' && editItem?.id) {
        const newData: FinanceInput = {
          initialAmount: data.initialAmount,
          name: data.name,
          color: data.color,
          description: data.description,
          icon: data?.icon,
          id: editItem?.id,
        }
        await updateFinance(editItem?.id, newData)
      }
      dispatch(financeStore.actions.setLoadingStatus('NotLoad'))
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

  let defaultValue: FinanceInput | undefined = undefined
  if (mode === 'edit') {
    // @ts-ignore
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
      <FinanceFormInput
        id={mode === 'add' ? 'add-finance' : 'edit-finance'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default FinanceFormDialog
