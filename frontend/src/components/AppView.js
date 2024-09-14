import * as React from 'react'
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import getDashboardTheme from '../theme/getDashboardTheme'
import Header from './Header'
import MainGrid from './MainGrid'
import SideMenu from './SideMenu'
import GlobalFrame from './GlobalFrame'
import PathContextProvider from '../contexts/PathContext'
import SelectedFilesContextProvider from '../contexts/SelectedFilesContext'
import InputFileUpload from './UploadPane'
import ViewContextProvider from '../contexts/ViewContext'

const AppView = () => {
  const [mode, setMode] = React.useState('light')
  const [showCustomTheme, setShowCustomTheme] = React.useState(true)
  const dashboardTheme = createTheme(getDashboardTheme(mode))
  const defaultTheme = createTheme({ palette: { mode } })
  // This code only runs on the client side, to determine the system color preference
  React.useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem('themeMode')
    if (savedMode) {
      setMode(savedMode)
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      setMode(systemPrefersDark ? 'dark' : 'light')
    }
  }, [])

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark'
    setMode(newMode)
    localStorage.setItem('themeMode', newMode) // Save the selected mode to localStorage
  }

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev)
  }

  return (
    <GlobalFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={showCustomTheme ? dashboardTheme : defaultTheme}>
        <PathContextProvider>
          <SelectedFilesContextProvider>
            <ViewContextProvider>
              <CssBaseline enableColorScheme />
              <Box sx={{ display: 'flex' }}>
                <SideMenu />
                {/* <AppNavbar /> */}
                {/* Main content */}
                <Box
                  component='main'
                  sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                  })}
                >
                  <Stack
                    spacing={2}
                    sx={{
                      alignItems: 'center',
                      mx: 'auto',
                      pb: 10,
                      mt: { xs: 8, md: 2 },
                      maxWidth: { xs: '90%', xl: '1700px' },
                      minHeight: { xs: '400px', md: '1200px' },
                    }}
                  >
                    <InputFileUpload />
                    <Header />
                    <MainGrid />
                  </Stack>
                </Box>
              </Box>
            </ViewContextProvider>
          </SelectedFilesContextProvider>
        </PathContextProvider>
      </ThemeProvider>
    </GlobalFrame>
  )
}

export default AppView
