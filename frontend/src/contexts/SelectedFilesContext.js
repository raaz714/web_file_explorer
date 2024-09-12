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

  const executePaste = () => {
    const url = 'http://localhost:9876/_execute/' + (isCut ? 'cut' : 'copy')
    console.log('raaz : ', url, isCut)
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
        console.log(response.data)
        setPastable([])
        setIsCut(false)
      })
      .catch(function (error) {
        console.error(error)
        setPastable([])
        setIsCut(false)
      })
  }

  const executeRemove = () => {
    const options = {
      method: 'POST',
      url: 'http://localhost:9876/_execute/remove',
      headers: { 'Content-Type': 'application/json' },
      data: { filepaths: selectedFiles },
    }

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data)

        setSelectedFiles([])
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
