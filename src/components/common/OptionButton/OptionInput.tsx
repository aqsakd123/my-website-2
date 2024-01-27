import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Control, Controller } from 'react-hook-form'

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton/ToggleButton'
import useControlled from '@mui/material/utils/useControlled'

const FormToggleButtonGroup = styled(ToggleButtonGroup)`
  display: inline-flex;
  flex-direction: row;
  width: 100%;
` as typeof ToggleButtonGroup

const FormToggleButton = styled(ToggleButton)<{ $disabledWithColor?: boolean }>`
  height: 32px;
  width: 100%;
  padding: 7px;
  fontsize: ${({ theme }) => theme.typography.pxToRem(13)};
  line-height: 0.7;
  border-radius: 1.5em;
  flex: 1;
  border: 0;
  background-color: #ebe7e5;
  &.Mui-selected {
    color: #ffffff;
    background-color: #273d6a;
    color: yellow;
    &:hover {
      color: #ffffff;
      background-color: #1118278c;
    }
  }
  &.Mui-disabled {
    color: #757575;
    &.Mui-selected {
      color: #ffffff;
      background-color: ${({ $disabledWithColor }) =>
        $disabledWithColor ? '#ff7b9cb7' : '#b1b1b1'};
    }
  }
  &.MuiToggleButton-sizeSmall {
    line-height: 0.4;
    height: 20px;
  }
`

export type OptionType = { label: string | ReactNode; value: string | any }

type Props = {
  id: string
  name: string
  options: Array<OptionType>
  value?: string | any
  size?: 'small' | 'medium'
  control?: Control
  onChange?: (value: string) => void
  disabled?: boolean
  defaultValue?: string
  disabledWithColor?: boolean
}

const OptionButtonInternal: React.FC<Props> = (props: Props) => {
  const {
    id,
    name,
    options,
    size = 'medium',
    value: valueProp,
    onChange,
    disabled,
    defaultValue,
    disabledWithColor,
  } = props

  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'ToggleButtonGroup',
  })
  React.useEffect(() => {
    if (valueProp) {
      setValue(valueProp)
    }
  }, [valueProp, setValue])

  const handleChange = (e: React.MouseEvent<HTMLElement>, val: string) => {
    if (!val) {
      return
    }

    setValue(val)

    if (onChange) {
      onChange(val)
    }
  }

  return (
    <FormToggleButtonGroup
      id={id}
      size={size}
      value={value}
      onChange={handleChange}
      exclusive
      defaultValue={defaultValue}
      data-testid={id}
    >
      {options.map((option) => (
        <FormToggleButton
          name={name}
          size={size}
          key={option.value}
          value={option.value}
          disabled={disabled}
          data-testid={`${id}-${option.value}`}
          $disabledWithColor={disabledWithColor}
        >
          {option.label}
        </FormToggleButton>
      ))}
    </FormToggleButtonGroup>
  )
}

const OptionButton: React.FC<Props> = (props: Props) => {
  const { control, ...others } = props
  if (control) {
    const { name, defaultValue, onChange } = others

    return (
      <Controller
        render={({ field: { onChange: handleChange } }) => (
          <OptionButtonInternal
            onChange={(newChecked) => {
              handleChange(newChecked)
              if (onChange) {
                onChange(newChecked)
              }
              return newChecked
            }}
            {...props}
          />
        )}
        control={control}
        name={name}
        defaultValue={defaultValue}
      />
    )
  }
  return <OptionButtonInternal {...others} />
}

export default OptionButton
