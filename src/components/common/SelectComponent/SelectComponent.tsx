import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { Control, Controller } from 'react-hook-form'

export interface ISelectOption {
  value: string
  label: string
  sub_name?: string
}

export type SelectProps = {
  control?: Control<any, object>
  id?: string
  required?: boolean
  name: string
  errorText?: string
  options: ISelectOption[]
  disabled?: boolean
  width?: string
  style?: object
  placeholder?: string
  defaultValue?: string
  value?: string | string[]
  onChange?: (event: any) => void
  error?: boolean
  label?: string
}

const SelectInternal: React.FC<SelectProps> = (props: SelectProps) => {
  const {
    name,
    id,
    errorText,
    required,
    value,
    onChange,
    style,
    options,
    label,
    disabled = false,
    width = '100%',
    placeholder = '',
    defaultValue = '',
  } = props
  return (
    <FormControl
      required={required}
      style={{ marginTop: '5px', marginBottom: '5px', ...style }}
      fullWidth
      error={!!errorText}
    >
      <InputLabel variant='outlined' htmlFor='uncontrolled-native'>
        {label}
      </InputLabel>
      <Select
        id={id}
        defaultValue={defaultValue}
        label={label}
        name={name}
        required={required}
        error={!!errorText}
        value={value}
        onChange={onChange}
        disabled={disabled}
        size='small'
        style={{ width: width }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
        displayEmpty
        placeholder={placeholder}
        renderValue={(selected: any) => {
          if (selected?.length === 0 && placeholder) {
            return <p style={{ opacity: 0.35 }}>{placeholder}</p>
          }
          return options.find((item: ISelectOption) => item.value == selected)?.label
        }}
      >
        {options?.map((item, index) => {
          return (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          )
        })}
      </Select>
      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  )
}

const SelectComponent = (props: SelectProps) => {
  const {
    control,
    name,
    id,
    errorText,
    value,
    onChange,
    required,
    options,
    label,
    style,
    disabled = false,
    width = '100%',
    placeholder = '',
    defaultValue = '',
  } = props

  if (!control) {
    const handleChange = (newValue: any) => {
      if (onChange) {
        //@ts-ignore
        onChange(newValue.target.value)
      }
    }

    return (
      <SelectInternal
        id={id}
        width={width}
        style={style}
        required={required}
        placeholder={placeholder}
        errorText={errorText}
        value={value}
        onChange={handleChange}
        options={options}
        label={label}
        disabled={disabled}
        name={name}
        defaultValue={defaultValue}
      />
    )
  }

  return (
    <Controller
      render={({ field: { onChange: handleChange, value } }) => (
        <SelectInternal
          {...props}
          value={value}
          onChange={(newValue) => {
            handleChange(newValue.target.value)
            if (onChange) {
              onChange(newValue.target.value)
            }
            return newValue
          }}
        />
      )}
      name={name}
      control={control}
    />
  )
}
export default SelectComponent
