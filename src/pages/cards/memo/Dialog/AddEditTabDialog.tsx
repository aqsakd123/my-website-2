import React, { useState } from 'react'
import TextInput from '@app/components/common/TextInputField/TextInput'
import useSnackbar from '@app/config/useSnackbar'
import Dialog, { DialogActions, DialogContent } from '@app/components/common/Dialog/Dialog'
import Button from '@mui/material/Button/Button'
import { TabDataInput } from '@app/api/memo/memo-type'

type TabType = TabDataInput & {
  prefixId: string
}

type Props = {
  handleDialogClose: () => void
  handleSubmit: (data: TabType) => void
  tabs?: TabDataInput[]
  mode?: 'tab' | 'memo' | 'study'
}

const AddEditDialog: React.FC<Props> = (props: Props) => {
  const { handleDialogClose, handleSubmit, tabs, mode } = props

  const [tabName, setTabName] = useState('')

  const snackbar = useSnackbar()

  const handleTabNameChange = (value: string) => {
    setTabName(value)
  }

  const onSubmit = () => {
    if (mode === 'tab' && tabs && tabs.map((item) => item.tabName).includes(tabName)) {
      snackbar.snackbarError('Duplicate Tab Name!')
      return
    }
    if (tabName) {
      // @ts-ignore
      const newTab: TabData = {
        prefixId: mode === 'tab' ? Date.now().toString() : undefined,
        tabName,
      }
      handleSubmit(newTab)
    }
  }

  return (
    <Dialog
      open
      onClickReturn={handleDialogClose}
      title={mode !== 'tab' ? 'Add new note' : 'Add a Tab'}
    >
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <TextInput
            label={mode === 'tab' ? 'Tab Name' : 'New Note Name'}
            variant='filled'
            fullWidth
            value={tabName}
            onChange={handleTabNameChange}
            id='tabName'
            name='tabName'
            maxLength={25}
            required
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color='primary'>
          Cancel
        </Button>
        <Button variant='contained' color='primary' onClick={onSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditDialog
