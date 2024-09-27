import axios from 'axios'
import { createContext, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const SelectedFilesContext = createContext()

const SelectedFilesContextProvider = (props) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [pastable, setPastable] = useState([])
  const [isCut, setIsCut] = useState(false)
  const { pathname } = useLocation()

  const stageToCopyOrCut = (cut = false) => {
    setPastable(selectedFiles)
    setIsCut(cut)
    setSelectedFiles([])
  }

  const executePaste = (callback = null) => {
    const url = '/_execute/' + (isCut ? 'cut' : 'copy')
    const options = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { destination: pathname, sources: pastable },
    }

    axios
      .request(options)
      .then(function (response) {
        setPastable([])
        setIsCut(false)
        callback && callback()
      })
      .catch(function (error) {
        console.error(error)
        setPastable([])
        setIsCut(false)
      })
  }

  const executeRemove = (callback = null) => {
    const options = {
      method: 'POST',
      url: '/_execute/remove',
      headers: { 'Content-Type': 'application/json' },
      data: { filepaths: selectedFiles },
    }

    axios
      .request(options)
      .then(function (response) {
        setSelectedFiles([])
        callback && callback()
      })
      .catch(function (error) {
        console.error(error)

        setSelectedFiles([])
      })
  }

  return (
    <SelectedFilesContext.Provider
      value={{
        selectedFiles,
        setSelectedFiles,
        pastable,
        stageToCopyOrCut,
        executePaste,
        executeRemove,
      }}
    >
      {props.children}
    </SelectedFilesContext.Provider>
  )
}

export default SelectedFilesContextProvider
