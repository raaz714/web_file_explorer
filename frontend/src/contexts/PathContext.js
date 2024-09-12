import { createContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const PathContext = createContext()

const PathContextProvider = (props) => {
  const [rows, setRows] = useState([])
  const [fileInfo, setFileInfo] = useState(null)
  const { pathname } = useLocation()

  const fetchRowsFromLocation = () => {
    const fetchPath = 'http://localhost:9876/_api/' + (pathname || '')
    fetch(fetchPath)
      .then((res) => {
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return res.json().then((data) => {
            setFileInfo(null)
            setRows(data)
          })
        } else {
          setRows([])
          setFileInfo({ fileUrl: fetchPath, fileType: contentType })
        }
      })
      .catch((e) => {
        console.log(e)
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
    const fetchPath = `http://localhost:9876/search?q=${query}&limit=${limit}&dir=${pathname}`

    fetch(fetchPath)
      .then((res) => {
        return res.json().then((data) => {
          const formattedData = data.map((r) => {
            return { ...r.FileInfo }
          })
          setFileInfo(null)
          setRows(formattedData)
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <PathContext.Provider value={{ rows, fileInfo, fetchSearchResults }}>
      {props.children}
    </PathContext.Provider>
  )
}

export default PathContextProvider
