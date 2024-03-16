import { Control, Controller } from 'react-hook-form'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { DateView } from '@mui/x-date-pickers'

type InternalProps = {
  id: string
  required?: boolean
  name: string
  label?: string
  disabled?: boolean
  error?: boolean
  value?: Date | null
  placeholder?: string
  autoFocus?: boolean
  shouldDisableDate?: (day: Date) => boolean
  onChange?: (date: any) => void
  defaultValue?: Date | null
  errorMessage?: string
  views?: DateView[]
  renderDay?: (
    day: Date | null,
    selectedDate: Date | null,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element,
  ) => JSX.Element
}

export type CalendarInputProps = {
  control?: Control<any, object>
  id: string
  label?: string
  required?: boolean
  name: string
  disabled?: boolean
  error?: boolean
  value?: Date | null
  placeholder?: string
  autoFocus?: boolean
  onChange?: (date: any) => void
  shouldDisableDate?: (day: Date) => boolean
  defaultValue?: Date | null
  errorMessage?: string
  views?: DateView[]
  renderDay?: (
    day: Date | null,
    selectedDate: Date | null,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element,
  ) => JSX.Element
} & DatePickerProps<Date>

const CalendarInputInternal: React.FC<InternalProps> = (props: InternalProps) => {
  const {
    id,
    name,
    label,
    disabled,
    required,
    error,
    value: valueProp,
    onChange,
    shouldDisableDate,
    placeholder,
    autoFocus,
    defaultValue,
    errorMessage,
    views,
    ...others
  } = props
  return (
    <DatePicker
      {...others}
      label={label}
      defaultValue={defaultValue}
      value={valueProp}
      autoFocus={autoFocus}
      disabled={disabled}
      views={views}
      shouldDisableDate={(value) => {
        if (shouldDisableDate) {
          return shouldDisableDate(new Date(value))
        }
        return false
      }}
      slotProps={{
        textField: {
          required: required,
          error: !!errorMessage,
          helperText: errorMessage,
          size: 'small',
          inputProps: {
            id: id,
            name: name,
            placeholder: placeholder,
            error: error?.toString(),
          },
        },
      }}
      sx={{
        width: '100%',
      }}
      onChange={(date) => {
        if (onChange) {
          onChange(date)
        }
      }}
    />
  )
}

const CalendarPicker: React.FC<CalendarInputProps> = (props: CalendarInputProps) => {
  const { control, onChange, ...others } = props
  if (control) {
    const { name } = others
    return (
      <Controller
        control={control}
        render={({ field: { onChange: handleChange, value } }) => (
          <CalendarInputInternal
            {...props}
            value={value}
            onChange={(value) => {
              handleChange(value)
              if (onChange) {
                onChange(value)
              }
            }}
          />
        )}
        name={name}
      />
    )
  }
  return <CalendarInputInternal onChange={onChange} {...others} />
}

export default CalendarPicker
