import Drawer from '@mui/material/Drawer'
import React from 'react'
import styled from 'styled-components'

type RightDrawerProps = {
  id: string
  opened?: boolean
  direction?: 'left' | 'right'
  children?: React.ReactNode
  variant?: 'temporary' | 'permanent' | 'persistent' | undefined
  onClose: () => void
}
const CustomDrawer = styled(Drawer)`
  transition: transform 1s ease-in-out, opacity 0.3s ease-in-out;
  flex-shrink: 0;
`

const RightDrawer: React.FC<RightDrawerProps> = (props: RightDrawerProps) => {
  const { id, opened, children, direction = 'right', variant = 'temporary', onClose } = props

  return (
    <CustomDrawer id={id} open={opened} anchor={direction} variant={variant} onClose={onClose}>
      {children}
    </CustomDrawer>
  )
}

export default RightDrawer
