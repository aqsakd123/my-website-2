import React from 'react'
import styled from 'styled-components'
import Checkbox from '@mui/material/Checkbox'
import { Controller, Control } from 'react-hook-form'
import { FormControlLabel } from '@mui/material'

const StyledFormControlLabel = styled(FormControlLabel)`
  & .MuiFormControlLabel-label {
    font-size: 1em;
  }
`

type CheckBoxErrorType = {
  error?: string
  className?: string
}

const StyledCheckbox = styled(Checkbox)<CheckBoxErrorType>`
  padding: ${({ size }) => (size === 'small' ? '1px' : '9px')};
  & .MuiSvgIcon-root {
    outline: 2px solid
      ${(props) => (props.error === 'true' ? props.theme.palette.error.main : 'transparent')};
  }
  &.Mui-checked {
    color: #b900f5 !important;
  }
`

export type CheckboxType = {
  id: string
  name: string
  label?: React.ReactNode
  value?: string
  checked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  error?: boolean
  onChange?: (checked: boolean, value: string) => void
  size?: 'small' | 'medium'
  control?: Control<any, object>
  defaultChecked?: boolean
  className?: string
  style?: React.CSSProperties
}

type InnerCheckboxType = Omit<CheckboxType, 'control' | 'label'>

const InnerCheckbox: React.FC<CheckboxType> = (props: InnerCheckboxType) => {
  const {
    id,
    name,
    checked,
    disabled,
    indeterminate,
    onChange,
    size = 'medium',
    value,
    defaultChecked,
    error,
    className,
    style,
  } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, newChecked: boolean) => {
    if (onChange) {
      return onChange(newChecked, value || '')
    }
    return newChecked
  }

  return (
    <StyledCheckbox
      id={id}
      name={name}
      value={value}
      checked={checked}
      inputProps={{ 'data-testid': id } as React.InputHTMLAttributes<HTMLInputElement>}
      error={error?.toString()}
      indeterminate={indeterminate}
      // @ts-ignore
      onChange={handleChange}
      size={size}
      defaultChecked={defaultChecked}
      disabled={disabled}
      className={className}
      style={style}
    />
  )
}

const CheckboxInner: React.FC<CheckboxType> = (props: CheckboxType) => {
  const {
    id,
    name,
    label,
    checked,
    disabled,
    indeterminate,
    onChange,
    error,
    size = 'medium',
    control,
    value = '',
    defaultChecked,
    className,
  } = props

  if (control) {
    if (label) {
      return (
        <StyledFormControlLabel
          control={
            <Controller
              render={({ field: { onChange: handleChange, value } }) => (
                <InnerCheckbox
                  {...props}
                  onChange={(newChecked) => {
                    handleChange(newChecked)
                    if (onChange) {
                      onChange(newChecked, value || '')
                    }
                    return newChecked
                  }}
                />
              )}
              control={control}
              name={name}
            />
          }
          label={label}
          disabled={disabled}
        />
      )
    }
    return (
      <Controller
        render={({ field: { onChange: handleChange, value } }) => (
          <InnerCheckbox
            {...props}
            value={value}
            onChange={(newChecked) => {
              handleChange(newChecked)
              if (onChange) {
                onChange(newChecked, value || '')
              }
              return newChecked
            }}
          />
        )}
        control={control}
        name={name}
      />
    )
  }

  if (label) {
    return (
      <StyledFormControlLabel
        control={
          <InnerCheckbox
            {...props}
            id={id}
            name={name}
            value={value}
            checked={checked}
            indeterminate={indeterminate}
            size={size}
            error={error}
            onChange={(newChecked, data) => {
              if (onChange) {
                onChange(newChecked, data || '')
              }
            }}
            defaultChecked={defaultChecked}
            className={className}
          />
        }
        label={label}
        disabled={disabled}
      />
    )
  }
  return (
    <InnerCheckbox
      {...props}
      id={id}
      name={name}
      value={value}
      checked={checked}
      indeterminate={indeterminate}
      onChange={(newChecked, data) => {
        if (onChange) {
          onChange(newChecked, data || '')
        }
      }}
      error={error}
      size={size}
      defaultChecked={defaultChecked}
      disabled={disabled}
      className={className}
    />
  )
}

export default CheckboxInner
