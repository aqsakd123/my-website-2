import { DialogContent } from '@app/components/common/Dialog/Dialog'
import DialogActionButton from '@app/components/common/Dialog/DialogActionButton'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions/DialogActions'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yup } from '@app/helpers/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextInputField from '@app/components/common/TextInputField/TextInputField'
import { useDispatch } from 'react-redux'
import { QuesAndAns, QuesAndAnsInput } from '../../StudyCard/QuesAndAnsList'

const validationSchema = yup.object().shape({
  question: yup.string().nullable().label('Question').required().max(300),
  answer: yup.string().nullable().label('Answer').required().max(2500),
})
export type FormProps = {
  id: string
  defaultValues?: QuesAndAnsInput
  onSubmit: ((data: any) => void) | ((data: any) => Promise<void>)
  setIsDirty: (value: boolean) => void
}

const QuesAndAnsFormInput: React.FC<FormProps> = (props: FormProps) => {
  const { id, defaultValues, onSubmit, setIsDirty } = props

  const dispatch = useDispatch()

  const formMethods = useForm<any>({
    mode: 'onChange',
    defaultValues: { ...defaultValues },
    resolver: yupResolver(validationSchema),
  })

  const { handleSubmit, control, formState } = formMethods
  const { errors, isDirty } = formState

  useEffect(() => {
    setIsDirty(isDirty)
  }, [isDirty])

  const handleSubmitForm = handleSubmit(async (data: QuesAndAnsInput) => {
    // convert from type QuesAndAnsInput to QuesAndAns
    const submitData: QuesAndAns = { ...data }
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
              id={`input-question-${id}`}
              name='question'
              label='Question'
              control={control}
              error={Boolean(errors['question']?.message)}
              errorMessage={errors['question']?.message as string}
              required
              maxLength={300}
            />
          </div>
          <div>
            <TextInputField
              variant='outlined'
              type='textarea'
              rowsMax={10}
              rowsMin={3}
              id={`input-answer-${id}`}
              name='answer'
              label='Answer'
              control={control}
              error={Boolean(errors['answer']?.message)}
              errorMessage={errors['answer']?.message as string}
              required
              maxLength={2500}
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

export default QuesAndAnsFormInput
