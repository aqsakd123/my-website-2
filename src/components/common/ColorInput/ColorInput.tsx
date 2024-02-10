import React, { useState } from 'react'
import styled from 'styled-components'
import { Control, Controller } from 'react-hook-form'
import { BlockPicker, Color, ColorResult } from 'react-color'
import Button from '@mui/material/Button/Button'
import { Popover } from '@mui/material'
import ColorUtils from '@app/helpers/ColorUtils'

// color: ${({ $bgColor }) => Colors.getContrastingColor($bgColor || '')};

const ColorInputButton = styled(Button)<{ $bgColor?: string }>`
  width: 130px;

  &.MuiButton-outlined {
    padding: 5px;
    background-color: ${({ $bgColor }) => $bgColor || ''};
    color: ${({ $bgColor }) => ($bgColor ? ColorUtils.getContrastingColor($bgColor) : '')};
    border: 1px solid #b2b0ad;
    &:hover {
      border: 1px solid #ffd5ba;
      background-color: #ffd5ba;
      color: ${({ $bgColor }) => ColorUtils.getContrastingColor($bgColor)};
    }
  }
  &.Mui-disabled {
    background-color: #eeeeee;
    border: 1px solid #b2b0ad;
  }
`

const ClearButton = styled(Button)`
  margin-left: 10px;
`

const HiddenInput = styled.input`
  box-sizing: content-box;
  width: 0;
  height: 0;
  background: 0 center;
  border: 0;
  opacity: 1;
  outline: 0;
  padding: 0;
`

export type PickerProps = {
  id: string | undefined
  buttonElemRef: React.MutableRefObject<undefined>
  color: string | undefined
  colors?: Array<string>
  onClose: () => void
  onChangeComplete: (color: string) => void
}

export const defaultColors = [
  '#ff6900',
  '#fcb900',
  '#7bdcb5',
  '#00d084',
  '#8ed1fC',
  '#0693e3',
  '#abb8c3',
  '#eb144c',
  '#f78da7',
  '#9900ef',
]

const ColorPicker: React.FC<PickerProps> = ({
  id,
  buttonElemRef,
  color: colorProps,
  colors = defaultColors,
  onChangeComplete,
  onClose,
}: PickerProps) => {
  const [color, setColor] = React.useState<Color | undefined>(colorProps)

  const handleChange = (c: ColorResult) => {
    setColor(c.hex)
  }

  const handleChangeComplete = (c: ColorResult) => {
    setColor(c.hex)
    onChangeComplete(c.hex)
  }

  // @ts-ignore
  const backdropProps: Partial<BackdropProps> = { 'data-testid': `${id}-backdrop`, invisible: true }

  return (
    <Popover
      open
      id={id}
      data-testid={id}
      BackdropProps={backdropProps}
      // @ts-ignore
      anchorEl={buttonElemRef.current?.target}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <BlockPicker
        color={color || '#ffffff'}
        colors={colors}
        triangle='top'
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
      />
    </Popover>
  )
}

type InternalProps = {
  id: string
  name: string
  value?: string
  defaultValue?: string
  onChange?: (value: string | undefined) => void
  disabled?: boolean
  clearable?: boolean
  colors?: Array<string>
  error?: boolean
}

const ColorInputInternal: React.FC<InternalProps> = ({
  id,
  name,
  value: valueProp,
  onChange,
  disabled,
  clearable = true,
  colors,
}: InternalProps) => {
  const [value, setValue] = useState<string | undefined>(valueProp)

  const buttonElemRef = React.useRef()
  const [showPicker, setShowPicker] = React.useState<boolean>(false)

  const popoverId = showPicker ? `${id}-colorpicker-popover` : undefined

  const handleClickButton = (event: any) => {
    setShowPicker(true)
    buttonElemRef.current = event
  }

  const handleClosePicker = () => {
    setShowPicker(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const v = event.target.value || undefined
    setValue(v)
    if (onChange) {
      onChange(v)
    }
  }

  const handleChangeColor = (color: string) => {
    setValue(color)
    if (onChange) {
      onChange(color)
    }
  }

  const handleClickClearButton = () => {
    setValue(undefined)
    if (onChange) {
      onChange(undefined)
    }
  }

  return (
    <div>
      <ColorInputButton
        id={`${id}-picker-open-button`}
        data-testid={`${id}-picker-open-button`}
        variant='outlined'
        // @ts-ignore
        $bgColor={value}
        onClick={handleClickButton}
        aria-describedby={popoverId}
        disabled={disabled}
      >
        {value || '(Select)'}
      </ColorInputButton>
      <HiddenInput
        type='text'
        id={id}
        data-testid={id}
        tabIndex={-1}
        name={name}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
      />
      {clearable && (
        <ClearButton
          id={`${id}-clear-button`}
          size='small'
          onClick={handleClickClearButton}
          disabled={disabled}
        >
          Clear
        </ClearButton>
      )}
      {showPicker && (
        <ColorPicker
          id={popoverId}
          buttonElemRef={buttonElemRef}
          onClose={handleClosePicker}
          color={value}
          onChangeComplete={handleChangeColor}
          colors={colors}
        />
      )}
    </div>
  )
}

export type ColorInputProps = {
  id: string
  name: string
  value?: string
  defaultValue?: string
  colors?: Array<string>
  onChange?: (value: string | undefined) => void
  disabled?: boolean
  clearable?: boolean
  error?: boolean
  control?: Control
}

const ColorInput: React.FC<ColorInputProps> = (props: ColorInputProps) => {
  const {
    id,
    name,
    value,
    defaultValue,
    onChange,
    control,
    colors,
    disabled = false,
    clearable = false,
    error = false,
  } = props
  if (control) {
    return (
      <Controller
        render={({ field: { onChange: handleChangeRender, value } }) => (
          <ColorInputInternal
            {...props}
            onChange={(event: any) => {
              handleChangeRender(event)
              if (onChange) {
                onChange(event.target.value)
              }
              return event
            }}
            value={value}
            {...props}
          />
        )}
        control={control}
        name={name}
      />
    )
  }
  return (
    <ColorInputInternal
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={disabled}
      clearable={clearable}
      colors={colors}
      error={error}
    />
  )
}

export default ColorInput
