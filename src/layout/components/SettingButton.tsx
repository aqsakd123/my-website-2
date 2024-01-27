import { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import Popover from '@mui/material/Popover'
import { Button, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { DoneAll } from '@mui/icons-material'
import ColorUtils from '@app/helpers/ColorUtils'
import styled from 'styled-components'
import DarkModeSwitch from '../common/DarkModeSwitch'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import commonStore, { colorOptions } from '@app/store/commonStore/CommonStore'

const StyledDiv = styled.div`
  .title {
    font-weight: 600;
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 12px;
    line-height: 25px;
    text-transform: uppercase;
  }
`

const StyledToggleButton = styled(ToggleButton)`
  &:hover {
    transform: scale(1.25);
    z-index: 101;
    transition: transform 0.3s ease;
  }
`

const SettingsButton = () => {
  const [rotateDegree, setRotateDegree] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)

  const selectedColor = useSelector((state: RootState) => state.commonStore.sidebarColor)
  const darkMode = useSelector((state: RootState) => state.commonStore.darkMode)

  const dispatch = useDispatch()

  const handleMouseEnter = () => {
    setRotateDegree(45)
  }

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
    setRotateDegree(90)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setRotateDegree(0)
  }

  const handleColorChange = (color: any) => {
    if (color) {
      dispatch(commonStore.actions.setSidebarColor(color))
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? 'settings-popover' : undefined

  const handleMouseLeave = () => {
    if (!open) {
      setRotateDegree(0)
    }
  }

  return (
    <>
      <Button
        variant='contained'
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          right: '0px',
          top: '120px',
          backgroundColor: '#11182763',
          zIndex: 999,
        }}
        aria-describedby={id}
      >
        <SettingsIcon
          style={{
            color: 'white',
            fontSize: '40px',
            transform: `rotate(${rotateDegree}deg)`,
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <StyledDiv style={{ padding: 16, width: '300px', color: darkMode ? 'white' : 'black' }}>
          <div style={{ width: '100%' }}>
            <div className='title'>Sidebar Background</div>
            <ToggleButtonGroup
              value={selectedColor}
              exclusive
              onChange={(_event, newColor) => handleColorChange(newColor)}
              aria-label='select color'
              style={{ borderRadius: 22, width: '100%' }}
            >
              {colorOptions.map((option, indx) => (
                <StyledToggleButton
                  key={option.id}
                  selected={selectedColor === option.color}
                  value={option.color}
                  style={{
                    backgroundColor: option.color,
                    width: '-webkit-fill-available',
                    height: 40,
                    borderTopRightRadius: indx === colorOptions?.length - 1 ? 22 : 0,
                    borderBottomRightRadius: indx === colorOptions?.length - 1 ? 22 : 0,
                    borderTopLeftRadius: indx === 0 ? 22 : 0,
                    borderBottomLeftRadius: indx === 0 ? 22 : 0,
                  }}
                >
                  {selectedColor === option.color && (
                    <DoneAll
                      style={{
                        color: ColorUtils.getContrastingColor(option.color),
                      }}
                    />
                  )}
                </StyledToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
          <Divider style={{ margin: 15 }} />
          <DarkModeSwitch />
          <Divider style={{ margin: 15 }} />
          <Button
            key='more-options'
            variant='outlined'
            value='more-options'
            style={{
              width: '-webkit-fill-available',
              height: 40,
              borderRadius: 22,
            }}
          >
            More Options
          </Button>
        </StyledDiv>
      </Popover>
    </>
  )
}

export default SettingsButton
