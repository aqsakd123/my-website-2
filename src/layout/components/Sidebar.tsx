import './Header.scss'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { Drawer, List } from '@mui/material'
import IconLinkList, { TypeIcon } from '../common/IconLinkList'
import SettingsButton from './SettingButton'
import { RootState } from '@app/store/store'
import { useSelector } from 'react-redux'
import {
  AccountBalanceWalletOutlined,
  AssignmentSharp,
  CalendarMonthSharp,
  EditNoteOutlined,
  RocketLaunchOutlined,
} from '@mui/icons-material'
import { GiTargeting } from 'react-icons/gi'
import { LuBookMarked } from 'react-icons/lu'
import { AnimationType } from '../common/AnimatedIcon'
import { tokens } from '@app/config/ThemeProvider'
import { useFontAwesomeIconPack } from '@app/components/common/IconPicker/hooks/useCollectIconPack'

export const drawerWidth = 240
type SidebarProps = {
  open: boolean
  setTitle: (str: string) => void
}

export type LinkItemsType = {
  id: number
  text: string
  link: string
  type?: TypeIcon
  icon?: ReactNode
  separator?: boolean
  animation?: AnimationType
  children?: LinkItemsType[]
}

const StyledDrawer = styled(Drawer)<{ $isOpen: boolean }>`
  ${({ $isOpen }) => ($isOpen ? `width: ${drawerWidth}px;` : 'width: 40px;')}
  background-color: transparent;

  & .MuiDrawer-paper {
    ${({ $isOpen }) => ($isOpen ? `width: ${drawerWidth}px;` : 'width: 40px;')}
    transition: all 0.4s ease;
    box-sizing: border-box;
    height: auto;
    max-height: 70%;
    margin-top: 5%;
    overflow: hidden;
    position: absolute;
    left: 20px;
    flex-shrink: 0;
    border: none;
    border-radius: 20px;
    box-shadow: 8px;
  }

  .MuiList-root {
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .css-azpq5 {
    padding: 0px;
    margin-right: 0px;
  }

  .list {
    overflow: auto;
    overflow-x: hidden;

    &:after {
      content: '';
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      // background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
      pointer-events: none; /* Allow interactions with the content behind */
    }
  }
`

export const linkItems: LinkItemsType[] = [
  {
    id: 1,
    text: 'Dashboard',
    link: '/',
  },
  {
    id: 3,
    text: 'Today',
    link: '/target',
    animation: 'spin',
    icon: <GiTargeting style={{ height: '25px', width: '25px' }} />,
  },
  {
    id: 4,
    text: 'Next 7 days',
    link: '/next-7-days',
    separator: true,
    icon: <CalendarMonthSharp />,
  },
  {
    id: 2,
    text: 'All my task',
    link: '/tasks',
    animation: 'flip',
    icon: <AssignmentSharp />,
  },

  {
    id: 5,
    text: 'Workspaces',
    link: '/work-spaces',
    icon: <RocketLaunchOutlined />,
  },
  {
    id: 6,
    text: 'Finance Management',
    link: '/finance',
    icon: <AccountBalanceWalletOutlined style={{ height: '20px', width: '20px' }} />,
    animation: 'flip',
  },
  {
    id: 7,
    text: 'Memo',
    link: '/memo',
    icon: <EditNoteOutlined />,
  },
  {
    id: 8,
    text: 'Study Cards',
    link: '/study-cards',
    animation: 'none',
    icon: <LuBookMarked style={{ height: '20px', width: '20px' }} />,
  },
]

const Sidebar = (props: SidebarProps) => {
  const { open, setTitle } = props

  const selectedColor = useSelector((state: RootState) => state.commonStore.sidebarColor)
  const darkMode = useSelector((state: RootState) => state.commonStore.darkMode)
  useFontAwesomeIconPack()

  const borderColor = tokens(darkMode).blueAccent[300]
  function handleChooseLink(item: LinkItemsType): void {
    setTitle(item.text)
  }

  return (
    <>
      <StyledDrawer variant='persistent' anchor='left' $isOpen={open} open>
        <List
          className='list'
          sx={{
            backgroundColor: selectedColor,
            border: open ? `4px solid ${borderColor}` : 'none',
            borderRadius: '20px',
          }}
        >
          {linkItems.map((item) => (
            <IconLinkList key={item.id} handleClick={handleChooseLink} item={item} isOpen={open} />
          ))}
        </List>
      </StyledDrawer>
      <SettingsButton />
    </>
  )
}

export default Sidebar
