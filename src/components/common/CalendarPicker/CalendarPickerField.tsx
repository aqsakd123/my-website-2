import React, { ReactNode } from 'react'
import InlineForm from '../Form/InlineForm'
import CalendarPicker, { CalendarInputProps } from './CalendarPicker'

type Props = {
  id: string
  name: string
  required?: boolean
  label?: ReactNode
  labelWidth?: number
  errorMessage?: ReactNode
  tooltip?: string
  height?: string
} & CalendarInputProps

const CalendarPickerField: React.FC<Props> = (props: Props) => {
  const {
    id,
    name,
    required,
    label,
    labelWidth,
    error,
    disabled,
    errorMessage,
    tooltip,
    height,
    ...others
  } = props

  return (
    <InlineForm
      id={id}
      label={label}
      labelWidth={labelWidth}
      required={required}
      error={error}
      disabled={disabled}
      tooltip={tooltip}
      errorMessage={errorMessage}
      height={height}
      style={{ marginTop: '10px', marginBottom: '10px' }}
    >
      <CalendarPicker
        id={id}
        name={name}
        label={label}
        error={error}
        disabled={disabled}
        {...others}
      />
    </InlineForm>
  )
}

export default CalendarPickerField
