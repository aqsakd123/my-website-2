import React, { ReactNode } from 'react'
import { Control, Controller } from 'react-hook-form'
import InlineForm from '../Form/InlineForm'
import FormGroup from '@mui/material/FormGroup/FormGroup'
import Checkbox from './Checkbox'

export type Props = {
  id: string
  required?: boolean
  error?: boolean
  label?: ReactNode
  labelWidth?: number
  errorMessage?: string
  disabled?: boolean
  name: string
  value?: Array<string>
  size?: 'medium' | 'small'
  onChange?: (value: Array<string> | string | undefined) => void
  control?: Control
  checkboxes: Array<{ label?: ReactNode; value: string; disabled?: boolean }>
  orientation?: 'horizontal' | 'vertical'
  defaultValue?: Array<string>
  tooltip?: string
  singleCheck?: boolean
}

const InternalCheckboxField: React.FC<Props> = (props: Props) => {
  const {
    id,
    required,
    error,
    label,
    labelWidth,
    errorMessage,
    disabled,
    name,
    value,
    size = 'medium',
    onChange,
    orientation = 'horizontal',
    checkboxes,
    defaultValue,
    tooltip,
    singleCheck = false,
  } = props
  const checkedValues = value || defaultValue || []
  // const [checkedValues, setCheckedValues] = React.useState<Array<string>>(value || defaultValue || []);

  const isSingle = singleCheck || checkboxes.length === 1

  const handleChange = (checked: boolean, checkboxValue: string) => {
    const checkedNewValue = isSingle ? checkboxValue : [...checkedValues, checkboxValue]
    const noCheckedNewValue = isSingle
      ? undefined
      : checkedValues.filter((v) => v !== checkboxValue)
    const newValue = checked ? checkedNewValue : noCheckedNewValue

    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <InlineForm
      id={id}
      label={label}
      required={required}
      error={error}
      errorMessage={errorMessage}
      disabled={disabled}
      labelWidth={labelWidth || 0}
      tooltip={tooltip}
    >
      <FormGroup row={orientation === 'horizontal'} id={id} data-testid={id}>
        {checkboxes.map((box) => (
          <Checkbox
            id={`${id}-${box.value}`}
            key={box.value}
            name={`${name}`}
            value={box.value}
            checked={checkedValues.includes(box.value)}
            disabled={disabled || box.disabled}
            onChange={handleChange}
            size={size}
            label={box.label}
          />
        ))}
      </FormGroup>
    </InlineForm>
  )
}

const CheckboxField: React.FC<Props> = (props: Props) => {
  const {
    id,
    required,
    error,
    label,
    labelWidth,
    errorMessage,
    disabled,
    name,
    value,
    size = 'medium',
    onChange,
    control,
    orientation = 'horizontal',
    checkboxes,
    defaultValue,
    tooltip,
    singleCheck,
  } = props

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: handleChangeRender, value } }) => (
          <InternalCheckboxField
            {...props}
            onChange={(event: any) => {
              handleChangeRender(event)
              if (onChange) {
                onChange(event)
              }
            }}
            value={value}
          />
        )}
      />
    )
  }

  return (
    <InternalCheckboxField
      id={id}
      name={name}
      checkboxes={checkboxes}
      orientation={orientation}
      disabled={disabled}
      label={label}
      labelWidth={labelWidth}
      required={required}
      size={size}
      error={error}
      errorMessage={errorMessage}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      tooltip={tooltip}
      singleCheck={singleCheck}
    />
  )
}

export default CheckboxField
