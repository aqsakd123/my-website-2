import { Box } from '@mui/material'
import WorkSpaceList from '../WorkSpace/WorkSpaceList'

type Props = {
  screenId?: string
}
const Workspaces: React.FC<Props> = () => {
  return (
    <Box>
      <WorkSpaceList />
    </Box>
  )
}

export default Workspaces
