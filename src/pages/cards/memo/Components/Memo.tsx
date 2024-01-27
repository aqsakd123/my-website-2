import React, { useState } from 'react'
import { Box, Tab, Tabs, IconButton, Menu, MenuItem, Grid, TextField, Tooltip } from '@mui/material'
import { Add, CloseSharp, DragIndicator, MoreHorizOutlined } from '@mui/icons-material'
import AddEditDialog from '../Dialog/AddEditDialog'
import TextInput from '@app/components/common/TextInputField/TextInput'
import useConfirm from '@app/components/common/ConfirmDialog/useConfirm'
import ColorPalleter from './ColorPallete'
import ColorUtils from '@app/helpers/ColorUtils'
import { BsPinAngleFill } from 'react-icons/bs'
import QuillEditor from '@app/components/common/QuillEditor/QuillEditor'
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import { StrictModeDroppable } from '@app/components/common/StrictModeDroppable/StrictModeDroppable'
import { MemoInput, TabDataInput } from '@app/api/memo/memo-type'
import { changeStatus, deleteMemo, updateMemo } from '@app/api/memo/memo-api'
import { useDispatch } from 'react-redux'
import memoStore from '@app/store/memoStore/MemoStore'

type Props = {
  listData: MemoInput
  type: 'memo' | 'study'
}

type TabType = TabDataInput & {
  prefixId: string
}

const TAB_BACKGROUND_COLOR = '#8680dc'

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

  const [selectedTabIndex, setSelectedTabIndex] = useState<string | undefined>(tabs[0].prefixId)
  const [selectedEditTab, setSelectedEditTab] = useState<string | undefined>(undefined)

  const tabIdx = tabs.findIndex((it) => it.prefixId === selectedTabIndex)
  const editTabIdx = tabs.findIndex((it) => it.prefixId === selectedEditTab)

  const [editMode, setEditMode] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)
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

  return (
    <Grid item xs={type === 'memo' ? 6 : 12}>
      <Box
        sx={{
          ...colorStyle,
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 600,
          borderRadius: '10px',
          fontSize: '16px',
          marginBottom: '20px',
          padding: '0px 8px',
          alignItems: 'center',
          '& .MuiInputBase-input': {
            color: ColorUtils.getContrastingColor(colorData),
          },
        }}
      >
        <Box display='flex' alignItems='center' gap='10px' sx={{ width: '100%', padding: '5px' }}>
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
            <span style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{name}</span>
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
      <Box style={{ borderRadius: '20px' }}>
        {type === 'study' && (
          <Box display='flex' alignItems='center'>
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId='tabs' direction='horizontal'>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    <Tabs
                      value={tabIdx}
                      indicatorColor='primary'
                      textColor='primary'
                      // onChange={handleTabChange}
                      style={{
                        borderRadius: '20px 20px 0px 0px',
                        backgroundColor: TAB_BACKGROUND_COLOR,
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
                                sx={{
                                  backgroundColor: isSelected ? colorData : undefined,
                                  display: 'flex',
                                  alignItems: 'center',
                                  '& .MuiTab-root': {
                                    paddingRight: editMode ? '0px' : undefined,
                                    paddingLeft: editMode ? '5px' : undefined,
                                  },
                                }}
                              >
                                {editMode && (
                                  <DragIndicator
                                    style={{
                                      color: ColorUtils.getContrastingColor(
                                        isSelected ? colorData : TAB_BACKGROUND_COLOR,
                                      ),
                                    }}
                                  />
                                )}
                                <Tab
                                  id={`${index}-tab`}
                                  onClick={() => handleTabChange(tab.prefixId)}
                                  label={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: ColorUtils.getContrastingColor(colorData),
                                        '& .MuiInputBase-input': {
                                          color: ColorUtils.getContrastingColor(colorData),
                                        },
                                      }}
                                    >
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
                                        <Tooltip title={isTooltip ? tab.tabName : ''}>
                                          <span
                                            style={{
                                              whiteSpace: 'nowrap',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              maxWidth: '80px',
                                            }}
                                          >
                                            {tab.tabName}
                                          </span>
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
                                    minWidth: '50px',
                                    maxWidth: '150px',
                                    borderRadius: isSelected ? '20px 20px 0px 0px' : undefined,
                                    color: isSelected ? 'white' : 'black',
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                  }}
                                />
                              </Box>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </Tabs>
                  </Box>
                )}
              </StrictModeDroppable>
            </DragDropContext>

            {tabs?.length <= 5 && editMode && (
              <IconButton onClick={handleAddButtonClick} sx={{ ...colorStyle, marginLeft: '10px' }}>
                <Add />
              </IconButton>
            )}
          </Box>
        )}
        {tabs.map((tab, index) => {
          const txtColor = ColorUtils.getContrastingColor(colorData)
          return (
            <Box
              key={tab.prefixId}
              display={index === tabIdx ? undefined : 'none'}
              sx={{
                ...colorStyle,
                borderRadius: type === 'memo' ? '20px' : '0px 20px 20px 20px',
                height: type === 'memo' ? '300px' : '500px',
                overflow: 'auto',
                '.ql-formats': {
                  'button, span': {
                    color: txtColor,
                    svg: {
                      '.ql-fill': {
                        fill: txtColor,
                      },
                      '.ql-stroke': {
                        stroke: txtColor,
                        color: txtColor,
                      },
                    },
                  },
                },
              }}
            >
              <Box
                sx={{
                  height: 'calc(100% - 30px)',
                  '& .MuiInputBase-input': {
                    color: ColorUtils.getContrastingColor(colorData),
                    fontWeight: 100,
                  },
                  '& .MuiInputBase-root': {
                    borderRadius: type === 'memo' ? '20px 20px 0px 0px' : '0px 20px 0px 0px',
                  },
                }}
              >
                <QuillEditor
                  handleChange={updateTabsContent}
                  value={tab.tabContent}
                  readOnly={!editMode}
                  modules={
                    type === 'memo'
                      ? {
                          toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ color: [] }, { background: [] }],
                            [{ font: [] }],
                            [{ align: [] }],
                          ],
                        }
                      : undefined
                  }
                />
              </Box>
              <Box
                sx={{ marginLeft: '15px', height: '30px', display: 'flex', alignItems: 'center' }}
              >
                <ColorPalleter onChange={updateTabsColors} value={colorData} />
              </Box>
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
    </Grid>
  )
}

export default Memo
