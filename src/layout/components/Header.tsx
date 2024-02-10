import './Header.scss'

import { AppContext } from '@app/config/context'
import { useContext } from 'react'
import React from 'react'
import Sidebar, { linkItems } from './Sidebar'
import styled from '@emotion/styled'
import { MenuItem, Box, IconButton, Menu, Divider } from '@mui/material'
import { Person } from '@mui/icons-material'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline'
import { loggingOut } from '@app/api/axios'

type HeaderProps = {
  displaySidebar: boolean
  handleChangeSideStatus: () => void
}

const StyledMenu = styled(MenuItem)`
  width: 220px;
`
const StyledHeader = styled.div`
  transition: all 0.4s ease;
  height: 64px;
  background-color: #111827;
  border-bottom: 1px solid white;

  .header-icon {
    color: #94a3b8;
  }

  .header-left {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    margin-left: 10px;

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .divider {
      margin-left: 5px;
      height: 25px;
      margin-right: 15px;
    }
  }
`

const Header = (props: HeaderProps) => {
  const { displaySidebar, handleChangeSideStatus } = props
  const { removeUser } = useContext(AppContext)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [title, setTitle] = React.useState<string>(
    linkItems.filter((item) => location.pathname.split('/')[1] === item?.link.replace('/', ''))[0]
      ?.text,
  )

  const displayMenu = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    try {
      removeUser()
      loggingOut()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <StyledHeader className='header'>
      <Box className='header-left'>
        <Sidebar open={displaySidebar} setTitle={setTitle} />
        <div className='title'>
          <IconButton className='header-icon' onClick={handleChangeSideStatus}>
            <ViewHeadlineIcon />
          </IconButton>
          <Divider className='divider' orientation='vertical' color='#94a3b8' />
          <span className='header-title'>{title}</span>
        </div>
      </Box>
      <div className='header-right'>
        <IconButton className='header-icon' onClick={handleClick}>
          <Person />
        </IconButton>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={displayMenu}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <StyledMenu onClick={handleLogout}>Logout</StyledMenu>
        </Menu>
      </div>
    </StyledHeader>
  )
}

export default Header
