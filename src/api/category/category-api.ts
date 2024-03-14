import { Category, CategoryInput } from '@app/pages/CategoryManagement/CategoryList'
import axiosInstance from '../axios'
import { INSERT_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from './category-type-graphql'
import axios from '../axios'

const BASE_URL = '/graphql'

export async function fetchCategoryList(type: string): Promise<Category[]> {
  try {
    const response = await axios.post<Category[]>('api/category/list', { type: type })
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const insertCategory = async (categoryInput: CategoryInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_CATEGORY,
    variables: { category: categoryInput },
  })

  return response?.data?.data?.insertCategory
}

export const updateCategory = async (id: string, categoryInput: CategoryInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_CATEGORY,
    variables: { id, category: categoryInput },
  })

  return response?.data?.data?.updateCategory
}

export const deleteCategory = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_CATEGORY,
    variables: { id },
  })

  return response?.data?.data?.deleteCategory
}
