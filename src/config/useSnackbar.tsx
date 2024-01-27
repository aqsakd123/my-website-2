import { CloseOutlined } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import { useSnackbar as useNotistackSnackbar } from 'notistack'

export const useSnackbar = () => {
  const snackbar = useNotistackSnackbar()

  const snackbarSuccess = (message: string) => {
    snackbar.enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      style: {
        color: 'rgba(255, 255, 255, 1)',
        backgroundColor: 'rgba(1, 87, 155, 1)',
      },
      action: (key) => (
        <IconButton
          size='small'
          aria-label='close'
          color='inherit'
          onClick={() => snackbar.closeSnackbar(key)}
        >
          <CloseOutlined fontSize='small' />
        </IconButton>
      ),
    })
  }

  const snackbarError = (message: string) => {
    snackbar.enqueueSnackbar(message, {
      variant: 'error',
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      style: {
        color: 'rgba(198, 40, 40, 1)',
        backgroundColor: '#FEEBEE',
      },
      action: (key) => (
        <IconButton
          size='small'
          aria-label='close'
          color='inherit'
          onClick={() => snackbar.closeSnackbar(key)}
        >
          <CloseOutlined fontSize='small' />
        </IconButton>
      ),
    })
  }

  // const { snackbarSuccess, snackbarError } = useSnackbar()
  // snackbarSuccess('Succes')
  // snackbarError('Error')
  return {
    snackbarSuccess,
    snackbarError,
  }
}

export default useSnackbar
