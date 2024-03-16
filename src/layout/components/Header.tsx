import './Header.scss'

import { AppContext } from '@app/config/context'
import { useContext, useEffect } from 'react'
import React from 'react'
import Sidebar, { linkItems } from './Sidebar'
import styled from '@emotion/styled'
import { MenuItem, Box, IconButton, Menu, Divider, Button, Tooltip } from '@mui/material'
import { Person } from '@mui/icons-material'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline'
import { loggingOut } from '@app/api/axios'
import DialogAward from '@app/pages/AwardManagement/DialogAward'
import { RootState } from '@app/store/store'
import { useDispatch, useSelector } from 'react-redux'
import awardStore from '@app/store/awardStore/AwardStore'
import { fetchAwardList } from '@app/api/award/award-api'

type HeaderProps = {
  displaySidebar: boolean
  handleChangeSideStatus: () => void
}

const StyledMenu = styled(MenuItem)`
  width: 220px;
`

const StyledMenuCheckingPoint = styled(MenuItem)`
  width: 220px;
  display: flex;
  justify-content: space-between;
  .gift-btn {
    width: 30px;
    min-width: 30px;
    height: 30px;
    border: 1px solid darkgray;
    font-size: 17px;
  }
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

  const { dataList, loadingStatus } = useSelector((state: RootState) => state.awardStore)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [dialogAwardOpen, setDialogAwardOpen] = React.useState<boolean>(false)

  const [title, setTitle] = React.useState<string>(
    linkItems.filter((item) => location.pathname.split('/')[1] === item?.link.replace('/', ''))[0]
      ?.text,
  )
  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        dispatch(awardStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchAwardList()
        dispatch(awardStore.actions.setAwardList(fetchedData || []))
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(awardStore.actions.setLoadingStatus('Loaded'))
      }
    }

    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus])

  const currentPoint = 2500

  const awardList =
    dataList
      .filter((it) => it.awardPoint > currentPoint)
      .sort((a, b) => a?.awardPoint - b?.awardPoint) || [] // Sort the filtered awardList by awardPoint
  const nextCheckpoint = awardList[0]

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

  const handleOpenDialogAward = () => {
    setDialogAwardOpen(true)
  }

  const handleCloseDialogAward = () => {
    setDialogAwardOpen(false)
  }

  return (
    <StyledHeader className='header'>
      {dialogAwardOpen && <DialogAward onReturn={handleCloseDialogAward} />}
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
          <StyledMenu onClick={handleOpenDialogAward}>Manage Award</StyledMenu>
          <StyledMenuCheckingPoint>
            <div>
              {currentPoint}/{nextCheckpoint?.awardPoint}
            </div>
            <Tooltip
              title={
                nextCheckpoint?.description ? (
                  <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                    {nextCheckpoint?.description}
                  </span>
                ) : undefined
              }
              arrow
            >
              <Button className='gift-btn'>🎁</Button>
            </Tooltip>
          </StyledMenuCheckingPoint>
          <StyledMenu onClick={handleLogout}>Logout</StyledMenu>
        </Menu>
      </div>
    </StyledHeader>
  )
}

export default Header
