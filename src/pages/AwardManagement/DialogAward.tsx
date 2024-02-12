import React from 'react'
import Dialog, { DialogContent } from '@app/components/common/Dialog/Dialog'
import AwardList from './AwardList'

type FormProps = {
  onReturn: () => void
}

const DialogAward: React.FC<FormProps> = (props: FormProps) => {
  const { onReturn } = props

  return (
    <Dialog
      open
      title={'Award Management'}
      onClickReturn={onReturn}
      fullWidth
      selfContentAndActions
    >
      <DialogContent>
        <AwardList />
      </DialogContent>
    </Dialog>
  )
}

export default DialogAward
