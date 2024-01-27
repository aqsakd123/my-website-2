import { TablePagination as Pagination } from '@mui/material'
import { PAGE_SIZE_OPTIONS, PAGINATION_DEFAULT } from '@app/common/Contants'

type Props = {
  pageNumber: number
  pageSize: number
  onChangePageSize: (event: any) => void
  onChangePagination: any
  total: number
}
const PaginationComponent = (props: Props) => {
  const { pageNumber, pageSize, onChangePageSize, onChangePagination, total } = props
  const pageSizeOptions = PAGE_SIZE_OPTIONS

  return (
    <div className='pagination'>
      {total != 0 && (
        <Pagination
          component='div'
          onPageChange={onChangePagination}
          rowsPerPageOptions={pageSizeOptions}
          rowsPerPage={pageSize}
          page={pageNumber - 1}
          count={total || PAGINATION_DEFAULT.PAGE_SIZE}
          size={'small'}
          onRowsPerPageChange={onChangePageSize}
          style={{ display: 'flex', flexDirection: 'row-reverse' }}
        />
      )}
    </div>
  )
}

export default PaginationComponent
