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

const StyledSettingsButton = styled.div`
  position: fixed;
  right: 0px;
  top: 70px;
  opacity: 0.5;
  z-index: 999;

  .settings-icon {
    font-size: 40px;
    transition: transform 0.3s ease-in-out;
  }
`

const StyledDiv = styled.div`
  width: 300px;
  padding: 16px;

  .title {
    font-weight: 600;
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 12px;
    line-height: 25px;
    text-transform: uppercase;
  }

  .toggle-buttons {
    border-radius: 22;
    width: 100%;
  }

  .more-btn {
    width: -webkit-fill-available;
    height: 40px;
    border-radius: 22px;
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
  const open = Boolean(anchorEl)
  const id = open ? 'settings-popover' : undefined
  const selectedColor = useSelector((state: RootState) => state.commonStore.sidebarColor)
  // const darkMode = useSelector((state: RootState) => state.commonStore.darkMode)

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

  const handleMouseLeave = () => {
    if (!open) {
      setRotateDegree(0)
    }
  }

  return (
    <StyledSettingsButton>
      <Button
        variant='contained'
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SettingsIcon
          className='settings-icon'
          style={{
            transform: `rotate(${rotateDegree}deg`,
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
        <StyledDiv>
          <div>
            <div className='title'>Sidebar Background</div>
            <ToggleButtonGroup
              className='toggle-buttons'
              value={selectedColor}
              exclusive
              onChange={(_event, newColor) => handleColorChange(newColor)}
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
          <Button className='more-btn' key='more-options' variant='outlined' value='more-options'>
            More Options
          </Button>
        </StyledDiv>
      </Popover>
    </StyledSettingsButton>
  )
}

export default SettingsButton
