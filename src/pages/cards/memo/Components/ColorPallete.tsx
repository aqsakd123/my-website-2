// ColorPalleter.tsx
import React from 'react'
import { Box, Grid } from '@mui/material'
import { Check } from '@mui/icons-material'
import ColorUtils from '@app/helpers/ColorUtils'

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
    <Box
      onClick={handleClick}
      style={{
        borderRadius: '50%',
        backgroundColor: color,
        width: 20,
        height: 20,
        padding: 0,
        border: `1px solid ${ColorUtils.getContrastingColor(color)}`,
      }}
    >
      {selected && (
        <Check style={{ color: ColorUtils.getContrastingColor(color), fontSize: '18px' }} />
      )}
    </Box>
  )
}

export default ColorPalleter
