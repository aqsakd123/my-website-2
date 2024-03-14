import { DialogContent } from '@app/components/common/Dialog/Dialog'
import DialogActionButton from '@app/components/common/Dialog/DialogActionButton'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions/DialogActions'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FinanceInput } from '../FinanceList'
import { yupNumber, yup } from '@app/helpers/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextInputField from '@app/components/common/TextInputField/TextInputField'
import ColorInputField from '@app/components/common/ColorInput/ColorInputField'
import IconPickerInputField from '@app/components/common/IconPicker/IconPickerInputField'
import { useDispatch } from 'react-redux'
import financeStore from '@app/store/financeStore/FinanceStore'

const validationSchema = yup.object().shape({
  name: yup.string().label('Name').required().max(255),
  initialAmount: yupNumber().label('Initial Amount').required(),
  description: yup.string().label('Description').max(255),
})

export type FormProps = {
  id: string
  defaultValues?: FinanceInput
  onSubmit: ((data: any) => void) | ((data: any) => Promise<void>)
}

const FinanceFormInput: React.FC<FormProps> = (props: FormProps) => {
  const { id, defaultValues, onSubmit } = props
  const [icon, setIcon] = React.useState<string | undefined>(defaultValues?.icon)

  const dispatch = useDispatch()

  const formMethods = useForm<any>({
    mode: 'onChange',
    defaultValues: { ...defaultValues },
    resolver: yupResolver(validationSchema),
  })

  const { handleSubmit, control, formState } = formMethods
  const { errors, isDirty } = formState

  useEffect(() => {
    dispatch(financeStore.actions.setDirty(isDirty))
  }, [isDirty])

  const handleSubmitForm = handleSubmit(async (data: FinanceInput) => {
    const submitData = { ...data, icon }
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
            <TextInputField
              variant='outlined'
              type='number'
              id={`input-initialAmount-${id}`}
              name='initialAmount'
              label='Initial Amount'
              suffix='000.VND'
              control={control}
              error={Boolean(errors['initialAmount']?.message)}
              errorMessage={errors['initialAmount']?.message as string}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <ColorInputField
              id={`input-color-${id}`}
              name='color'
              label='Color'
              control={control}
            />
          </div>
          <div>
            <IconPickerInputField
              label='Icon'
              value={icon}
              onChange={setIcon}
              id='icon'
              name='icon'
            />
          </div>
          <div>
            <TextInputField
              variant='outlined'
              type='textarea'
              rowsMax={10}
              rowsMin={3}
              id={`input-description-${id}`}
              name='description'
              label='Description'
              control={control}
              error={Boolean(errors['description']?.message)}
              errorMessage={errors['description']?.message as string}
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

export default FinanceFormInput
