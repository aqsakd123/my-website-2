import { Box } from '@mui/material'
import TaskListList from '../TaskListManagement/TaskListList'

type Props = {
  screenId?: string
}
const Target: React.FC<Props> = () => {
  return (
    <Box>
      <TaskListList />
    </Box>
  )
}

export default Target
