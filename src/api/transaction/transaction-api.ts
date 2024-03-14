import {
  TransactionInput,
  TransactionSpecification,
} from '@app/pages/TransactionManagement/TransactionList'
import axiosInstance from '../axios'
import {
  DELETE_TRANSACTION,
  GET_LIST_TRANSACTIONS,
  INSERT_TRANSACTION,
  UPDATE_TRANSACTION,
} from './transaction-type-graphql'

const BASE_URL = '/graphql'

export const fetchTransactionList = async (specification?: TransactionSpecification) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: GET_LIST_TRANSACTIONS,
    variables: {
      specification: specification || {},
    },
  })
  return response.data?.data?.getListTransaction
}

export const insertTransaction = async (transactionInput: TransactionInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_TRANSACTION,
    variables: { transaction: transactionInput },
  })

  return response.data.data.insertTransaction
}

export const updateTransaction = async (id: string, transactionInput: TransactionInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_TRANSACTION,
    variables: { id, transaction: transactionInput },
  })

  return response.data.data.updateTransaction
}

export const deleteTransaction = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_TRANSACTION,
    variables: { id },
  })

  return response.data.data.deleteTransaction
}
