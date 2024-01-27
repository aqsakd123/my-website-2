import React from 'react'
import styled from 'styled-components'
import { Controller, Control } from 'react-hook-form'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'

const StyledFormControlLabel = styled(FormControlLabel)`
  & .MuiFormControlLabel-label {
    font-size: 1em;
  }
`

const StyledRadio = styled(Radio)`
  color: #9b9184;
  &.Mui-checked {
    color: #b900f5 !important;
  }
  &.Mui-disabled {
    color: rgba(0, 0, 0, 0.26);
  }
` as typeof Radio

export type RadioType = {
  id?: string
  label?: React.ReactNode
  value: string
  disabled?: boolean
}

export type InnerProps = {
  id: string
  name: string
  radios: Array<RadioType>
  value?: string
  onChange?: (value: string) => void
  error?: boolean
  errorMsg?: string
  row?: boolean
  defaultValue?: string
  disabled?: boolean
  size?: 'small' | 'medium'
}

const RadioButtonInternal: React.FC<InnerProps> = (props: InnerProps) => {
  const {
    id,
    name,
    radios,
    value = '',
    onChange,
    row = true,
    defaultValue,
    disabled,
    size = 'medium',
  } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) {
      return event.target.value
    }
    return onChange(event.target.value)
  }

  return (
    <>
      <RadioGroup
        id={id}
        data-testid={id}
        name={name}
        value={value}
        onChange={handleChange}
        defaultValue={defaultValue}
        row={row}
      >
        {radios.map((radio) => (
          <StyledFormControlLabel
            key={radio.value}
            value={radio.value}
            disabled={disabled ? true : radio.disabled}
            control={<StyledRadio id={radio.id} size={size} />}
            data-testid={radio.id}
            label={radio.label}
          />
        ))}
      </RadioGroup>
    </>
  )
}

type Props = {
  id: string
  name: string
  radios: Array<RadioType>
  value?: string
  error?: boolean
  errorMsg?: string
  onChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  control?: Control<any, object>
  defaultValue?: string
  disabled?: boolean
  size?: 'small' | 'medium'
}

const RadioButton: React.FC<Props> = (props: Props) => {
  const { control, onChange, orientation = 'horizontal', ...others } = props

  if (control) {
    const { name } = others
    return (
      <Controller
        render={({ field: { onChange: handleChange, value } }) => (
          <RadioButtonInternal
            {...props}
            value={value}
            onChange={(value) => {
              handleChange(value)
              if (onChange) {
                onChange(value)
              }
              return value
            }}
          />
        )}
        control={control}
        name={name}
      />
    )
  }
  return <RadioButtonInternal onChange={onChange} row={orientation === 'horizontal'} {...others} />
}

export default RadioButton
