import { Outlet } from 'react-router-dom'
import React from 'react'
import Header from '@app/layout/components/Header'
import { drawerWidth } from './components/Sidebar'
import commonStore from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import { baseFontColors } from '@app/config/ThemeProvider'
import BackgroundIMG from '@app/assets/img/abstract.jpg'
import styled from 'styled-components'

const StyledDefault = styled.div`
  .cover-img {
    width: 100%;
    height: 100%;
    overflow: auto;
    transition: all 0.4s ease;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  .container-content {
    padding-top: 20px;
    padding-right: 20px;
    width: 100%;
    min-height: 100%;
  }
`

const Default = () => {
  const { darkMode, isSidebar } = useSelector((state: RootState) => state.commonStore)

  const dispatch = useDispatch()

  const handleChangeSideStatus = () => {
    dispatch(commonStore.actions.setSidebar(!isSidebar))
  }

  return (
    <StyledDefault style={{ width: '100%', height: 'calc(100% - 64px)' }}>
      <Header displaySidebar={isSidebar} handleChangeSideStatus={handleChangeSideStatus} />
      <div
        className='cover-img'
        style={{
          backgroundImage: `url(${BackgroundIMG})`,
          color: darkMode ? 'white' : 'black',
        }}
      >
        <div
          className='container-content'
          style={{
            paddingLeft: isSidebar ? `${drawerWidth + 35}px` : '75px',
            transition: 'all 0.4s ease',
            paddingBottom: '20px',
            backgroundColor: darkMode ? `${baseFontColors(darkMode).primary}c7` : '#ffffff7a',
          }}
        >
          <Outlet />
        </div>
      </div>
    </StyledDefault>
  )
}

export default Default
