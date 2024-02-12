import { DialogContent } from '@app/components/common/Dialog/Dialog'
import DialogActionButton from '@app/components/common/Dialog/DialogActionButton'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions/DialogActions'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AwardInput } from '../AwardList'
import { yup, yupNumber } from '@app/helpers/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextInputField from '@app/components/common/TextInputField/TextInputField'
import ColorInputField from '@app/components/common/ColorInput/ColorInputField'
import { useDispatch } from 'react-redux'
import awardStore from '@app/store/awardStore/AwardStore'

const validationSchema = yup.object().shape({
  name: yup.string().label('Name').required().max(255),
  description: yup.string().label('Description').max(255),
  awardPoint: yupNumber().label('Award Point').nullable().required(),
})
export type FormProps = {
  id: string
  defaultValues?: AwardInput
  onSubmit: ((data: any) => void) | ((data: any) => Promise<void>)
}

const AwardFormInput: React.FC<FormProps> = (props: FormProps) => {
  const { defaultValues, onSubmit } = props

  const dispatch = useDispatch()

  const formMethods = useForm<any>({
    mode: 'onChange',
    defaultValues: { ...defaultValues },
    resolver: yupResolver(validationSchema),
  })

  const { handleSubmit, control, formState } = formMethods
  const { errors, isDirty } = formState

  useEffect(() => {
    dispatch(awardStore.actions.setDirty(isDirty))
  }, [isDirty])

  const handleSubmitForm = handleSubmit(async (data: AwardInput) => {
    onSubmit(data)
  })

  return (
    <>
      <DialogContent>
        <Box width='100%'>
          <div>
            <TextInputField
              variant='outlined'
              type='text'
              id='name-id'
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
              type='textarea'
              rowsMax={10}
              rowsMin={3}
              id='description-id'
              name='description'
              label='Description'
              control={control}
              error={Boolean(errors['description']?.message)}
              errorMessage={errors['description']?.message as string}
              maxLength={255}
            />
          </div>
          <div>
            <TextInputField
              variant='outlined'
              type='number'
              id='awardPoint-id'
              name='awardPoint'
              label='Award Point'
              control={control}
              error={Boolean(errors['awardPoint']?.message)}
              errorMessage={errors['awardPoint']?.message as string}
              required
            />
          </div>
          <div>
            <ColorInputField id='color-id' name='color' label='Color' control={control} />
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

export default AwardFormInput
