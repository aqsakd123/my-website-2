import { Link } from 'react-router-dom'

import styled from '@emotion/styled'
import { Box, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material'
import { LinkItemsType } from '../components/Sidebar'
import { ReactFragment, ReactNode, useState } from 'react'
import { keyframes, styled as cStyled } from 'styled-components'
import { RootState } from '@app/store/store'
import { useSelector } from 'react-redux'
import ColorUtils from '@app/helpers/ColorUtils'
import { ArrowDropDownSharp } from '@mui/icons-material'
import AnimatedIcon from './AnimatedIcon'

const StyledLink = styled(Link)`
  width: 100%;
  padding: 0px;

  .css-180cu36 {
    padding: 0px;
  }

  .styled-link {
    padding: 0px;
    margin-right: 0px;
  }

  .list-text {
    span {
      font-weight: 600;
    }
  }

  .styled-linked-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const GifContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export type TypeIcon = 'checklist' | 'target' | 'rocket' | 'finance' | 'award' | '7-days'

const shakeAnimation = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(2px);
  }
  75% {
    transform: translateX(-2px);
  }
`

const ShakingTextWrapper = cStyled.span`  
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  color: coral;
  
  &:hover {
    animation: ${shakeAnimation} 0.5s ease-in-out infinite;
  }
`

type Props = {
  handleClick?: (item: any) => void
  item: LinkItemsType
  isOpen: boolean
  type?: TypeIcon
  icon?: ReactFragment | ReactNode
}

const IconLinkList = (props: Props) => {
  const { handleClick, item, isOpen } = props

  const { icon, children } = item

  const [openHide, setOpenHide] = useState(false)

  const selectedColor = useSelector((state: RootState) => state.commonStore.sidebarColor)

  const handleClickItem = () => {
    if (handleClick) {
      handleClick(item)
    }
  }

  const handleHide = () => {
    setOpenHide(!openHide)
  }

  const isDisplayFirstChar = !isOpen && !icon
  const selected = location.pathname.split('/')[1] === item?.link.replace('/', '')

  return (
    <>
      <ListItem
        onClick={handleClickItem}
        style={{
          padding: '0px',
          display: 'flex',
          backgroundColor: selected ? `rgb(0,0,0,0.25)` : undefined,
          color: ColorUtils.getContrastingColor(selectedColor),
        }}
      >
        <StyledLink
          className='styled-link'
          to={item.link}
          style={{
            padding: '0px',
            marginRight: '0px',
            display: 'flex',
            alignItems: 'center',
            color: ColorUtils.getContrastingColor(selectedColor),
          }}
        >
          <Tooltip title={!isOpen ? item.text : undefined} placement='right'>
            <ListItemButton className='styled-linked-item'>
              {icon && (
                <GifContainer style={{ marginRight: isOpen ? '10px' : undefined }}>
                  <AnimatedIcon icon={icon} animation={item.animation || 'shake'} action='hover' />
                </GifContainer>
              )}
              {isDisplayFirstChar && (
                <ShakingTextWrapper>{item.text[0]?.toUpperCase()}</ShakingTextWrapper>
              )}
              {isOpen && <ListItemText className='list-text' primary={item.text} />}
            </ListItemButton>
          </Tooltip>
        </StyledLink>
        {children?.length && openHide && children?.length > 0 && (
          <ArrowDropDownSharp
            sx={{
              transform: `rotate(${openHide ? 180 : 0}deg)`,
              transition: 'transform 0.3s ease-in-out',
              height: '100%',
            }}
            onClick={handleHide}
          />
        )}
      </ListItem>

      {isOpen && openHide && (
        <Box sx={{ color: ColorUtils.getContrastingColor(selectedColor) }}>
          {children?.map((child) => (
            <ListItem key={child.id} disablePadding>
              <ListItemButton style={{ paddingLeft: '50px' }}>
                <ListItemText primary={child.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      )}
    </>
  )
}

export default IconLinkList
