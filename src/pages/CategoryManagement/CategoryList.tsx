import React, { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import CategoryFormDialog from './Dialog/CategoryFormDialog'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import categoryStore from '@app/store/categoryStore/CategoryStore'
import { RootState } from '@app/store/store'
import { useUnmount } from 'react-use'
import styled from 'styled-components'

import LoadingComponent from '@app/components/common/Loading/Loading'
import { deleteCategory, fetchCategoryList } from '@app/api/category/category-api'
import { AddOutlined, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { Tree } from 'antd'
import { Tag } from '../Tags/TagList'

const StyledList = styled.div<{ $darkMode: boolean }>`
  padding: 20px;

  .ant-tree-list-holder {
    background-color: ${({ $darkMode }) =>
      $darkMode ? '#2c2d31 !important' : '#ededf0 !important'};
  }

  .ant-tree-treenode,
  .ant-tree-treenode-motion,
  .ant-tree-treenode-switcher-open {
    width: 100%;
  }
  .ant-tree-node-content-wrapper {
    width: 100%;
  }
`

export type Category = {
  id: string
} & CategoryBase

export type CategoryInput = CategoryBase

type CategoryBase = {
  name: string
  description?: string
  type?: string
  tag?: Tag[]
  subCategories?: Category[]
}

type Props = {
  type: string
  setSelected: (value?: Category) => void
}

const CategoryList: React.FC<Props> = (props: Props) => {
  const { type, setSelected } = props
  const [categoryFormDialogMode, setCategoryFormDialogMode] = useState<DialogState>('none')
  const [parentId, setParentId] = useState<string | undefined>()

  const { loadingStatus, dataList } = useSelector((state: RootState) => state.categoryStore)
  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const categoryList = dataList || []

  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        if (!type) {
          return
        }
        dispatch(categoryStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchCategoryList(type)
        dispatch(categoryStore.actions.setCategoryList(fetchedData || []))
      } catch (error) {
        console.error(error)
      } finally {
        dispatch(categoryStore.actions.setLoadingStatus('Loaded'))
      }
    }
    if (loadingStatus === 'NotLoad') {
      handleFetchData()
    }
  }, [loadingStatus])

  useUnmount(() => {
    dispatch(categoryStore.actions.clearAll())
  })

  const handleClickEditCategory = (
    item: Category,
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (e) {
      e.stopPropagation()
    }
    dispatch(categoryStore.actions.setEditItem(item))
    setCategoryFormDialogMode('edit')
  }

  const handleClickAddNew = (
    parentId?: string,
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (e) {
      e.stopPropagation()
    }
    setCategoryFormDialogMode('add')
    setParentId(parentId)
  }

  const handleReturnFormDialog = () => {
    setCategoryFormDialogMode('none')
    dispatch(categoryStore.actions.setEditItem(undefined))
  }

  const handleClickDeleteCategory = async (
    item: Category,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      if (item.id) {
        event?.stopPropagation()
        await deleteCategory(item.id)
        dispatch(categoryStore.actions.setLoadingStatus('NotLoad'))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSelected = (value: Category) => {
    setSelected(value)
  }

  const renderNode: any = (item: Category) => {
    return {
      key: item.id,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1 }} onClick={() => handleSelected(item)}>
            {item.name}
          </div>
          <Button size='small' onClick={(e) => handleClickAddNew(item.id, e)}>
            <AddOutlined />
          </Button>
          <Button size='small' onClick={(e) => handleClickEditCategory(item, e)}>
            <EditOutlined />
          </Button>
          <Button size='small' onClick={(e) => handleClickDeleteCategory(item, e)}>
            <DeleteOutline />
          </Button>
        </div>
      ),
      children: item.subCategories?.map((cate: Category) => renderNode(cate)),
    }
  }

  return (
    <StyledList $darkMode={darkMode}>
      {loadingStatus !== 'Loaded' && <LoadingComponent />}
      {categoryFormDialogMode !== 'none' && (
        <CategoryFormDialog
          type={type}
          mode={categoryFormDialogMode}
          onReturn={handleReturnFormDialog}
          parentId={parentId}
        />
      )}
      <Box mb={1} mt={1} display='flex' flexDirection='row-reverse' alignItems='center' gap={1}>
        <Button variant='outlined' onClick={() => handleClickAddNew()}>
          Add new
        </Button>
      </Box>
      <Box>
        <Tree
          showLine
          defaultExpandAll
          autoExpandParent
          treeData={categoryList.map((item) => {
            return renderNode(item)
          })}
        />
      </Box>
    </StyledList>
  )
}

export default CategoryList
