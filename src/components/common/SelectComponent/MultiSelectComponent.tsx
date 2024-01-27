import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'

export interface ISelectOption {
  value: string
  label: string
  sub_name?: string
}

type Props = {
  control?: Control<any, object>
  id?: string
  name: string
  required?: boolean
  errorText?: string
  options: ISelectOption[]
  disabled?: boolean
  width?: string
  style?: object
  placeholder?: string
  defaultValue?: string
  value?: string[] | string
  onChange?: (event: any) => void
  label?: string
}

const SelectInternal: React.FC<Props> = (props: Props) => {
  const {
    name,
    id,
    errorText,
    value,
    required,
    onChange,
    options,
    style,
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
        required={required}
        defaultValue={defaultValue}
        label={label}
        multiple
        name={name}
        error={!!errorText}
        value={value || []}
        size='small'
        onChange={onChange}
        disabled={disabled}
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
          return selected.join(',')
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

const MultiSelectComponent = (props: Props) => {
  const {
    control,
    name,
    id,
    errorText,
    required,
    value = [],
    onChange,
    style,
    options,
    label,
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
        {...props}
        id={id}
        width={width}
        required={required}
        placeholder={placeholder}
        errorText={errorText}
        value={value || []}
        style={style}
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
    <>
      <Controller
        render={({ field: { onChange: handleChange, value } }) => (
          <SelectInternal
            {...props}
            value={value}
            onChange={(newValue) => {
              handleChange(newValue.target.value)
              if (onChange) {
                //@ts-ignore
                onChange(newValue.target.value)
              }
              return newValue
            }}
          />
        )}
        name={name}
        control={control}
      />
    </>
  )
}
export default MultiSelectComponent
