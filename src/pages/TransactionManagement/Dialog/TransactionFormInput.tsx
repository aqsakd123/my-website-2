import { DialogContent } from '@app/components/common/Dialog/Dialog'
import DialogActionButton from '@app/components/common/Dialog/DialogActionButton'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions/DialogActions'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TransactionInput } from '../TransactionList'
import { yupDate, yup, yupNumber } from '@app/helpers/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextInputField from '@app/components/common/TextInputField/TextInputField'
import SelectField from '@app/components/common/SelectComponent/SelectField'
import { useDispatch } from 'react-redux'
import CalendarPickerField from '@app/components/common/CalendarPicker/CalendarPickerField'
import financeStore from '@app/store/financeStore/FinanceStore'

export const typeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'outcome', label: 'Outcome' },
]

export const OutcomeCategory = [
  { label: 'Food & Beverage', value: 'food' },
  { value: 'entertain', label: 'Entertainment' },
  { value: 'bill', label: 'Bill' },
  { value: 'health', label: 'Health' },
  { value: 'study', label: 'Stydu' },
  { value: 'shopping', label: 'Shopping' },
]

export const IncomeCategory = [
  { label: 'Salary', value: 'salary' },
  { value: 'bonus', label: 'Bonus' },
]

const validationSchema = yup.object({
  name: yup.string().label('Name').required().max(255),
  date: yupDate().label('Date').required(),
  type: yup.string().label('Type').required(),
  specificType: yup.string().label('SpecificType').required(),
  note: yup.string().label('Note').max(255).nullable(),
  moneyAmount: yupNumber().label('Amount').required(),
})

export type FormProps = {
  id: string
  defaultValues?: TransactionInput
  onSubmit: ((data: any) => void) | ((data: any) => Promise<void>)
}

const TransactionFormInput: React.FC<FormProps> = (props: FormProps) => {
  const { id, defaultValues, onSubmit } = props
  const dispatch = useDispatch()

  const formMethods = useForm<TransactionInput>({
    mode: 'onChange',
    defaultValues: { ...defaultValues },
    // @ts-ignore
    resolver: yupResolver(validationSchema),
  })

  const { handleSubmit, control, formState, watch } = formMethods
  const { errors, isDirty } = formState

  const type = watch('type')

  useEffect(() => {
    dispatch(financeStore.actions.setTransactionDirty(isDirty))
  }, [isDirty])

  const handleSubmitForm = handleSubmit(async (data: TransactionInput) => {
    const submitData = { ...data }
    onSubmit(submitData)
  })

  return (
    <>
      <DialogContent>
        <Box width='100%'>
          <div>
            <TextInputField
              variant='outlined'
              type='text'
              id={`input-name-${id}`}
              name='name'
              label='Name'
              control={control}
              error={Boolean(errors['name']?.message)}
              errorMessage={errors['name']?.message as string}
              required
              maxLength={255}
            />
          </div>
          <div>
            <CalendarPickerField
              id={`input-date-${id}`}
              name='date'
              label='Date'
              control={control}
              error={Boolean(errors['date']?.message)}
              errorMessage={errors['date']?.message as string}
              required
            />
          </div>
          <div>
            <TextInputField
              variant='outlined'
              type='number'
              id={`input-moneyAmount-${id}`}
              name='moneyAmount'
              label='Amount'
              control={control}
              suffix='000.VND'
              error={Boolean(errors['moneyAmount']?.message)}
              errorMessage={errors['moneyAmount']?.message as string}
              required
            />
          </div>
          <div>
            <SelectField
              options={typeOptions}
              id={`input-type-${id}`}
              name='type'
              label='Type'
              control={control}
              error={Boolean(errors['type']?.message)}
              errorMessage={errors['type']?.message as string}
              required
            />
          </div>
          <div>
            <SelectField
              options={type === 'income' ? IncomeCategory : OutcomeCategory}
              id={`input-specificType-${id}`}
              name='specificType'
              label='Category'
              control={control}
              error={Boolean(errors['specificType']?.message)}
              errorMessage={errors['specificType']?.message as string}
              required
            />
          </div>
          <div>
            <TextInputField
              variant='outlined'
              type='textarea'
              rowsMax={10}
              rowsMin={3}
              id={`input-note-${id}`}
              name='note'
              label='Note'
              control={control}
              error={Boolean(errors['note']?.message)}
              errorMessage={errors['note']?.message as string}
              maxLength={255}
            />
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <DialogActionButton variant='contained' id='form-submit-button' onClick={handleSubmitForm}>
          Submit
        </DialogActionButton>
      </DialogActions>
    </>
  )
}

export default TransactionFormInput
