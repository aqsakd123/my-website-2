import React from 'react'
import { Box, Grid } from '@mui/material'
import { Check } from '@mui/icons-material'
import ColorUtils from '@app/helpers/ColorUtils'
import styled from 'styled-components'

const StyledBox = styled(Box)`
  width: 20px;
  height: 20px;
  padding: 0px;
  border-radius: 50%;
`

interface ColorPalleterProps {
  colors?: string[]
  onChange: (selectedColor: string) => void
  value?: string
}

const ColorPalleter: React.FC<ColorPalleterProps> = ({
  colors = ['#f39f76', '#fff8b8', '#574fc1', '#f6e2dd', '#d3bfdb', '#FFFFFF'],
  onChange,
  value,
}) => {
  const handleColorChange = (selectedColor: string) => {
    onChange(selectedColor)
  }

  return (
    <Grid container spacing={1}>
      {colors.map((color) => (
        <Grid item key={color}>
          <ColorButton color={color} selected={value === color} onChange={handleColorChange} />
        </Grid>
      ))}
    </Grid>
  )
}

interface ColorButtonProps {
  color: string
  selected: boolean
  onChange: (color: string) => void
}

const ColorButton: React.FC<ColorButtonProps> = ({ color, selected, onChange }) => {
  const handleClick = () => {
    onChange(color)
  }

  return (
    <StyledBox
      onClick={handleClick}
      style={{
        backgroundColor: color,
        border: `1px solid ${ColorUtils.getContrastingColor(color)}`,
      }}
    >
      {selected && (
        <Check style={{ color: ColorUtils.getContrastingColor(color), fontSize: '18px' }} />
      )}
    </StyledBox>
  )
}

export default ColorPalleter
