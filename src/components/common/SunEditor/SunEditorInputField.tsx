import React, { ReactNode } from 'react'
import InlineForm from '../Form/InlineForm'
import SunEditorField, { MyEditorProps } from './SunEditorField'

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
} & MyEditorProps

const SunEditorInputField: React.FC<Props> = (props: Props) => {
  const {
    id,
    name,
    required,
    label,
    labelWidth,
    error,
    readOnly,
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
      disabled={readOnly}
      tooltip={tooltip}
      errorMessage={errorMessage}
      height={height}
    >
      <SunEditorField name={name} readOnly={readOnly} {...others} />
    </InlineForm>
  )
}

export default SunEditorInputField
