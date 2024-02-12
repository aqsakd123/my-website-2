import React, { useState } from 'react'
import {
  Box,
  Tab,
  Tabs,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  TextField,
  Tooltip,
  Button,
  Chip,
} from '@mui/material'
import {
  Add,
  AddCircleOutline,
  CloseSharp,
  DragIndicator,
  MoreHorizOutlined,
} from '@mui/icons-material'
import AddEditDialog from '../Dialog/AddEditDialog'
import TextInput from '@app/components/common/TextInputField/TextInput'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import ColorPalleter from './ColorPallete'
import ColorUtils from '@app/helpers/ColorUtils'
import { BsPinAngleFill } from 'react-icons/bs'
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import { StrictModeDroppable } from '@app/components/common/StrictModeDroppable/StrictModeDroppable'
import { MemoInput, TabDataInput } from '@app/api/memo/memo-type'
import { changeStatus, deleteMemo, updateMemo } from '@app/api/memo/memo-api'
import { useDispatch } from 'react-redux'
import memoStore from '@app/store/memoStore/MemoStore'
import styled from 'styled-components'
import SunEditor from '@app/components/common/SunEditor/SunEditor'
import TagList, { Tag } from '@app/pages/Tags/TagList'

type Props = {
  listData: MemoInput
  type: 'memo' | 'study'
}

type TabType = TabDataInput & {
  prefixId: string
}

const StyledDraggable = styled(Box)`
  height: 100%;

  & .MuiTabs-indicator {
    background-color: #000eff;
  }
`

const StyledGrid = styled(Grid)<{ $colorData: string; $editMode: boolean; $type: string }>`
  .containe-box {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 5px;
    padding: 0px 8px;
    align-items: center;

    & .MuiInputBase-input {
      color: ${({ $colorData }) => ColorUtils.getContrastingColor($colorData)};
    }

    .header-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 5px;

      .name-memo {
        white-space: pre-line;
        word-break: break-word;
      }
    }
  }

  .tag-container {
    margin-bottom: 5px;
    .tag-icon {
      margin-left: 5px;
      margin-right: 5px;
    }
  }

  .tab-container {
    border-radius: 8px;
    display: flex;

    .tab-item {
      border-radius: 8px 0px 0px 8px;
      height: 100%;
    }

    .drag-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      height: 100%;
    }

    .tab-tabname {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80px;
    }

    .tab-component {
      min-width: 50px;
      max-width: 150px;
      width: 100%;
      padding-left: 3px;
      padding-right: 3px;
      min-height: 30px;
    }

    .tab-idx {
      display: flex;
      alignitems: center;
      color: ${({ $colorData }) => ColorUtils.getContrastingColor($colorData)};
      & .MuiInputBase-input {
        color: ${({ $colorData }) => ColorUtils.getContrastingColor($colorData)};
      }
    }
  }

  .sun-editor-container {
    border-radius: ${({ $type }) => ($type === 'memo' ? '8px' : '0px 8px 8px 0px')};
    height: ${({ $type }) => ($type === 'memo' ? '300px' : '500px')};
    overflow: auto;
    width: 100%;

    .sun-editor-editable,
    .se-container,
    .se-wrapper,
    .sun-editor {
      background-color: #fff0;
    }

    .se-resizing-bar {
      display: none;
    }
  }

  .sun-editor-item {
    .MuiInputBase-input {
      color: ${({ $colorData }) => ColorUtils.getContrastingColor($colorData)};
      font-weight: 100;
    }

    .MuiInputBase-root {
      border-radius: ${({ $type }) => ($type === 'memo' ? '8px 8px 0px 0px' : '0px 8px 0px 0px')};
    }

    .sun-editor-editable table td,
    .sun-editor-editable table th {
      border: 1px solid #6d6d6d;
    }

    .sun-editor-editable blockquote {
      border: solid #1100ff;
      color: wheat;
      background-color: #3b3737;
      border-width: 0 0 0 5px;
    }
  }

  .color-palette {
    margin-left: 15px;
    height: 30px;
    display: flex;
    align-items: center;
  }
`

