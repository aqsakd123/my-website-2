import { Outlet } from 'react-router-dom'
import React from 'react'
import Header from '@app/layout/components/Header'
import { drawerWidth } from './components/Sidebar'
import commonStore from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import { baseGroundColor } from '@app/config/ThemeProvider'
import BackgroundIMG from '@app/assets/img/abstract.jpg'
import styled from 'styled-components'

const StyledDefault = styled.div`
  width: 100%;
  height: calc(100% - 64px);

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
    transition: all 0.4s ease;
    padding-bottom: 20px;
  }

  .cover-img {
    background-image: url(${BackgroundIMG});
  }
`

const Default = () => {
  const { darkMode, isSidebar } = useSelector((state: RootState) => state.commonStore)

  const dispatch = useDispatch()

  const handleChangeSideStatus = () => {
    dispatch(commonStore.actions.setSidebar(!isSidebar))
  }

  return (
    <StyledDefault>
      <Header displaySidebar={isSidebar} handleChangeSideStatus={handleChangeSideStatus} />
      <div
        className='cover-img'
        style={{
          color: darkMode ? 'white' : 'black',
        }}
      >
        <div
          className='container-content'
          style={{
            paddingLeft: isSidebar ? `${drawerWidth + 35}px` : '75px',
            backgroundColor: darkMode ? `${baseGroundColor(darkMode).primary}c7` : '#ffffff7a',
          }}
        >
          <Outlet />
        </div>
      </div>
    </StyledDefault>
  )
}

export default Default
