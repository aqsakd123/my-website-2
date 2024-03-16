import React, { ReactNode } from 'react'

import styled from 'styled-components'

import { Close } from '@mui/icons-material'
import { DialogTitle, Typography, IconButton, Dialog as MuiDialog, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

import MuiDialogContent, {
  DialogContentProps as MuiDialogContentProps,
} from '@mui/material/DialogContent'
import MuiDialogActions, {
  DialogActionsProps as MuiDialogActionsProps,
} from '@mui/material/DialogActions'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store/store'

const EditTypeDialogTitleContainer = styled.div`
  margin: 14px 14px 0 14px;
  padding: 13px 13px 13px 1em;
  border-radius: 10px;
`

const EditTypeDialogTitle = styled.div`
  border-left: 3px #ffffff solid;
  padding-left: 1em;
  line-height: 1em;
  font-size: large;
`

const SimpleTypeDialogTitle = styled(DialogTitle)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 2px 2px 18px;
`

const SimpleTypeDialogTitleText = styled(Typography)`
  flex-grow: 1;
` as typeof Typography

const StyledDialogHeadContent = styled.div<{ $display?: boolean }>`
  padding-top: 1em;
  padding-right: 15px;
  padding-left: 15px;
  ${({ $display }) => ($display === undefined || $display ? '' : 'display: none;')}
`

type ContentProps = React.PropsWithChildren<{ display?: boolean }>

export const DialogHeadContent: React.FC<ContentProps> = ({ display, children }: ContentProps) => {
  return <StyledDialogHeadContent $display={display}>{children}</StyledDialogHeadContent>
}

type DialogContentProps = MuiDialogContentProps & { display?: boolean }

const StyledMUIDialogContent = styled(MuiDialogContent)`
  padding: 20px !important;
`

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  ...others
}: ContentProps) => {
  return <StyledMUIDialogContent {...others}>{children}</StyledMUIDialogContent>
}

type DialogActionsProps = MuiDialogActionsProps & { display?: boolean }

export const DialogActions: React.FC<DialogActionsProps> = ({
  children,
  ...others
}: DialogActionsProps) => {
  const darkMode = useSelector((state: RootState) => state.commonStore.darkMode)

  return (
    <MuiDialogActions
      {...others}
      style={{
        borderTop: darkMode
          ? '1px solid rgba(255, 255, 255, 0.12)'
          : '1px solid rgba(0, 0, 0, 0.12)',
        padding: '12px 21px',
      }}
    >
      {children}
    </MuiDialogActions>
  )
}

type Props = {
  children: React.ReactNode
  open: boolean
  title: string
  fullWidth?: boolean
  fullHeight?: boolean
  maxWidth?: 'md' | 'lg' | 'xl'
  onClickReturn: () => void
  actions?: ReactNode
  selfContentAndActions?: boolean
  minHeight?: number
  keepMounted?: boolean
  className?: string
  width?: string
  height?: string
}

const EditDialogTransition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
  // @ts-ignore
  return <Slide direction='up' ref={ref} {...props} />
})

export const FullScreenDialogBreakPoints = 'sm'

type SimpleDialogTitleProps = {
  title: string
  onClickReturn: () => void
}

const SimpleDialogTitle: React.FC<SimpleDialogTitleProps> = ({
  title,
  onClickReturn,
}: SimpleDialogTitleProps) => {
  const darkMode = useSelector((state: RootState) => state.commonStore.darkMode)

  const handleClickReturn = () => {
    onClickReturn()
  }

  return (
    <SimpleTypeDialogTitle
      style={{
        borderBottom: darkMode
          ? '1px solid rgba(255, 255, 255, 0.12)'
          : '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <SimpleTypeDialogTitleText data-testid='dialog-title'>{title}</SimpleTypeDialogTitleText>
      <IconButton onClick={handleClickReturn} data-testid='CloseButton'>
        <Close />
      </IconButton>
    </SimpleTypeDialogTitle>
  )
}

const StyledMuiDialog = styled(MuiDialog)<{
  $fullHeight?: boolean
  $minHeight?: number
  $width?: string
  $height?: string
}>`
  height: auto;
  padding: 0px;
  & .MuiDialog-paperScrollPaper {
    border-radius: 20px;
    ${({ $fullHeight, $minHeight }) =>
      $fullHeight
        ? 'min-height: calc(100vh - 64px);'
        : $minHeight
        ? `min-height: ${$minHeight}px`
        : ''}
    ${({ $width }) => ($width ? `width: ${$width};` : '')}
    ${({ $height }) => ($height ? `height: ${$height};` : 'height: auto;')}
  }
`

const Dialog: React.FC<Props> = ({
  children,
  open,
  className,
  onClickReturn,
  title,
  actions,
  fullWidth = true,
  maxWidth = 'md',
  width,
  height,
  fullHeight = false,
  selfContentAndActions = true,
  minHeight,
  keepMounted = false,
}: Props) => {
  const isSimple = true
  // const isMediaQueryFullScreen = useMediaQuery((theme: Theme) =>
  //   theme.breakpoints.down(FullScreenDialogBreakPoints),
  // )

  const fullScreen = false

  return (
    <StyledMuiDialog
      open={open}
      className={className}
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      $fullHeight={fullScreen ? undefined : fullHeight}
      $minHeight={minHeight}
      $width={width}
      $height={fullScreen ? undefined : height}
      onClose={onClickReturn}
      fullWidth={fullWidth}
      disableEscapeKeyDown
      TransitionComponent={!isSimple ? EditDialogTransition : undefined}
      keepMounted={keepMounted}
      data-testid='dialog'
    >
      {isSimple ? (
        <SimpleDialogTitle title={title} onClickReturn={onClickReturn} />
      ) : (
        <>
          <EditTypeDialogTitleContainer>
            <EditTypeDialogTitle data-testid='dialog-title'>{title}</EditTypeDialogTitle>
          </EditTypeDialogTitleContainer>
        </>
      )}
      {selfContentAndActions || fullScreen ? (
        children
      ) : (
        <>
          <DialogContent>{children}</DialogContent>
          {actions && <DialogActions>{actions}</DialogActions>}
        </>
      )}
    </StyledMuiDialog>
  )
}

export default Dialog
