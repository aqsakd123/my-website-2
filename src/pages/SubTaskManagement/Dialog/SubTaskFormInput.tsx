import { DialogContent } from '@app/components/common/Dialog/Dialog'
import DialogActionButton from '@app/components/common/Dialog/DialogActionButton'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions/DialogActions'
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { SubTask, SubTaskInput } from '../SubTaskList'
import { yup } from '@app/helpers/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextInputField from '@app/components/common/TextInputField/TextInputField'
import CheckboxInner from '@app/components/common/Checkbox/Checkbox'
import { useDispatch } from 'react-redux'
import CalendarPickerField from '@app/components/common/CalendarPicker/CalendarPickerField'
import subTaskStore from '@app/store/subTaskStore/SubTaskStore'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import { Divider, IconButton } from '@mui/material'
import { Popconfirm } from 'antd'
import { Close } from '@mui/icons-material'

const validationSchema = yup.object().shape({
  name: yup.string().nullable().label('Name').required().max(50),
  description: yup.string().nullable().label('Description').max(500),
  innerTasks: yup.array().of(
    yup.object().shape({
      name: yup.string().nullable().label('Name').required().max(50),
    }),
  ),
})

export type FormProps = {
  id: string
  defaultValues?: SubTaskInput
  onSubmit: ((data: SubTask) => void) | ((data: SubTask) => Promise<void>)
}

const SubTaskFormInput: React.FC<FormProps> = (props: FormProps) => {
  const { id, defaultValues, onSubmit } = props

  const dispatch = useDispatch()

  const formMethods = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      ...defaultValues,
      startDate: dayjs(defaultValues?.startDate),
      endDate: dayjs(defaultValues?.endDate),
    },
    resolver: yupResolver(validationSchema),
  })

  const { handleSubmit, control, formState } = formMethods
  const { errors, isDirty } = formState

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'innerTasks',
  })

  useEffect(() => {
    dispatch(subTaskStore.actions.setDirty(isDirty))
  }, [isDirty])

  const handleSubmitForm = handleSubmit(async (data: SubTaskInput) => {
    const submitData: SubTask = {
      ...data,
      innerTasks: data?.innerTasks?.map((item) => ({ ...item, estimate: Number(item.estimate) })),
      estimate: data.estimate !== undefined ? Number(data.estimate) : undefined,
    }
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
              maxLength={500}
            />
          </div>
          <div>
            <CalendarPickerField
              id={`input-startDate-${id}`}
              name='startDate'
              label='StartDate'
              control={control}
            />
          </div>
          <div>
            <CalendarPickerField
              id={`input-endDate-${id}`}
              name='endDate'
              label='EndDate'
              control={control}
            />
          </div>
          <div>
            <TextInputField
              variant='outlined'
              type='number'
              id={`input-estimate-${id}`}
              name='estimate'
              label='Estimate'
              control={control}
              suffix='Hour'
            />
          </div>
        </Box>
        <Box sx={{ padding: '5px', border: '1px dashed gray' }}>
          {fields.map((field) => {
            // @ts-ignore
            const errorsField: FieldErrors = errors?.innerTasks ? errors?.innerTasks[index] : {}
            const index = fields.findIndex((it) => it.id === field.id)
            console.log(index)
            return (
              <Box key={field.id} position='relative'>
                <div style={{ width: '100%', display: 'flex' }}>
                  <CheckboxInner
                    id={`innerTasks-isFinish-id`}
                    name={`innerTasks[${index}].isFinish`}
                    control={control}
                  />
                  <TextInputField
                    variant='outlined'
                    type='text'
                    id={`innerTasks-name-id`}
                    name={`innerTasks[${index}].name`}
                    label='Name'
                    labelWidth={85}
                    control={control}
                    error={Boolean(errorsField?.name?.message)}
                    errorMessage={errorsField && (errorsField?.name?.message as string)}
                    required
                    maxLength={50}
                  />
                </div>
                <div style={{ width: '100%', display: 'flex' }}>
                  <CalendarPickerField
                    id={`innerTasks-startDate-id`}
                    name={`innerTasks[${index}].startDate`}
                    label='StartDate'
                    control={control}
                  />
                  <TextInputField
                    variant='outlined'
                    type='number'
                    id={`innerTasks-estimate-id`}
                    name={`innerTasks[${index}].estimate`}
                    label='Estimate'
                    control={control}
                    suffix='Hour'
                  />
                </div>
                <Popconfirm
                  title='Are you sure you want to delete this subTask?'
                  onConfirm={() => remove(index)}
                  okText='Yes'
                  cancelText='No'
                >
                  <IconButton
                    size='small'
                    onClick={(e) => e.stopPropagation()}
                    className='delete-btn'
                    style={{
                      position: 'absolute',
                      top: '40px',
                      right: '-21px',
                      color: 'white',
                      backgroundColor: 'red',
                    }}
                  >
                    <Close />
                  </IconButton>
                </Popconfirm>

                <Divider sx={{ mt: 2, mb: 2 }} />
              </Box>
            )
          })}
        </Box>
        <Button variant='contained' type='button' onClick={() => append({})}>
          Add
        </Button>
      </DialogContent>

      <DialogActions>
        <DialogActionButton variant='contained' id='form-submit-button' onClick={handleSubmitForm}>
          Submit
        </DialogActionButton>
      </DialogActions>
    </>
  )
}

export default SubTaskFormInput
