import React from 'react'
import { Control, Controller } from 'react-hook-form'
import Switch, { SwitchProps } from '@mui/material/Switch'

export type SwitchInnerProps = {
  name: string
  control?: Control
  onChange?: (value: boolean) => void
} & SwitchProps

const SwitchInputInner: React.FC<SwitchInnerProps> = (props: SwitchInnerProps) => {
  const { name, control, onChange, ...rest } = props
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: handleChangeRender, value } }) => (
          <Switch
            {...rest}
            checked={value}
            onChange={(_event, checked) => {
              handleChangeRender(checked)
              if (onChange) {
                onChange(checked)
              }
              return checked
            }}
          />
        )}
      />
    )
  } else {
    return (
      <Switch
        {...rest}
        name={name}
        onChange={(_e, value) => {
          if (onChange) {
            onChange(value)
          }
        }}
      />
    )
  }
}

export default SwitchInputInner
