import React, { useEffect, useState } from 'react'
import { Box, Button, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import ColorUtils from '@app/helpers/ColorUtils'
import { Close, Edit } from '@mui/icons-material'
import TagFormDialog from './Dialog/TagFormDialog'
import { DialogState } from '@app/store/commonStore/CommonStore'
import { useDispatch, useSelector } from 'react-redux'
import tagStore from '@app/store/tagStore/TagStore'
import { deleteTag, fetchTagList } from '@app/api/tag/tag-api'
import { RootState } from '@app/store/store'
import { useUnmount } from 'react-use'
import { IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popconfirm } from 'antd'

export type Tag = {
  id: string
} & TagBase

export type TagInput = {
  id?: string
} & TagBase

type TagBase = {
  name: string
  description: string
  color?: string
  status: number
  type?: string
  icon?: string
}

type Props = {
  type: string
}

const TagList: React.FC<Props> = (props: Props) => {
  const { type } = props

  const [tagFormDialogMode, setTagFormDialogMode] = useState<DialogState>('none')

  const { loadingStatus, dataList } = useSelector((state: RootState) => state.tagStore)
  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const tagList = dataList || []

  const dispatch = useDispatch()

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        dispatch(tagStore.actions.setLoadingStatus('Loading'))
        const fetchedData = await fetchTagList({
          type: type,
        })
        dispatch(tagStore.actions.setTagList(fetchedData || []))
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(tagStore.actions.setLoadingStatus('Loaded'))
      }
    }

    if (loadingStatus === 'NotLoad') {
      handleFetchData()
      dispatch(tagStore.actions.setTypeOpenScreen(type))
    }
  }, [loadingStatus, type])

  useUnmount(() => {
    dispatch(tagStore.actions.clearAll())
  })

  const handleClickEditTag = (item: Tag) => {
    dispatch(tagStore.actions.setEditItem(item))
    setTagFormDialogMode('edit')
  }

  const handleClickAddNew = () => {
    setTagFormDialogMode('add')
  }

  const handleReturnFormDialog = () => {
    setTagFormDialogMode('none')
    dispatch(tagStore.actions.setEditItem(undefined))
  }

  const handleClickDeleteTag = async (item: Tag) => {
    if (item.id) {
      await deleteTag(item.id)
      dispatch(tagStore.actions.setLoadingStatus('NotLoad'))
    }
  }

  return (
    <>
      {tagFormDialogMode !== 'none' && (
        <TagFormDialog mode={tagFormDialogMode} onReturn={handleReturnFormDialog} />
      )}
      <Box mb={1} mt={1} display='flex' flexDirection='row-reverse'>
        <Button variant='outlined' onClick={handleClickAddNew}>
          Add new
        </Button>
      </Box>
      <ToggleButtonGroup orientation='vertical' style={{ width: '100%' }}>
        {tagList.map((tag) => {
          const bgColor = tag.color ? tag.color : darkMode ? '#ddd1d1' : '#434141'
          return (
            <Tooltip
              title={
                tag.description ? (
                  <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                    {tag.description}
                  </span>
                ) : undefined
              }
              arrow
            >
              <ToggleButton
                value={tag.id}
                style={{
                  backgroundColor: bgColor,
                  color: ColorUtils.getContrastingColor(bgColor),
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    {tag?.icon && (
                      <FontAwesomeIcon
                        icon={['fas', tag?.icon as IconName]}
                        color={ColorUtils.getContrastingColor(bgColor)}
                      />
                    )}
                  </div>
                  <span style={{ fontWeight: 'bold' }}>{tag.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Edit fontSize='small' onClick={() => handleClickEditTag(tag)} />
                    <Popconfirm
                      title='Are you sure you want to delete this tag?'
                      onConfirm={() => handleClickDeleteTag(tag)}
                      okText='Yes'
                      cancelText='No'
                    >
                      <Button variant='text' onClick={(e) => e.stopPropagation()}>
                        <Close />
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </ToggleButton>
            </Tooltip>
          )
        })}
      </ToggleButtonGroup>
    </>
  )
}

export default TagList
