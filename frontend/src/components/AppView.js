import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Header from './Header'
import MainGrid from './MainGrid'
import SideMenu from './SideMenu'
import GlobalFrame from './GlobalFrame'
import PathContextProvider from '../contexts/PathContext'
import SelectedFilesContextProvider from '../contexts/SelectedFilesContext'
import InputFileUpload from './UploadPane'
import ViewContextProvider from '../contexts/ViewContext'
import { alpha } from '@mui/material'

const AppView = () => {
  const [mode, setMode] = useState('light')

  // This code only runs on the client side, to determine the system color preference
  useEffect(() => {
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

  return (
    <GlobalFrame mode={mode} toggleColorMode={toggleColorMode}>
      <PathContextProvider>
        <SelectedFilesContextProvider>
          <ViewContextProvider>
            <AppViewHelper />
          </ViewContextProvider>
        </SelectedFilesContextProvider>
      </PathContextProvider>
    </GlobalFrame>
  )
}

const AppViewHelper = () => {
  return (
    <>
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
    </>
  )
}

export default AppView
