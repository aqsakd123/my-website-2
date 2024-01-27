import { EALIGN, PAGINATION_DEFAULT, SORT_TYPE } from '@app/common/Contants'
import {
  Button,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import { useState } from 'react'
import Pagination from '../Pagination/Pagination'
import styled from 'styled-components'

export interface IColumnTable<T> {
  column: keyof T | 'action'
  title: any
  searchTitle?: string
  placeholder?: string
  minValue?: string
  isInteger?: boolean
  align?: EALIGN
  width?: number
  isSort?: boolean
  getLinkTo?: any
  isSortDefault?: boolean
  orderDefault?: string
  transformData?: any
  actions?: ITableAction[]
  searchConfig?: ISearchConfig
  isClearable?: boolean
  renderCell?: any
}

export interface ISelectOption {
  id: string
  name: string
  sub_name?: string
}

export interface ISearchConfig {
  type: string
  options?: ISelectOption[]
  width?: string
  placeholder?: string
  minValue?: string
  isInteger?: boolean
  from_date_key?: string
  to_date_key?: string
  fullDate?: boolean
  isClearable?: boolean
}

export interface ITableAction {
  actionType: string
  actionTitle: string | any
  onClickHandler?: any
  disabled?: any
}

export interface ISort {
  order: string
  sort_by?: string
  sort?: string
}

type Props = {
  data: any[]
  pageSize?: number
  pageNumber?: number
  hanleChangePageSize?: (pageSize: number) => void
  onChangePageNumber?: (pageNumber: number) => void
  total?: number
  sortByColumn?: (value: ISort) => void
  // @ts-ignore
  columns: IColumnTable[]
  isPagination?: boolean
  height?: string
  isHideHeader?: boolean
  minWidth?: number
  handleEdit?: (data: any) => void
  handleDelete?: (data: any) => void
}

const StyledTableCell = styled(TableCell)`
  border-right: 1px solid #fff;
`

const TableComponent = (props: Props) => {
  const { PAGE_SIZE } = PAGINATION_DEFAULT

  const { ASC, DESC } = SORT_TYPE
  const ALIGN_DEFAULT = EALIGN.CENTER
  const {
    data,
    pageSize,
    pageNumber,
    hanleChangePageSize,
    onChangePageNumber,
    total,
    sortByColumn,
    columns: fieldsColumn,
    isPagination = true,
    height,
    isHideHeader = false,
    handleEdit,
    handleDelete,
  } = props

  const columns = fieldsColumn
  if (
    columns.findIndex((itemCol) => itemCol.column === 'action') === -1 &&
    (handleDelete || handleEdit)
  ) {
    columns.push({
      column: 'action',
      title: 'Action',
      actions: [],
    })
  }
  const generateTableAction = (actions: ITableAction[], item: any, index: number) => {
    const defaultAction: ITableAction[] = []
    const pushedList: string[] = []
    if (handleEdit && !actions.find((action) => action.actionType === 'edit')?.onClickHandler) {
      defaultAction.push({
        actionTitle: 'Edit',
        actionType: 'edit',
        onClickHandler: handleEdit,
        disabled: actions.filter((itemAction) => itemAction.actionType === 'edit')[0]?.disabled,
      })
      pushedList.push('edit')
    }
    if (handleDelete && !actions.find((action) => action.actionType === 'delete')?.onClickHandler) {
      defaultAction.push({
        actionTitle: 'Delete',
        actionType: 'delete',
        onClickHandler: handleDelete,
        disabled: actions.filter((itemAction) => itemAction.actionType === 'delete')[0]?.disabled,
      })
      pushedList.push('delete')
    }
    const actionList = actions
      .filter((itemA) => !pushedList.includes(itemA.actionType))
      .concat(defaultAction)
    return (
      <>
        {actions &&
          actionList.map(({ actionType, onClickHandler, actionTitle, disabled }) => {
            return (
              <Button
                key={`${actionType}-row-${index}`}
                onClick={() => onClickHandler(item)}
                // variant="contained"
                disabled={typeof disabled === 'function' ? disabled(item) : disabled}
              >
                {actionTitle}
              </Button>
            )
          })}
      </>
    )
  }

  const onChangePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
    onChangePageNumber && onChangePageNumber(value + 1)
  }
  const onChangePageSize = (event: any) => {
    hanleChangePageSize && hanleChangePageSize(Number(event.target.value))
  }

  const onSort = (data: ISort) => {
    sortByColumn && sortByColumn(data)
  }

  const columnSort = columns.find((c) => c.isSortDefault)

  const [activeSortColumn, setActiveSortColumn] = useState<{ [key: string]: boolean }>(
    columnSort ? { [columnSort.column]: true } : {},
  )

  const [toggleSort, setToggleSort] = useState<{ [key: string]: boolean }>(
    columnSort ? { [columnSort.column]: columnSort.orderDefault === ASC } : {},
  )

  const handlerSort = (column: string) => {
    setToggleSort({
      ...toggleSort,
      [column]: !toggleSort[column],
    })
    setActiveSortColumn({
      [column]: true,
    })
    const data: ISort = {
      sort_by: column,
      order: toggleSort[column] ? DESC : ASC,
    }
    onSort(data)
  }

  const generateTableHeader = () => {
    return (
      <TableRow>
        {columns.map(({ column, title, align = ALIGN_DEFAULT, width, isSort }, index) => {
          return (
            <StyledTableCell
              key={column}
              align={align}
              style={{
                // minWidth: width,
                maxWidth: width,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                position: 'relative',
                fontWeight: 500,
              }}
            >
              {isSort ? (
                <TableSortLabel
                  classes={{ icon: 'sbm-sort-icon' }}
                  active={activeSortColumn[column]}
                  direction={toggleSort[column] === true ? 'asc' : 'desc'}
                  onClick={() => handlerSort(column)}
                >
                  {title}
                </TableSortLabel>
              ) : (
                <>{title}</>
              )}
              {index !== columns.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(50% - 10px)',
                    right: 0,
                    height: '20px',
                    borderRight: '1px solid #e0e0e0',
                  }}
                />
              )}
            </StyledTableCell>
          )
        })}
      </TableRow>
    )
  }

  const generateTableCell = (transformData: any, item: any, column: string, getLinkTo: any) => {
    const text = transformData ? transformData(item) : item[column]
    return (
      <>
        {getLinkTo ? (
          <Link title={text}>
            <> {text}</>
          </Link>
        ) : (
          <span title={text} style={{ whiteSpace: 'pre-wrap' }}>
            {text}
          </span>
        )}
      </>
    )
  }

  return (
    <TableContainer style={{ height: height }} component={Paper}>
      <Table aria-label='customized table' stickyHeader>
        {!isHideHeader && <TableHead>{generateTableHeader()}</TableHead>}
        {data && data.length > 0 && (
          <TableBody>
            {data.map((item: any, i: number) => (
              <TableRow key={i}>
                {columns?.map(
                  ({
                    column,
                    align = ALIGN_DEFAULT,
                    transformData,
                    getLinkTo,
                    actions = [],
                    width,
                  }) => (
                    <TableCell
                      key={column}
                      align={align}
                      style={{
                        width: width,
                        maxWidth: width,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                    >
                      {column === 'action'
                        ? generateTableAction(actions, item, i)
                        : generateTableCell(transformData, item, column, getLinkTo)}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {isPagination && (
        <Pagination
          total={total as number}
          pageNumber={
            pageNumber != undefined && pageNumber >= 0 ? pageNumber : PAGINATION_DEFAULT.PAGE_NUMBER
          }
          onChangePageSize={onChangePageSize}
          pageSize={pageSize || PAGE_SIZE}
          onChangePagination={onChangePagination}
        />
      )}
    </TableContainer>
  )
}

export default TableComponent
