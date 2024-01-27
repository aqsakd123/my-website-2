import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography/Typography'
import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface IBreadCrumb {
  url?: string
  text?: string
}
type Props = {
  breadcrumbs: IBreadCrumb[]
}

const BreadCrumbs = (props: Props) => {
  const { breadcrumbs } = props
  const navigate = useNavigate()

  const onClick = (item: any) => {
    navigate(item.url)
  }
  const getBreadCrumbs = React.useMemo(() => {
    const arr = breadcrumbs?.map((item, index) => {
      if (index === breadcrumbs.length - 1) {
        return (
          <Typography key={index} style={{ fontSize: '16px' }}>
            {item.text}
          </Typography>
        )
      }
      return (
        <Link
          to={item.url ? item.url : ''}
          key={index}
          onClick={() => onClick(item) as any}
          style={{ cursor: 'pointer', textDecoration: 'none', color: 'black', fontSize: '16px' }}
        >
          {item.text}
        </Link>
      )
    })
    return arr
  }, [breadcrumbs])

  return (
    <div className='breadcrumb'>
      <div>
        <Breadcrumbs separator={'/'} aria-label='breadcrumb'>
          {getBreadCrumbs}
        </Breadcrumbs>
      </div>
    </div>
  )
}
export default BreadCrumbs
