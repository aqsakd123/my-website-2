import React, { ReactNode } from 'react'
import InlineForm from '../Form/InlineForm'
import CheckboxField, { Props } from './CheckboxField'

type ChckbxProps = {
  id: string
  name: string
  required?: boolean
  label?: ReactNode
  labelWidth?: number
  errorMessage?: string
  tooltip?: string
  height?: string
} & Props

const CheckboxInputField: React.FC<ChckbxProps> = (props: ChckbxProps) => {
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
      <CheckboxField id={id} name={name} error={error} disabled={disabled} {...others} />
    </InlineForm>
  )
}

export default CheckboxInputField
