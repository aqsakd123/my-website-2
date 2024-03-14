import React, { ReactNode } from 'react'
import InlineForm from '../Form/InlineForm'
import IconPicker, { IconPickerProps } from './IconPicker'

type Props = {
  id: string
  name: string
  required?: boolean
  label?: ReactNode
  labelWidth?: number
  error?: boolean
  errorMessage?: string
  tooltip?: string
  height?: string
} & IconPickerProps

const IconPickerInputField: React.FC<Props> = (props: Props) => {
  const {
    id,
    required,
    label = '',
    labelWidth,
    name,
    tooltip,
    height,
    value,
    error,
    errorMessage,
    onChange,
    ...rest
  } = props

  return (
    <InlineForm
      id={id}
      label={label}
      labelWidth={labelWidth}
      required={required}
      tooltip={tooltip}
      height={height}
      error={error}
      errorMessage={errorMessage}
    >
      <IconPicker id={id} name={name} value={value} onChange={onChange} {...rest} />
    </InlineForm>
  )
}

export default IconPickerInputField
