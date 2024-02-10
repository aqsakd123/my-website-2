declare module '@sinm/react-chrome-tabs' {
  import React from 'react'

  interface ChromeTabsProps {
    Tabs: any
  }

  const ChromeTabs: React.FC<ChromeTabsProps>

  export default ChromeTabs
}
