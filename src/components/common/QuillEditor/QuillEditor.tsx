import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface MyEditorProps {
  value?: string
  handleChange?: (value: string) => void
  readOnly?: boolean
  modules?: any
}

const defaultModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
  ],
}

const QuillEditor: React.FC<MyEditorProps> = (props: MyEditorProps) => {
  const { value, handleChange, readOnly, modules = defaultModules } = props

  const [content, setContent] = useState<string>(value || '')
  const quillRef = React.useRef()

  const handleEditorChange = (value: string) => {
    setContent(value)
  }

  useEffect(() => {
    if (handleChange) {
      handleChange(content)
    }
  }, [content])

  return (
    <Box
      sx={{
        height: '100%',
        '& .quill': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: readOnly ? '1px solid' : undefined,
        },
        '& .ql-toolbar': {
          flex: '0 0 auto',
          display: readOnly ? 'none' : undefined,
        },
        '& .ql-container': {
          flex: 1,
          overflow: 'auto',
        },
        '& .ql-syntax': {
          backgroundColor: '#3e155b !important',
          borderLeft: '5px solid #9f1212',
          borderRadius: '0px',
        },
      }}
    >
      {!readOnly ? (
        <ReactQuill
          theme='snow'
          value={content}
          onChange={handleEditorChange}
          readOnly={readOnly}
          modules={modules}
          // @ts-ignore
          ref={quillRef}
        />
      ) : (
        <Box
          sx={{
            padding: '8px',
            '& p': {
              margin: '5px 0px',
            },
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </Box>
  )
}

export default QuillEditor
