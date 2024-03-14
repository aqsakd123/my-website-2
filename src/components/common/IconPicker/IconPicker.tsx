import React from 'react'
import { Control, Controller } from 'react-hook-form'
import IconPickerInner from './IconPickerInner'

export type IconPickerProps = {
  id: string
  name: string
  value?: string
  control?: Control
  onChange?: (value: string) => void
}

const IconPicker: React.FC<IconPickerProps> = (props: IconPickerProps) => {
  const { name, control, id, value, onChange } = props
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: handleChangeRender, value } }) => (
          <IconPickerInner
            id={id}
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
    return <IconPickerInner id={id} value={value} onChange={onChange} />
  }
}

export default IconPicker
