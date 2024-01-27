import React from 'react'
import * as Icons from 'react-icons/fa'

const Icon = (props: { name: string }) => {
  const { name } = props
  // @ts-ignore
  const IconComponent = Icons[name]
  return <>{IconComponent ? <IconComponent /> : <span>No Icon Found</span>}</>
}

export default Icon
