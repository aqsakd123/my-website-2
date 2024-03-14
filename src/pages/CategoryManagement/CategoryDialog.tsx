import React from 'react'
import Dialog from '@app/components/common/Dialog/Dialog'

import CategoryList, { Category } from './CategoryList'

type FormProps = {
  type: string
  onReturn: () => void
  setSelected: (value?: Category) => void
}

const CategoryDialog: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn, type, setSelected } = props

  return (
    <Dialog
      open
      title='Category Management'
      onClickReturn={onReturn}
      fullWidth
      selfContentAndActions
    >
      <CategoryList type={type} setSelected={setSelected} />
    </Dialog>
  )
}

export default CategoryDialog
