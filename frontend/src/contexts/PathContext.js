import { createContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchFolder, fetchFromPath } from '../utils/apiUtils'

export const PathContext = createContext()

const PathContextProvider = (props) => {
  const [rows, setRows] = useState([])
  const [fileInfo, setFileInfo] = useState(null)
  const { pathname } = useLocation()

  const handleFolder = () => {
    const fetchFolderPromise = fetchFolder(pathname)
    fetchFolderPromise
      .then((response) => {
        setFileInfo(null)
        setRows(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleFile = (fetchPath, contentType) => {
    setRows([])
    setFileInfo({ fileUrl: fetchPath, fileType: contentType })
  }

  const fetchRowsFromLocation = () => {
    const fetchFromPathPromise = fetchFromPath(pathname)
    fetchFromPathPromise
      .then((response) => {
        const isDir = response.headers.get('Isdir')
        const contentType = response.headers.get('content-type')

        if (isDir) {
          handleFolder()
        } else {
          handleFile('/_api/' + (pathname || ''), contentType)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    fetchRowsFromLocation()
  }, [pathname])

  const fetchSearchResults = (query, limit = 10) => {
    if (query.length < 3) {
      fetchRowsFromLocation()
      return
    }
    const fetchSearchResultsPromise = fetchSearchResults(query, limit, pathname)
    fetchSearchResultsPromise
      .then((response) => {
        setFileInfo(null)
        setRows(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <PathContext.Provider
      value={{ rows, fileInfo, fetchRowsFromLocation, fetchSearchResults }}
    >
      {props.children}
    </PathContext.Provider>
  )
}

export default PathContextProvider
