import React, { useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, Tab, Tabs } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import TransactionFormDialog from './Dialog/TransactionFormDialog'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch } from 'react-redux'

import { deleteTransaction, fetchTransactionList } from '@app/api/transaction/transaction-api'
import { Popconfirm } from 'antd'
import styled from 'styled-components'
import { IncomeCategory, OutcomeCategory, typeOptions } from './Dialog/TransactionFormInput'
import { Loading } from '@app/store/memoStore/MemoStore'
import financeStore from '@app/store/financeStore/FinanceStore'
import { Finance } from '../FinanceManagement/FinanceList'
import ColorUtils from '@app/helpers/ColorUtils'

const StyledItem = styled.div<{ $color?: string }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border: 1px solid gray;
  border-radius: 8px;
  margin-bottom: 8px;

  .name-info {
    font-size: 12px;
    padding: 3px;
    border-radius: 3px;
    width: fit-content;
    ${({ $color }) => ($color ? `border: 1px solid ${$color};` : '')}
    ${({ $color }) => ($color ? `background-color: ${$color};` : '')}
    ${({ $color }) => ($color ? `color: ${ColorUtils.getContrastingColor($color)};` : '')}
  }

  .transaction-money {
    font-style: italic;
  }

  .transaction-container {
    display: flex;
    flex-direction: column;
    word-break: break-all;
    width: calc(100% - 130px);
  }
`

export type Transaction = {
  id: string
} & TransactionBase

export type TransactionInput = {
  id?: string
} & TransactionBase

type TransactionBase = {
  name: string
  date: Date
  type: string
  specificType: string
  note?: string
  finance?: Finance
  moneyAmount: number
}

export type TransactionSpecification = {
  date?: Date
  type?: string
  finance?: Finance
}

type Props = {
  finance: Finance
  dataList: Transaction[]
  setDataList: (data: Transaction[]) => void
}

const TransactionList: React.FC<Props> = (props: Props) => {
  const { finance, dataList, setDataList } = props

  const [transactionFormDialogMode, setTransactionFormDialogMode] = useState<DialogState>('none')

  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [type, setType] = React.useState<string | undefined>('')

  const [loadingStatus, setLoadingStatus] = React.useState<Loading>('NotLoad')

  const transactionList = dataList || []

  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        setLoadingStatus('Loading')
        const fetchedData = await fetchTransactionList({
          date,
          type,
          finance: {
            id: finance.id,
            name: finance.name,
            initialAmount: finance.initialAmount,
          },
        })
        setDataList(fetchedData || [])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingStatus('Loaded')
      }
    }

    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus, date, type])

  const handleClickEditTransaction = (item: Transaction) => {
    dispatch(financeStore.actions.setTransactionEditItem(item))
    setTransactionFormDialogMode('edit')
  }

  const handleClickAddNew = () => {
    setTransactionFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setTransactionFormDialogMode('none')
    dispatch(financeStore.actions.setTransactionEditItem(undefined))
  }

  const handleClickDeleteTransaction = async (item: Transaction) => {
    if (item.id) {
      await deleteTransaction(item.id)
      setLoadingStatus('NotLoad')
    }
  }

  const handleChangeTab = (value: string) => {
    setType(value)
    setLoadingStatus('NotLoad')
  }

  // Update date to previous month
  const handlePreviousMonth = () => {
    setDate((prevDate) => {
      if (!prevDate) return undefined // If date is undefined, return undefined

      // Calculate the new month and year
      const newMonth = prevDate.getMonth() === 0 ? 11 : prevDate.getMonth() - 1
      const newYear =
        prevDate.getMonth() === 0 ? prevDate.getFullYear() - 1 : prevDate.getFullYear()

      // Create a new date with the previous month
      return new Date(newYear, newMonth, prevDate.getDate())
    })
    setLoadingStatus('NotLoad')
  }

  // Update date to next month
  const handleNextMonth = () => {
    setDate((prevDate) => {
      if (!prevDate) return undefined // If date is undefined, return undefined

      // Calculate the new month and year
      const newMonth = prevDate.getMonth() === 11 ? 0 : prevDate.getMonth() + 1
      const newYear =
        prevDate.getMonth() === 11 ? prevDate.getFullYear() + 1 : prevDate.getFullYear()

      // Create a new date with the next month
      return new Date(newYear, newMonth, prevDate.getDate())
    })
    setLoadingStatus('NotLoad')
  }

  return (
    <>
      {transactionFormDialogMode !== 'none' && (
        <TransactionFormDialog
          setLoadingStatus={setLoadingStatus}
          mode={transactionFormDialogMode}
          onReturn={handleReturnFormDialog}
          finance={finance}
        />
      )}

      <Box
        mb={1}
        mt={1}
        display='flex'
        flexDirection='row-reverse'
        justifyContent='space-between'
        alignItems='center'
        gap={1}
      >
        <Button variant='outlined' size='small' onClick={handleClickAddNew}>
          Add Transaction
        </Button>
        <Box>
          <Tabs
            value={type}
            onChange={(_e, v) => handleChangeTab(v)}
            textColor='secondary'
            indicatorColor='secondary'
            style={{ marginBottom: '10px' }}
          >
            <Tab value='' label='All' />
            <Tab value='income' label='Income' />
            <Tab value='outcome' label='Outcome' />
          </Tabs>
          <ButtonGroup variant='contained' sx={{ width: '100%' }} size='small'>
            <Button sx={{ width: '50%' }} onClick={handlePreviousMonth}>
              Last Month
            </Button>
            <Button sx={{ width: '50%' }} onClick={handleNextMonth}>
              Next Month
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <Box>
        {transactionList.map((transaction) => {
          return (
            <StyledItem $color='#907450' key={transaction.id}>
              <div className='transaction-container'>
                <Box display='block'>
                  <span className='name-info'>
                    {typeOptions?.find((option) => option.value === transaction.type)?.label}(
                    {
                      OutcomeCategory.concat(IncomeCategory)?.find(
                        (option) => option.value === transaction.specificType,
                      )?.label
                    }
                    )
                  </span>
                  &nbsp;
                  <span className='label'>{transaction.name}</span>
                </Box>
                <span className='transaction-money'>
                  {transaction.moneyAmount?.toLocaleString()},000 VND
                </span>
              </div>
              <div style={{ width: '130px' }}>
                <Button onClick={() => handleClickEditTransaction(transaction)}>
                  <Edit fontSize='small' />
                </Button>
                <Popconfirm
                  title='Are you sure you want to delete this transaction?'
                  onConfirm={() => handleClickDeleteTransaction(transaction)}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button variant='text' onClick={(e) => e.stopPropagation()}>
                    <Close />
                  </Button>
                </Popconfirm>
              </div>
            </StyledItem>
          )
        })}
      </Box>
    </>
  )
}

export default TransactionList
