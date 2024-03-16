import React, { ReactNode } from 'react'
import InlineForm from '../Form/InlineForm'
import SwitchInputInner, { SwitchInnerProps } from './SwitchInputInner'

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
  onChange?: (value: boolean) => void
} & SwitchInnerProps

const SwitchInputField: React.FC<Props> = (props: Props) => {
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
    style,
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
      <SwitchInputInner id={id} name={name} style={style} disabled={disabled} {...others} />
    </InlineForm>
  )
}

export default SwitchInputField
