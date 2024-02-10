import React from 'react'
import { useEffect } from 'react'
import { Control, Controller } from 'react-hook-form'
import { styled } from 'styled-components'
import Editor from 'suneditor-react'
import { SunEditorReactProps } from 'suneditor-react/dist/types/SunEditorReactProps'
import 'suneditor/dist/css/suneditor.min.css' // Import SunEditor CSS

interface MyEditorProps extends SunEditorReactProps {
  name: string
  control?: Control
}

const options = {
  buttonList: [
    ['undo', 'redo'],
    ['font', 'fontSize', 'formatBlock'],
    ['paragraphStyle', 'blockquote'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor'],
    ['removeFormat'],
    ['outdent', 'indent'],
    ['align', 'horizontalRule', 'list', 'lineHeight'],
    ['table', 'link', 'image', 'video'],
    ['fullScreen', 'showBlocks', 'codeView'],
  ],
  minHeight: '100%',
  maxHeight: '100%',
  defaultTag: 'div',
  showPathLabel: false,
}
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const SunEditor = (props: MyEditorProps) => {
  const { control, name, onChange, ...rest } = props
  const [sunEditor, setSuneditor] = React.useState<any>(null)
  const editableElement = document.querySelector('.sun-editor-editable')

  useEffect(() => {
    if (sunEditor) {
      console.log(editableElement)
    }
  }, [sunEditor])

  if (control) {
    return (
      <Controller
        render={({ field: { onChange: handleChangeRender, value } }) => (
          <EditorContainer>
            <Editor
              {...rest}
              lang='en'
              setContents={value}
              onChange={(v) => {
                handleChangeRender(v)
                if (onChange) {
                  onChange(v)
                }
                return v
              }}
              setOptions={options}
            />
          </EditorContainer>
        )}
        control={control}
        name={name}
      />
    )
  }

  return (
    <EditorContainer>
      <Editor
        getSunEditorInstance={setSuneditor}
        {...rest}
        lang='en'
        onChange={onChange}
        setOptions={options}
      />
    </EditorContainer>
  )
}

export default SunEditor
