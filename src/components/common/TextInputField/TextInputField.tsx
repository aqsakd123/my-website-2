import React, { ReactNode } from 'react'
import TextInput, { TextInputProps } from './TextInput'
import InlineForm from '../Form/InlineForm'

type Props = {
  id: string
  name: string
  required?: boolean
  label?: ReactNode
  labelWidth?: number
  errorMessage?: ReactNode
  tooltip?: string
  height?: string
} & TextInputProps

const TextInputField: React.FC<Props> = (props: Props) => {
  const {
    id,
    name,
    required,
    suffix,
    label = '',
    labelWidth,
    error,
    disabled,
    errorMessage,
    tooltip,
    style,
    height,
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
      <TextInput id={id} name={name} error={error} style={style} disabled={disabled} {...others} />
    </InlineForm>
  )
}

export default TextInputField
