import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'
import { useSelector } from 'react-redux'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import TransactionFormInput from './TransactionFormInput'
import { TransactionInput } from '../TransactionList'
import { RootState } from '@app/store/store'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { insertTransaction, updateTransaction } from '@app/api/transaction/transaction-api'
import dayjs from 'dayjs'
import { Loading } from '@app/store/memoStore/MemoStore'
import { Finance } from '@app/pages/FinanceManagement/FinanceList'

type FormProps = {
  mode: DialogState
  onReturn: () => void
  setLoadingStatus: (value: Loading) => void
  finance: Finance
}

const TransactionFormDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, setLoadingStatus, mode, finance } = props

  const { transactionEditItem: editItem, transactionDirty: isDirty } = useSelector(
    (state: RootState) => state.financeStore,
  )

  const confirm = useConfirm()

  const handleSubmit = async (value: TransactionInput) => {
    try {
      setLoadingStatus('Loading')
      const data = { ...value, finance }
      if (mode === 'add') {
        await insertTransaction({
          date: data.date,
          moneyAmount: data.moneyAmount,
          name: data.name,
          specificType: data.specificType,
          type: data.type,
          // @ts-ignore
          finance: { id: data.finance.id },
          id: data.id,
          note: data.note,
        })
      } else if (mode === 'edit' && editItem?.id) {
        const newData: TransactionInput = {
          date: data.date,
          moneyAmount: data.moneyAmount,
          name: data.name,
          specificType: data.specificType,
          type: data.type,
          // @ts-ignore
          finance: {
            id: data.finance?.id,
          },
          id: editItem.id,
          note: data.note,
        }
        await updateTransaction(editItem?.id, newData)
      }
      setLoadingStatus('NotLoad')
      onReturn()
    } catch (error) {
      console.log(error)
    }
  }
  console.log(finance)
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

  let defaultValue: TransactionInput | undefined = {
    // @ts-ignore
    date: dayjs(new Date()),
  }
  if (mode === 'edit') {
    defaultValue = { ...editItem, date: dayjs(editItem?.date) }
  }

  return (
    <Dialog
      open
      title={mode === 'add' ? 'Add Form' : 'Edit Form'}
      onClickReturn={handleClickReturn}
      fullWidth
      selfContentAndActions
    >
      <TransactionFormInput
        id={mode === 'add' ? 'add-transaction' : 'edit-transaction'}
        defaultValues={defaultValue}
        onSubmit={handleSubmit}
      />
    </Dialog>
  )
}

export default TransactionFormDialog
