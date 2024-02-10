import React, { ReactNode } from 'react'
import InlineForm from '../Form/InlineForm'
import IconPickerInner, { ReactIconPickerProps } from './IconPickerInner'

type Props = {
  id: string
  name: string
  required?: boolean
  label?: ReactNode
  labelWidth?: number
  errorMessage?: ReactNode
  tooltip?: string
  height?: string
} & ReactIconPickerProps

const IconPickerInputField: React.FC<Props> = (props: Props) => {
  const { id, required, label = '', labelWidth, tooltip, height, value, onChange } = props

  return (
    <InlineForm
      id={id}
      label={label}
      labelWidth={labelWidth}
      required={required}
      tooltip={tooltip}
      height={height}
    >
      <IconPickerInner value={value} onChange={onChange} />
    </InlineForm>
  )
}

export default IconPickerInputField
