import { Grid } from '@mui/material'
import { useState } from 'react'
import Memo from './Components/Memo'
import { MemoInput } from '@app/api/memo/memo-type'
import TagList from '@app/pages/tags/TagList'

type Props = {
  screenId?: string
}

const MemoList: React.FC<Props> = () => {
  const [dataList] = useState<MemoInput[]>([])

  return (
    <Grid container spacing={2}>
      {dataList?.map((item) => {
        return <Memo key={item.id} listData={item} type='memo' />
      })}
      <TagList type='study' />
    </Grid>
  )
}

export default MemoList
