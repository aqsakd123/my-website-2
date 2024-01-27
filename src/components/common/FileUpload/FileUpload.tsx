import { MAXIMUM_FILE_SIZE } from '@app/common/Contants'
import { ReactNode } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Button from '@mui/material/Button'

type Props = {
  maximum?: number
  variant?: 'outlined' | 'contained'
  fileTypes?: string
  onHandleChange?: (value: File) => void
  title?: string
  icon?: ReactNode
}

const FileUpload = (props: Props) => {
  const {
    maximum = MAXIMUM_FILE_SIZE,
    onHandleChange,
    fileTypes,
    variant = 'contained',
    title = 'Upload',
    icon,
  } = props

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0]
    if (selectedFile && selectedFile?.size > maximum * 1024) {
      alert(`File too large.`)
      return
    }

    if (selectedFile && onHandleChange) {
      onHandleChange(selectedFile)
    }
  }

  return (
    <div>
      <input
        type='file'
        accept={fileTypes}
        style={{ display: 'none' }}
        id='contained-button-file'
        onChange={handleFileChange}
      />
      <label htmlFor='contained-button-file'>
        <Button variant={variant} component='span' startIcon={icon ? icon : <UploadFileIcon />}>
          {title}
        </Button>
      </label>
    </div>
  )
}

export default FileUpload
