import { DialogContent } from '@app/components/common/Dialog/Dialog'
import DialogActionButton from '@app/components/common/Dialog/DialogActionButton'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions/DialogActions'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { WorkSpace, WorkSpaceInput } from '../WorkSpaceList'
import { yupDate, yup } from '@app/helpers/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextInputField from '@app/components/common/TextInputField/TextInputField'
import { useDispatch } from 'react-redux'
import CalendarPickerField from '@app/components/common/CalendarPicker/CalendarPickerField'
import workSpaceStore from '@app/store/workSpaceStore/WorkSpaceStore'

const validationSchema = yup.object().shape({
  name: yup.string().nullable().label('Name').required().max(50),
  description: yup.string().nullable().label('Description').required().max(3000),
  startDate: yupDate().label('Start Date').required(),
})

export type FormProps = {
  id: string
  defaultValues?: WorkSpaceInput
  onSubmit: ((data: any) => void) | ((data: any) => Promise<void>)
}

const WorkSpaceFormInput: React.FC<FormProps> = (props: FormProps) => {
  const { id, defaultValues, onSubmit } = props

  const dispatch = useDispatch()

  const formMethods = useForm<any>({
    mode: 'onChange',
    defaultValues: { ...defaultValues },
    resolver: yupResolver(validationSchema),
  })

  const { handleSubmit, control, formState } = formMethods
  const { errors, isDirty } = formState

  useEffect(() => {
    dispatch(workSpaceStore.actions.setDirty(isDirty))
  }, [isDirty])

  const handleSubmitForm = handleSubmit(async (data: WorkSpaceInput) => {
    // convert from type WorkSpaceInput to WorkSpace
    const submitData: WorkSpace = { ...data }
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
              maxLength={50}
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
              required
              maxLength={3000}
            />
          </div>
          <div>
            <CalendarPickerField
              id={`input-startDate-${id}`}
              name='startDate'
              label='Start Date'
              control={control}
              error={Boolean(errors['startDate']?.message)}
              errorMessage={errors['startDate']?.message as string}
              required
            />
          </div>
          <div>
            <CalendarPickerField
              id={`input-endDate-${id}`}
              name='endDate'
              label='End Date'
              control={control}
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

export default WorkSpaceFormInput
