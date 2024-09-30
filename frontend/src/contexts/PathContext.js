import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const PathContext = createContext()

const PathContextProvider = (props) => {
  const [rows, setRows] = useState([])
  const [fileInfo, setFileInfo] = useState(null)
  const { pathname } = useLocation()

  const handleFolder = () => {
    const content_options = {
      method: 'GET',
      url: '/_api/' + (pathname || ''),
    }

    axios
      .request(content_options)
      .then(function (response) {
        // console.log(response.data)
        setFileInfo(null)
        setRows(response.data)
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  const handleFile = (fetchPath, contentType) => {
    setRows([])
    setFileInfo({ fileUrl: fetchPath, fileType: contentType })
  }

  const fetchRowsFromLocation = () => {
    const head_options = {
      method: 'HEAD',
      url: '/_api/' + (pathname || ''),
    }
    axios
      .request(head_options)
      .then(function (response) {
        const isDir = response.headers.get('Isdir')
        const contentType = response.headers.get('content-type')

        if (isDir) {
          handleFolder()
        } else {
          handleFile('/_api/' + (pathname || ''), contentType)
        }
      })
      .catch(function (error) {
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
    const fetchPath = `/_search?q=${query}&limit=${limit}&dir=${pathname}`

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
        console.error(e)
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
