import React, { ReactNode } from 'react'
import InlineForm from '../Form/InlineForm'
import ColorInput, { ColorInputProps } from './ColorInput'

type Props = {
  id: string
  name: string
  required?: boolean
  label?: ReactNode
  labelWidth?: number
  errorMessage?: string
  tooltip?: string
  height?: string
} & ColorInputProps

const ColorInputField: React.FC<Props> = (props: Props) => {
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
    >
      <ColorInput id={id} name={name} error={error} disabled={disabled} {...others} />
    </InlineForm>
  )
}

export default ColorInputField
