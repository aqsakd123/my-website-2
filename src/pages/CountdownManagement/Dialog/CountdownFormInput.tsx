import { DialogContent } from '@app/components/common/Dialog/Dialog'
import DialogActionButton from '@app/components/common/Dialog/DialogActionButton'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions/DialogActions'
import React, { useEffect, useState } from 'react'
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form'
import { Countdown, CountdownInput } from '../CountdownList'
import { yupDate, yup } from '@app/helpers/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import TextInputField from '@app/components/common/TextInputField/TextInputField'
import CheckboxInner from '@app/components/common/Checkbox/Checkbox'
import SelectField from '@app/components/common/SelectComponent/SelectField'
import { useDispatch } from 'react-redux'
import CalendarPickerField from '@app/components/common/CalendarPicker/CalendarPickerField'
import countdownStore from '@app/store/countdownStore/CountdownStore'

import { Button, Divider } from '@mui/material'
import { TaskList } from '@app/pages/TaskListManagement/TaskListList'
import { WorkSpace } from '@app/pages/WorkSpace/WorkSpaceList'
import { SubTask } from '@app/pages/SubTaskManagement/SubTaskList'
import { fetchWorkSpaceList } from '@app/api/workSpace/work-space-api'
import { fetchTaskListList } from '@app/api/taskList/task-list-api'
import { fetchSubTaskList } from '@app/api/subTask/sub-task-api'
import { ISelectOption } from '@app/components/common/SelectComponent/SelectComponent'

export const priorityOptions = [
  { value: 'none', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'important', label: 'Important' },
]

export const selectionTypeOptions = [
  { value: 'task-list', label: 'Task List' },
  { value: 'workspace', label: 'Workspace' },
  { value: 'to-do-list', label: 'To Do List' },
  { value: 'custom-to-do-list', label: 'Custom To Do List' },
]

const validationSchema = (isCustomToDo: boolean) => {
  const yupValue = yup.object().shape({
    name: yup.string().nullable().label('Name').required().max(50),
    description: yup.string().nullable().label('Description').max(2500),
    endDate: yupDate().label('EndDate').required(),
    innerSubTasks: isCustomToDo
      ? yup.array().of(
          yup.object().shape({
            name: yup.string().nullable().label('Name').required().max(50),
            startDate: yupDate().label('StartDate').required(),
          }),
        )
      : yup.array(),
  })
  return yupValue
}

export type FormProps = {
  id: string
  defaultValues?: CountdownInput
  onSubmit: ((data: any) => void) | ((data: any) => Promise<void>)
}

