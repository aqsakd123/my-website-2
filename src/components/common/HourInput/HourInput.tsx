import { TimePicker, TimePickerProps } from '@mui/x-date-pickers'
import React from 'react'
import { Control, Controller } from 'react-hook-form'

export type HourInputProps = {
  name: string
  control?: Control
  onChange?: (value: Date | null) => void
} & TimePickerProps<Date>

const HourInput: React.FC<HourInputProps> = (props: HourInputProps) => {
  const { name, control, onChange, ...rest } = props
  if (control) {
    // If control is provided, wrap with Controller
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: handleChangeRender, value } }) => (
          <TimePicker
            {...rest}
            value={value}
            onChange={(value) => {
              handleChangeRender(value)
              if (onChange) {
                onChange(value)
              }
              return value
            }}
          />
        )}
      />
    )
  } else {
    return <TimePicker {...rest} onChange={onChange} />
  }
}

export default HourInput
