import { CssBaseline, createTheme } from '@mui/material'
// import MuiThemeProvider from '@mui/material/styles/ThemeProvider'
import { ThemeProvider as StyledThemeProvider } from '@mui/material/styles'
import SnackbarProvider from './SnackbarProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import ColorUtils from '@app/helpers/ColorUtils'

export const BreakPointsXS = 0
export const BreakPointsSM = 760
export const BreakPointsMD = 960
export const BreakPointsLG = 1280
export const BreakPointsXL = 1920

export const SelectedColor = 'rgb(33, 150, 243)'

export const baseColorLight = {
  primary: '#111827',
  secondary: '#202020',
  tertiary: '#404040',
  fieldLabel: '#404040de',
}

export const baseColorDark = {
  primary: '#FFFFFF',
  secondary: '#121212',
  tertiary: '#080808',
  fieldLabel: '#FFFFFFde',
}

export const baseFontColors = (darkMode?: boolean) => {
  return darkMode ? baseColorLight : baseColorDark
}

export const CustomTheme = (darkMode: boolean) => {
  const baseFontColors = darkMode ? baseColorLight : baseColorDark

  return {
    palette: {
      primary: {
        main: baseFontColors.primary,
      },
      secondary: {
        main: baseFontColors.secondary,
      },
      error: {
        main: '#f58484',
      },
      action: {
        disabled: '#7a7a7a',
        disabledBackground: '#e5e5e5',
      },
      background: {
        default: baseFontColors.secondary,
      },
      text: {
        primary: baseFontColors.primary,
        secondary: baseFontColors.secondary,
        tertiary: baseFontColors.tertiary,
        fieldLabel: baseFontColors.fieldLabel,
      },
    },
    typography: {
      button: {
        fontSize: '0.813rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            color: ColorUtils.getContrastingColor(baseFontColors.primary),
          },
          outlined: {
            color: ColorUtils.getContrastingColor(baseFontColors.primary),
            borderColor: ColorUtils.getContrastingColor(baseFontColors.primary),
            '&:hover': {
              color: '#0d2b45',
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: baseFontColors.primary,
              color: 'yellow',
              '&:hover': {
                backgroundColor: '#0d2b45',
              },
            },
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: baseFontColors.primary,
            color: ColorUtils.getContrastingColor(baseFontColors.primary),
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: BreakPointsXS,
        sm: BreakPointsSM,
        md: BreakPointsMD,
        lg: BreakPointsLG,
        xl: BreakPointsXL,
      },
    },
  }
}

export type CustomThemeType = typeof CustomTheme

type Props = {
  children?: React.ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children }: Props) => {
  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const muiTheme = createTheme(CustomTheme(darkMode))

  return (
    <StyledThemeProvider theme={muiTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
      </SnackbarProvider>
    </StyledThemeProvider>
  )
}

export default ThemeProvider