const Memo: React.FC<Props> = (props: Props) => {
  const { listData, type = 'memo' } = props
  const { name, tabCardList, color, status } = listData

  const [tabs, setTabs] = useState<TabType[]>(
    tabCardList?.map((tab) => ({ ...tab, prefixId: tab.id || `${new Date().getTime()}` })),
  )

  const [nameData, setNameData] = useState<string>(name)
  const [colorData, setColorData] = useState<string>(color)
  const [pinnedData, setPinnedData] = useState<boolean>(status === 2)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [tagLists, setTagList] = useState<Tag[]>([])

  const [selectedTabIndex, setSelectedTabIndex] = useState<string | undefined>(tabs[0].prefixId)
  const [selectedEditTab, setSelectedEditTab] = useState<string | undefined>(undefined)

  const tabIdx = tabs.findIndex((it) => it.prefixId === selectedTabIndex)
  const editTabIdx = tabs.findIndex((it) => it.prefixId === selectedEditTab)

  const [editMode, setEditMode] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isOpenDialogTag, setOpenDialogTag] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const confirm = useConfirm()
  const dispatch = useDispatch()

  const onSubmit = (data: TabType) => {
    setTabs((prevTabs) => [...prevTabs, data])
    setDialogOpen(false)
  }

  const updateTabsContent = (data: string) => {
    if (editTabIdx !== -1) {
      const updatedTabs = [...tabs]
      updatedTabs[editTabIdx].tabContent = data
      setTabs(updatedTabs)
      setIsDirty(true)
    }
  }

  const updateTabsName = (data: string) => {
    if (editTabIdx !== -1) {
      const updatedTabs = [...tabs]
      updatedTabs[editTabIdx].tabName = data
      setTabs(updatedTabs)
      setIsDirty(true)
    }
  }

  const updateTabsColors = (data: string) => {
    if (editTabIdx !== -1 && editMode) {
      setColorData(data)
      setIsDirty(true)
    }
  }

  const updateMemoName = (value: string) => {
    setNameData(value)
    setIsDirty(true)
  }

  const handleEditModeToggle = () => {
    setSelectedEditTab(selectedTabIndex)
    setEditMode(true)
  }

  const handleTabChange = (newValue?: string) => {
    setSelectedTabIndex(newValue)
    if (editMode) {
      setSelectedEditTab(newValue)
    }
  }

  const handleDeleteTab = (_event: any, tabValue: number) => {
    _event.stopPropagation()
    if (editTabIdx !== -1) {
      const updatedTabs = [...tabs]
      updatedTabs.splice(tabValue, 1)
      setTabs(updatedTabs)
      setIsDirty(true)
    }
  }

  const handleAddButtonClick = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleMoreOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleClickCancel = async () => {
    if (
      isDirty &&
      !(await confirm({ title: 'Confirm', message: 'Are you sure? Your new data will be lost!' }))
    ) {
      return
    }
    setEditMode(false)
    setNameData(listData.name)
    setTabs(tabCardList?.map((tab) => ({ ...tab, prefixId: tab.id || `${new Date().getTime()}` })))
    setSelectedEditTab(undefined)
    setSelectedTabIndex(tabs[0]?.prefixId)
  }

  const colorStyle = {
    backgroundColor: `${colorData}80`,
    color: ColorUtils.getContrastingColor(colorData),
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const updatedTabs = Array.from(tabs)
    const [removed] = updatedTabs.splice(result.source.index, 1)
    updatedTabs.splice(result.destination.index, 0, removed)

    updatedTabs.forEach((tab, index) => {
      tab.position = index
    })

    setTabs(updatedTabs)
  }

  const handleClickSave = async () => {
    const { type, id } = listData
    const newData: MemoInput = {
      color: colorData,
      status: pinnedData ? 2 : 1,
      type,
      id,
      name: nameData,
      tabCardList: tabs.map((tab) => {
        const { id, tabContent, position, tabName } = tab
        return { id, tabContent, position, tabName }
      }),
    }

    if (listData.id) {
      await updateMemo(listData.id, newData)
      dispatch(memoStore.actions.setLoadingStatus('NotLoad'))
    }
  }

  const handleClickDelete = async () => {
    if (listData.id) {
      await deleteMemo(listData.id)
      dispatch(memoStore.actions.setLoadingStatus('NotLoad'))
    }
  }

  const updatePinned = async () => {
    const newPin = !pinnedData
    if (editMode) {
      setPinnedData(newPin)
      setIsDirty(true)
    } else if (listData.id) {
      await changeStatus(listData.id, newPin ? 2 : 1)
      dispatch(memoStore.actions.setLoadingStatus('NotLoad'))
    }
  }

  const openTagListDialog = () => {
    setOpenDialogTag(true)
  }

  const closeTagListDialog = () => {
    setOpenDialogTag(false)
  }

  return (
    <StyledGrid
      item
      xs={type === 'memo' ? 6 : 12}
      $colorData={colorData}
      $editMode={editMode}
      $type={type}
    >
      {isOpenDialogTag && (
        <TagList
          currentTags={tagLists}
          handleClose={closeTagListDialog}
          setCurrentTags={setTagList}
          type='study'
        />
      )}
      <Box
        className='containe-box'
        sx={{
          ...colorStyle,
        }}
      >
        <Box className='header-bar'>
          {pinnedData && <BsPinAngleFill />}
          {editMode ? (
            <TextInput
              variant='standard'
              type={type === 'memo' ? 'text' : 'textarea'}
              fullWidth
              value={nameData}
              rowsMax={4}
              id='name'
              name='name'
              error={!nameData}
              errorMessage={nameData ? undefined : 'This field is required!'}
              onChange={updateMemoName}
              required
            />
          ) : (
            <span className='name-memo'>{name}</span>
          )}
        </Box>
        <IconButton size='small' onClick={handleMoreOptionsClick}>
          <MoreHorizOutlined />
        </IconButton>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={updatePinned} style={{ width: '100px' }}>
            {!pinnedData ? 'Pin' : 'Unpin'}
          </MenuItem>
          {!editMode && <MenuItem onClick={handleEditModeToggle}>Edit</MenuItem>}
          {editMode && <MenuItem onClick={handleClickSave}>Save</MenuItem>}
          {editMode && <MenuItem onClick={handleClickCancel}>Cancel</MenuItem>}
          <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
        </Menu>
      </Box>
      <Box className='tag-container'>
        {tagLists.map((tag) => (
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
            <Chip
              className='tag-icon'
              size='small'
              label={tag.name}
              sx={{ backgroundColor: tag.color || 'white' }}
            />
          </Tooltip>
        ))}
        <Chip
          color='warning'
          size='small'
          label='Add Tag'
          icon={<AddCircleOutline />}
          onClick={openTagListDialog}
        />
      </Box>
      <Box className='tab-container'>
        {type === 'study' && (
          <Box alignItems='center'>
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId='tabs' direction='horizontal'>
                {(provided) => (
                  <StyledDraggable ref={provided.innerRef} {...provided.droppableProps}>
                    <Tabs
                      className='tab-item'
                      value={tabIdx}
                      orientation='vertical'
                      indicatorColor='primary'
                      textColor='primary'
                      // onChange={handleTabChange}
                      style={{
                        ...colorStyle,
                      }}
                    >
                      {tabs.map((tab, index) => {
                        const isSelected = index === tabIdx
                        const isTooltip = tab.tabName?.length > 9
                        const id = tab.prefixId
                        return (
                          <Draggable key={id} isDragDisabled={false} draggableId={id} index={index}>
                            {(innerProvided) => (
                              <Box
                                ref={innerProvided.innerRef}
                                {...innerProvided.draggableProps}
                                {...innerProvided.dragHandleProps}
                                className='drag-item'
                                sx={{
                                  backgroundColor: isSelected ? colorData : undefined,
                                  '& .MuiTab-root': {
                                    paddingRight: editMode ? '0px' : undefined,
                                    paddingLeft: editMode ? '5px' : undefined,
                                  },
                                }}
                                onClick={() => handleTabChange(tab.prefixId)}
                              >
                                {editMode && <DragIndicator className='indicator' />}
                                <Tab
                                  id={`${index}-tab`}
                                  label={
                                    <Box className='tab-idx'>
                                      {editMode ? (
                                        <TextField
                                          variant='standard'
                                          fullWidth
                                          value={tab.tabName}
                                          id='tabName'
                                          name='tabName'
                                          onMouseDown={(e) => e.stopPropagation()}
                                          onChange={(e) => updateTabsName(e.target?.value)}
                                          inputProps={{ maxLength: 25 }}
                                          required
                                        />
                                      ) : (
                                        <Tooltip
                                          title={isTooltip ? tab.tabName : ''}
                                          placement='right'
                                        >
                                          <span className='tab-tabname'>{tab.tabName}</span>
                                        </Tooltip>
                                      )}
                                      &nbsp;
                                      {tabs.length > 1 && editMode && (
                                        <CloseSharp
                                          style={{ height: '20px' }}
                                          onClick={(e) => handleDeleteTab(e, index)}
                                        />
                                      )}
                                    </Box>
                                  }
                                  style={{
                                    color: isSelected ? 'white' : 'black',
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                  }}
                                  className='tab-component'
                                />
                              </Box>
                            )}
                          </Draggable>
                        )
                      })}
                      {tabs?.length <= 10 && editMode && (
                        <Button
                          onClick={handleAddButtonClick}
                          sx={{ ...colorStyle, marginTop: '5px' }}
                        >
                          <Add />
                        </Button>
                      )}

                      {provided.placeholder}
                    </Tabs>
                  </StyledDraggable>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          </Box>
        )}
        {tabs.map((tab, index) => {
          return (
            <Box
              className='sun-editor-container'
              key={tab.prefixId}
              display={index === tabIdx ? undefined : 'none'}
              sx={{
                ...colorStyle,
              }}
            >
              <Box className='sun-editor-item'>
                <SunEditor
                  name='tab-content'
                  onChange={updateTabsContent}
                  setContents={tab.tabContent}
                  // readOnly={!editMode}
                  height='410px'
                />
              </Box>
              {editMode && (
                <Box className='color-palette'>
                  <ColorPalleter onChange={updateTabsColors} value={colorData} />
                </Box>
              )}
            </Box>
          )
        })}
        {isDialogOpen && (
          <AddEditDialog
            handleDialogClose={handleDialogClose}
            handleSubmit={onSubmit}
            tabs={tabs}
            mode='tab'
          />
        )}
      </Box>
    </StyledGrid>
  )
}

export default Memo
