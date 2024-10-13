import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getIcon } from '../utils/iconUtils'
import { formattedDateTime } from '../utils/utils'
import { SelectedFilesContext } from '../contexts/SelectedFilesContext'
import axios from 'axios'
import { PathContext } from '../contexts/PathContext'

export const FileGridView = ({ rows }) => {
  const { selectedFiles, setSelectedFiles } = useContext(SelectedFilesContext)
  const { fetchRowsFromLocation } = useContext(PathContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleChange = (event, row) => {
    event.stopPropagation()

    const found = selectedFiles.find((element) => element === row.Path)
    if (!found) {
      if (event.target.checked) {
        setSelectedFiles([...selectedFiles, row.Path])
      }
    } else {
      if (!event.target.checked) {
        let tempSelectedFiles = selectedFiles.filter((t) => t !== row.Path)
        setSelectedFiles(tempSelectedFiles)
      }
    }
  }

  const handleClick = (row) => {
    navigate(row.Path)
  }

  const handleDownload = (event, data) => {
    event.stopPropagation()
    window.open('/_download/' + data.Path + '?basename=' + pathname, '_blank')
  }

  const handleRename = (event, data) => {
    event.stopPropagation()
    const renamedFile = prompt('Enter new file/folder name', data.Name)
    if (renamedFile !== '' && renamedFile !== data.Name) {
      console.log('raname ', data.Path, ' to ', renamedFile)

      const options = {
        method: 'POST',
        url: '/_execute/rename',
        headers: { 'Content-Type': 'application/json' },
        data: { oldname: data.Path, newname: pathname + '/' + renamedFile },
      }

      axios
        .request(options)
        .then(function (response) {
          fetchRowsFromLocation()
        })
        .catch(function (error) {
          console.error(error)
        })
    }
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-6 xl:grid-cols-12 gap-2 justify-start items-center w-full h-full max-h-[70vh] overflow-scroll'>
      {rows &&
        rows.map((row) => {
          return (
            <div key={row.id} className='col-span-1 md:col-span-2'>
              <div
                className='h-[200px] p-3 text-left card bg-base-100 shadow-xl group/card'
                onClick={() => handleClick(row)}
              >
                <div className='w-full hidden bg-base-200 absolute top-1/3 left-0 group-hover/card:flex flex-row justify-around'>
                  <div className='tooltip' data-tip='Download as zip'>
                    <button
                      className='btn btn-sm btn-neutral'
                      onClick={(event) => handleDownload(event, row)}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
                        />
                      </svg>
                    </button>
                  </div>

                  <div className='tooltip' data-tip='Rename'>
                    <button
                      className='btn btn-sm btn-neutral'
                      onClick={(event) => handleRename(event, row)}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className='h-full flex flex-col justify-between items-start'>
                  <div className='w-full flex justify-between items-center'>
                    {getIcon(row.Name, row.IsDir, 40)}
                    <input
                      type='checkbox'
                      className='checkbox'
                      onClick={(event) => handleChange(event, row)}
                    />
                  </div>
                  <div className='flex flex-col justify-around items-start w-full'>
                    <div className='text-base md:text-xl text-nowrap overflow-hidden w-11/12 text-ellipsis'>
                      {row.Name}
                    </div>
                    <div className='text-xs md:text-sm'>
                      {formattedDateTime(row.LastModified)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
