import './DarkModeSwitch.css'
import { RootState } from '@app/store/store'
import { useSelector, useDispatch } from 'react-redux'
import commonStore from '@app/store/commonStore/CommonStore'

const DarkModeSwitch = () => {
  const darkMode = useSelector((state: RootState) => state.commonStore.darkMode)

  const dispatch = useDispatch()

  const handleToggle = () => {
    dispatch(commonStore.actions.setDarkMode(!darkMode))
  }

  return (
    <div className='container'>
      <div>Light</div>
      <div className={`wrapper ${darkMode ? 'change-color' : ''}`}>
        <div
          role='switch'
          className={`toggle-field ${darkMode ? 'change-color' : ''}`}
          onClick={handleToggle}
        >
          <div className={`field-border ${darkMode ? 'bounce-moon' : 'bounce-sun'}`} />
          <div
            className={`toggle-circle-0 ${darkMode ? 'change-color-dark' : 'change-color-light'}`}
          />
          <div className={`sun ${darkMode ? 'change-color' : ''}`}>
            <div className='rays-top' />
            <div className='rays-bottom' />
          </div>
          <div className={`dark-mode-right ${darkMode ? 'change-color' : ''}`}>
            <div className='moon'>
              <div className='moon-crater' />
            </div>
            <div className='stars'>
              <div className='star-1' />
              <div className='star-2' />
              <div className='star-3' />
            </div>
          </div>
        </div>
      </div>
      <div>Dark</div>
    </div>
  )
}

export default DarkModeSwitch
