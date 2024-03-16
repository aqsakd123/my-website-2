import React, { ReactNode } from 'react'
import InlineForm from '../Form/InlineForm'
import HourInput, { HourInputProps } from './HourInput'

type Props = {
  id: string
  name: string
  required?: boolean
  suffix?: string
  label?: ReactNode
  labelWidth?: number
  error?: boolean
  errorMessage?: string
  tooltip?: string
  height?: string
  onChange?: (value: number) => void
} & HourInputProps

const HourInputField: React.FC<Props> = (props: Props) => {
  const {
    id,
    name,
    required,
    label = '',
    labelWidth,
    error,
    disabled,
    errorMessage,
    tooltip,
    height,
    suffix,
    ...others
  } = props

  return (
    <InlineForm
      id={id}
      label={label}
      suffix={suffix}
      labelWidth={labelWidth}
      required={required}
      error={error}
      disabled={disabled}
      tooltip={tooltip}
      errorMessage={errorMessage}
      height={height}
    >
      <HourInput name={name} disabled={disabled} {...others} />
    </InlineForm>
  )
}

export default HourInputField