const handleSelectDefaultTypeSelection = (defaultValues?: CountdownInput) => {
  if (defaultValues?.selectionType === 'task-list') {
    return defaultValues?.taskLists?.id
  } else if (defaultValues?.selectionType === 'workspace') {
    return defaultValues?.workspaces?.id
  } else if (defaultValues?.selectionType === 'to-do-list') {
    return defaultValues?.subTask?.id
  }
  return undefined
}
const CountdownFormInput: React.FC<FormProps> = (props: FormProps) => {
  const { id, defaultValues, onSubmit } = props

  const dispatch = useDispatch()

  const [taskList, setTaskList] = useState<TaskList[]>([])
  const [workspaces, setWorkSpaces] = useState<WorkSpace[]>([])
  const [todoList, setToDoList] = useState<SubTask[]>([])

  const [selectedId, setSelectedId] = useState<string | undefined>(
    handleSelectDefaultTypeSelection(defaultValues),
  )
  const [selectionLabel, setSelectionLabel] = useState<string | undefined>(
    selectionTypeOptions?.find((it) => it.value === defaultValues?.selectionType)?.label,
  )
  const [selectionType, setSelectionType] = useState<string | undefined>(
    selectionTypeOptions?.find((it) => it.value === defaultValues?.selectionType)?.value,
  )

  const formMethods = useForm<any>({
    mode: 'onChange',
    defaultValues: { ...defaultValues },
    resolver: yupResolver(validationSchema(selectionType === 'custom-to-do-list')),
  })

  const { handleSubmit, control, formState, watch } = formMethods
  const { errors, isDirty } = formState
  const typeSelected = watch('selectionType')

  const selectionOptions: ISelectOption[] =
    typeSelected === 'workspace'
      ? workspaces.map((it) => ({ value: it.id, label: it.name }))
      : typeSelected === 'task-list'
      ? taskList.map((it) => ({ value: it.id, label: it.name }))
      : typeSelected === 'to-do-list'
      ? todoList.map((it) => ({ value: it.id, label: it.name }))
      : []

  useEffect(() => {
    dispatch(countdownStore.actions.setDirty(isDirty))
  }, [isDirty])
  console.log(selectedId)
  useEffect(() => {
    const handleFetchData = async () => {
      try {
        if (selectionType === 'task-list' && taskList.length === 0) {
          const fetchedData = await fetchTaskListList({})
          setTaskList(fetchedData || [])
          setSelectedId(defaultValues?.taskLists?.id)
        } else if (selectionType === 'workspace' && workspaces.length === 0) {
          const fetchedData = await fetchWorkSpaceList()
          setWorkSpaces(fetchedData || [])
          setSelectedId(defaultValues?.workspaces?.id)
        } else if (selectionType === 'to-do-list' && todoList.length === 0) {
          const fetchedData = await fetchSubTaskList({})
          setToDoList(fetchedData || [])
          setSelectedId(defaultValues?.subTask?.id)
        }
      } catch (error) {
        console.error(error)
      } finally {
        dispatch(countdownStore.actions.setLoadingStatus('Loaded'))
      }
    }
    handleFetchData()
  }, [selectionType])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'innerSubTasks',
  })

  const handleSubmitForm = handleSubmit(async (data: CountdownInput) => {
    // convert from type CountdownInput to Countdown
    const submitData: Countdown = {
      ...data,
      id: id || '',
      taskLists: data.selectionType === 'task-list' ? { id: selectedId } : undefined,
      workspaces: data.selectionType === 'workspace' ? { id: selectedId } : undefined,
      subTask: data.selectionType === 'to-do-list' ? { id: selectedId } : undefined,
    }
    onSubmit(submitData)
  })

  const handleChangeType = async (value: string) => {
    setSelectionLabel(selectionTypeOptions?.find((it) => it.value === value)?.label)
    setSelectionType(value)
  }

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
              maxLength={2500}
            />
          </div>
          <div>
            <SelectField
              options={priorityOptions}
              id={`input-priority-${id}`}
              name='priority'
              label='Priority'
              control={control}
            />
          </div>
          <div>
            <CheckboxInner
              id={`input-isFinish-${id}`}
              name='isFinish'
              label='IsFinish'
              control={control}
            />
          </div>
          <div>
            <CalendarPickerField
              id={`input-endDate-${id}`}
              name='endDate'
              label='End Date'
              control={control}
              error={Boolean(errors['endDate']?.message)}
              errorMessage={errors['endDate']?.message as string}
              required
            />
          </div>
          <div style={{ display: 'flex' }}>
            <SelectField
              options={selectionTypeOptions}
              id={`input-selectionType-${id}`}
              name='selectionType'
              label='Type'
              control={control}
              onChange={handleChangeType}
            />
            {typeSelected && typeSelected !== 'custom-to-do-list' && (
              <SelectField
                id={`input-selected-type-${id}`}
                name='selection'
                label={selectionLabel}
                value={selectedId}
                options={selectionOptions}
                onChange={setSelectedId}
              />
            )}
          </div>
        </Box>
        {typeSelected === 'custom-to-do-list' && (
          <>
            <Box sx={{ padding: '5px', border: fields.length > 0 ? '1px dashed gray' : '' }}>
              {fields.map((field, index) => {
                const errorsField: FieldErrors = errors?.innerSubTasks
                  ? // @ts-ignore
                    errors?.innerSubTasks[index]
                  : {}
                return (
                  <Box key={field.id}>
                    <div>
                      <TextInputField
                        variant='outlined'
                        type='text'
                        id={`innerSubTasks-name-id`}
                        name={`innerSubTasks[${index}].name`}
                        label='Name'
                        control={control}
                        error={Boolean(errorsField?.name?.message)}
                        errorMessage={errorsField && (errorsField?.name?.message as string)}
                        required
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <CalendarPickerField
                        id={`innerSubTasks-startDate-id`}
                        name={`innerSubTasks[${index}].startDate`}
                        label='StartDate'
                        control={control}
                        error={Boolean(errorsField?.startDate?.message)}
                        errorMessage={errorsField && (errorsField?.startDate?.message as string)}
                        required
                      />
                    </div>
                    <div>
                      <CheckboxInner
                        id={`innerSubTasks-isFinish-id`}
                        name={`innerSubTasks[${index}].isFinish`}
                        label='IsFinish'
                        control={control}
                      />
                    </div>
                    <Button variant='outlined' onClick={() => remove(index)}>
                      Delete
                    </Button>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                  </Box>
                )
              })}
            </Box>
            <Button variant='contained' type='button' onClick={() => append({})}>
              Add
            </Button>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <DialogActionButton variant='contained' id='form-submit-button' onClick={handleSubmitForm}>
          Submit
        </DialogActionButton>
      </DialogActions>
    </>
  )
}

export default CountdownFormInput
