import { Control, Controller } from 'react-hook-form'
import { styled } from 'styled-components'
import Editor from 'suneditor-react'
import { SunEditorReactProps } from 'suneditor-react/dist/types/SunEditorReactProps'
import 'suneditor/dist/css/suneditor.min.css' // Import SunEditor CSS

export interface MyEditorProps extends SunEditorReactProps {
  name: string
  control?: Control
  height?: string
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
const EditorContainer = styled.div<{ $height: string }>`
  display: flex;
  flex-direction: column;

  .se-container {
    display: flex;
    flex-direction: column;
    height: ${({ $height }) => `${$height}`};
    .se-toolbar {
      flex: 0;
    }
  }
`

const SunEditor = (props: MyEditorProps) => {
  const { control, name, onChange, height = '400px', ...rest } = props

  if (control) {
    return (
      <Controller
        render={({ field: { onChange: handleChangeRender, value } }) => (
          <EditorContainer $height={height}>
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
    <EditorContainer $height={height}>
      <Editor {...rest} lang='en' onChange={onChange} setOptions={options} />
    </EditorContainer>
  )
}

export default SunEditor
