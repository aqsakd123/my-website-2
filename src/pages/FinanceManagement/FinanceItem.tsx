import React from 'react'
import { Button } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import InfoIcon from '@mui/icons-material/Info'
import { Popconfirm, Tooltip } from 'antd'
import styled from 'styled-components'
import financeStore from '@app/store/financeStore/FinanceStore'
import { Finance } from '../FinanceManagement/FinanceList'
import ColorUtils from '@app/helpers/ColorUtils'
import RollingBox from '@app/components/common/RollingBox/RollingBox'
import { IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TransactionList, { Transaction } from '../TransactionManagement/TransactionList'
import { deleteFinance } from '@app/api/finance/finance-api'
import { RootState } from '@app/store/store'

const StyledItem = styled.div<{ $color?: string }>`
  width: 100%;
  border: 1px solid #8080802b;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 2px 2px #888888;

  height: 500px;
  overflow: auto;

  & .MuiTabs-root {
    min-height: 30px;
  }

  & .MuiTab-root {
    padding: 0px;
    min-height: 30px;
  }

  .header-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .info {
      display: flex;
      flex-direction: column;

      .name-info {
        font-size: 20px;
        padding: 8px;
        border-radius: 8px;
        ${({ $color }) => ($color ? `background-color: ${$color};` : '')}
        ${({ $color }) => ($color ? `color: ${ColorUtils.getContrastingColor($color)};` : '')}
      }
    }
  }

  .action-btn {
    min-width: 130px;
  }
`

type Props = {
  finance: Finance
  handleCloseDialog: (value: DialogState) => void
}

const FinanceItem: React.FC<Props> = (props: Props) => {
  const { finance, handleCloseDialog: setFinanceFormDialogMode } = props

  const [transactionData, setTransactionData] = React.useState<Transaction[]>([])

  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const dispatch = useDispatch()

  const handleClickEditFinance = (item: Finance) => {
    dispatch(financeStore.actions.setEditItem(item))
    setFinanceFormDialogMode('edit')
  }

  const handleClickDeleteFinance = async (item: Finance) => {
    if (item.id) {
      await deleteFinance(item.id)
      dispatch(financeStore.actions.setLoadingStatus('NotLoad'))
    }
  }

  return (
    <StyledItem
      $color={finance?.color}
      style={{ backgroundColor: darkMode ? '#0a2237c9' : '#faebd773' }}
    >
      <div className='header-item'>
        <div className='info'>
          <Tooltip
            placement='top'
            title={
              finance.description ? (
                <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                  {finance.description}
                </span>
              ) : undefined
            }
          >
            <RollingBox width='300px' className='name-info'>
              <FontAwesomeIcon icon={['fas', finance.icon as IconName]} />
              &nbsp;
              <span>{finance.name}</span>
            </RollingBox>
          </Tooltip>
          <div>
            <span>Current Amount: {finance.totalSum?.toLocaleString()},000 VND &nbsp;</span>
          </div>
        </div>
        <div className='action-btn'>
          <Button onClick={() => handleClickEditFinance(finance)}>
            <Edit fontSize='small' />
          </Button>
          <Popconfirm
            title='Are you sure you want to delete this finance?'
            onConfirm={() => handleClickDeleteFinance(finance)}
            okText='Yes'
            cancelText='No'
          >
            <Button variant='text' onClick={(e) => e.stopPropagation()}>
              <Close />
            </Button>
          </Popconfirm>
        </div>
      </div>
      <TransactionList
        finance={finance}
        dataList={transactionData}
        setDataList={setTransactionData}
      />
    </StyledItem>
  )
}

export default FinanceItem
