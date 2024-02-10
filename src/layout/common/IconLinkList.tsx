import { Link } from 'react-router-dom'

import styled from '@emotion/styled'
import { Box, ListItem, ListItemButton, Tooltip } from '@mui/material'
import { LinkItemsType } from '../components/Sidebar'
import { ReactFragment, ReactNode, useState } from 'react'
import { keyframes, styled as cStyled } from 'styled-components'
import { RootState } from '@app/store/store'
import { useSelector } from 'react-redux'
import ColorUtils from '@app/helpers/ColorUtils'
import { ArrowDropDownSharp } from '@mui/icons-material'
import AnimatedIcon from './AnimatedIcon'

const StyledLink = styled(Box)<{ $hideMode: boolean; $isSelected: boolean; $sidebarColor: string }>`
  width: 100%;
  padding: 0px;

  .list-item {
    padding: 0px;
    display: flex;
    ${({ $isSelected }) => ($isSelected ? `background-color: rgb(0,0,0,0.25);` : '')}
    color: ${({ $sidebarColor }) => ColorUtils.getContrastingColor($sidebarColor)};

    .styled-link {
      padding: 0px;
      margin-right: 0px;
      width: 100%;
      display: flex;
      align-items: center;
      color: ${({ $sidebarColor }) => ColorUtils.getContrastingColor($sidebarColor)};
    }
  }

  .list-text {
    font-weight: 600;
  }

  .styled-linked-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    ${({ $hideMode }) => ($hideMode ? `justify-content: center;` : 'justify-content: flex-start;')}
    align-items: center;
  }

  .arrow-icon {
    ${({ $hideMode }) => ($hideMode ? `transform: rotate(180deg);` : '')}
    transition: transform 0.3s ease-in-out;
    height: 100%;
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
  font-size: 14px;

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
    <StyledLink $hideMode={!isOpen} $isSelected={selected} $sidebarColor={selectedColor}>
      <ListItem className='list-item' onClick={handleClickItem}>
        <Link className='styled-link' to={item.link}>
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
              {isOpen && <span className='list-text'>{item.text}</span>}
            </ListItemButton>
          </Tooltip>
        </Link>
        {children && isOpen && children?.length > 0 && (
          <ArrowDropDownSharp className='arrow-icon' onClick={handleHide} />
        )}
      </ListItem>

      {isOpen && openHide && (
        <Box sx={{ color: ColorUtils.getContrastingColor(selectedColor) }}>
          {children?.map((child) => (
            <ListItem key={child.id} disablePadding>
              <ListItemButton style={{ paddingLeft: '50px' }}>
                <span className='list-text'>{item.text}</span>
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      )}
    </StyledLink>
  )
}

export default IconLinkList
