import React, { useState } from 'react'
import { Button, ButtonProps, CircularProgress } from '@mui/material'

type Props = {
  onClick: () => void | Promise<void>
} & ButtonProps

const DialogActionButton: React.FC<Props> = (props: Props) => {
  const { onClick, children, ...others } = props
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      if (typeof onClick === 'function') {
        setLoading(true)
        await onClick()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} {...others}>
      {loading ? <CircularProgress size={24} /> : children}
    </Button>
  )
}

export default DialogActionButton
