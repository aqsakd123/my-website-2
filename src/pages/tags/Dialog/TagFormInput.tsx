import { DialogContent } from '@app/components/common/Dialog/Dialog'
import DialogActionButton from '@app/components/common/Dialog/DialogActionButton'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions/DialogActions'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TagInput } from '../TagList'
import { yup } from '@app/helpers/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextInputField from '@app/components/common/TextInputField/TextInputField'
import ColorInputField from '@app/components/common/ColorInput/ColorInputField'
import IconPickerInputField from '@app/components/common/IconPicker/IconPickerInputField'
import { useDispatch } from 'react-redux'
import tagStore from '@app/store/tagStore/TagStore'

const validationSchema = yup.object().shape({
  name: yup.string().required().max(30).label('Name'),
  description: yup.string().max(255).label('Description'),
})

export type FormProps = {
  id: string
  defaultValues?: TagInput
  onSubmit: ((data: any) => void) | ((data: any) => Promise<void>)
}

const TagFormInput: React.FC<FormProps> = (props: FormProps) => {
  const { id, defaultValues, onSubmit } = props

  const [icon, setIcon] = useState<string | undefined>(defaultValues?.icon)

  const dispatch = useDispatch()

  const formMethods = useForm<any>({
    mode: 'onChange',
    defaultValues: { ...defaultValues },
    resolver: yupResolver(validationSchema),
  })

  const { handleSubmit, control, formState } = formMethods
  const { errors, isDirty } = formState

  useEffect(() => {
    dispatch(tagStore.actions.setDirty(isDirty))
  }, [isDirty])

  const handleSubmitForm = handleSubmit(async (data: TagInput) => {
    onSubmit({
      ...data,
      icon: icon,
    })
  })

  return (
    <>
      <DialogContent>
        <Box width='100%'>
          <TextInputField
            id='name'
            name='name'
            label='Name'
            variant='filled'
            control={control}
            error={Boolean(errors?.name)}
            errorMessage={errors.name?.message as string}
          />
          <TextInputField
            id='description'
            type='textarea'
            name='description'
            label='Description'
            variant='filled'
            control={control}
            rowsMin={3}
            rowsMax={5}
            error={Boolean(errors?.description)}
            errorMessage={errors.description?.message as string}
          />
          <ColorInputField id='color' name='color' control={control} label='Color' />
          <div style={{ marginTop: '8px', marginBottom: '8px' }}>
            <IconPickerInputField
              label='Icon'
              value={icon}
              onChange={(v) => setIcon(v)}
              id='icon'
              name={'icon'}
            />
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <DialogActionButton
          variant='contained'
          id={`${id}-form-submit-button`}
          onClick={handleSubmitForm}
        >
          Submit
        </DialogActionButton>
      </DialogActions>
    </>
  )
}

export default TagFormInput
