import { ReactNode } from 'react'
import Radio, { InnerProps } from './Radio'
import InlineForm from '../Form/InlineForm'
import { Control } from 'react-hook-form'

type Props = {
  id: string
  name: string
  required?: boolean
  label?: ReactNode
  labelWidth?: number
  errorMessage?: string
  tooltip?: string
  suffix?: string
  error?: boolean
  control?: Control<any, object>
} & InnerProps

const RadioField: React.FC<Props> = (props: Props) => {
  const {
    id,
    name,
    required,
    errorMessage,
    suffix,
    label,
    error,
    labelWidth,
    disabled,
    tooltip,
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
    >
      <Radio id={id} name={name} disabled={disabled} {...others} />
    </InlineForm>
  )
}

export default RadioField
