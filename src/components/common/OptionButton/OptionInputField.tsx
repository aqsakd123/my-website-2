import React, { ReactNode } from 'react'
import { Control } from 'react-hook-form'
import OptionButton, { OptionType } from './OptionInput'
import InlineForm from '../Form/InlineForm'

type Props = {
  id: string
  name: string
  options: Array<OptionType>
  required?: boolean
  error?: boolean
  label?: ReactNode
  labelWidth?: number
  errorMessage?: string
  value?: string | any
  control?: Control
  onChange?: (value: string) => void
  disabled?: boolean
  defaultValue?: string | any
  tooltip?: string
}

const OptionButtonField: React.FC<Props> = (props: Props) => {
  const {
    id,
    name,
    options,
    required,
    error,
    label,
    labelWidth,
    errorMessage,
    disabled,
    value,
    control,
    onChange,
    tooltip,
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
    >
      <OptionButton
        id={id}
        name={name}
        options={options}
        value={value}
        disabled={disabled}
        control={control}
        onChange={onChange}
      />
    </InlineForm>
  )
}

export default OptionButtonField
