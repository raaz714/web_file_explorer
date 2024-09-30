import { useEffect, useState } from 'react'
import Header from './Header'
import MainGrid from './MainGrid'
import GlobalFrame from './GlobalFrame'
import PathContextProvider from '../contexts/PathContext'
import SelectedFilesContextProvider from '../contexts/SelectedFilesContext'
import InputFileUpload from './UploadPane'
import ViewContextProvider from '../contexts/ViewContext'

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
    <div className='flex flex-col w-full items-center mx-auto pb-10 max-w-[90%] xl:max-w-[1700px] min-h-[400px] md:min-h-[1200px]'>
      <InputFileUpload />
      <Header />
      <MainGrid />
    </div>
  )
}

export default AppView
