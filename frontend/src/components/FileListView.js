import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { formattedDateTime, humanFileSize } from '../utils/utils'
import { SelectedFilesContext } from '../contexts/SelectedFilesContext'
import { getIcon } from '../utils/iconUtils'
import { PathContext } from '../contexts/PathContext'
import { processRename } from '../utils/apiUtils'

const FileListView = ({ rows }) => {
  const [selectedRows, setSelectedRows] = useState([])
  const [activeColumn, setActiveColumn] = useState(['Name'])
  const [sortingColumn, setSortingColumn] = useState(['Name'])
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { setSelectedFiles } = useContext(SelectedFilesContext)
  const { fetchRowsFromLocation } = useContext(PathContext)

  const sortByColumn = (column) => {
    if (sortingColumn?.includes(column)) {
      const sortData = rows
        .slice()
        .sort((a, b) =>
          b[column].toString().localeCompare(a[column].toString())
        )
      setSortingData(sortData)
      setSortingColumn([])
    } else {
      const sortData = rows
        .slice()
        .sort((a, b) =>
          a[column].toString().localeCompare(b[column].toString())
        )
      setSortingData(sortData)
      setSortingColumn([`${column}`])
    }
    setActiveColumn([`${column}`])
  }
  const [sortingData, setSortingData] = useState(rows)
  const [selectAll, setSelectAll] = useState(false)

  const toggleSelectAll = () => {
    setSelectAll(!selectAll)
    setSelectedRows(selectAll ? [] : sortingData.map((item) => item.id))
  }
  const toggleSelectRow = (event, id) => {
    event.stopPropagation()
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  useEffect(() => {
    setSelectedFiles(selectedRows.map((r) => r.Path))
  }, [selectedRows])

  useEffect(() => {
    const sortedRows = rows.slice().sort((a, b) => a.Name.localeCompare(b.Name))
    setSortingData(sortedRows)
  }, [rows])

  const handleClick = (path) => {
    navigate(path)
  }

  const handleDownload = (event, data) => {
    event.stopPropagation()
    window.open('/_download/' + data.Path + '?basename=' + pathname, '_blank')
  }

  const handleRename = (event, data) => {
    event.stopPropagation()
    const renamedFile = prompt('Enter new file/folder name', data.Name)
    const renamePromise = processRename(renamedFile, data, pathname)
    renamePromise
      .then((reponse) => {
        fetchRowsFromLocation()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className='h-full max-h-[1000px] overflow-scroll flex flex-col items-center'>
      <table className='table table-zebra rounded-lg border-separate border border-base-content/15'>
        <thead>
          <tr className='font-bold pt-6 bg-base-100'>
            <th className='py-4 px-2 h-full flex justify-center items-center'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  className='h-4 w-4 cursor-pointer'
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </div>
            </th>
            <th className='py-3 px-3 w-1/4 text-base-content sm:text-base font-bold whitespace-nowrap group'>
              <div className='flex items-center'>
                <svg
                  className={`w-4 h-4 cursor-pointer ${
                    activeColumn?.includes('Name')
                      ? 'text-primary/70 group-hover:text-primary'
                      : 'text-secondary/70 group-hover:text-secondary rotate-180'
                  } ${
                    sortingColumn?.includes('Name') ? 'rotate-180' : 'rotate-0'
                  }
           `}
                  onClick={() => sortByColumn('Name')}
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 14l-7 7m0 0l-7-7m7 7V3'
                  />
                </svg>
                <span
                  className='cursor-pointer pl-1'
                  onClick={() => sortByColumn('Name')}
                >
                  Name
                </span>
              </div>
            </th>
            <th className='py-3 px-3 flex flex-row items-center text-base-content sm:text-base font-bold whitespace-nowrap group'>
              <div className='flex items-center'>
                <svg
                  className={`w-4 h-4 cursor-pointer ${
                    activeColumn?.includes('Size')
                      ? 'text-primary/70 group-hover:text-primary'
                      : 'text-secondary/70 group-hover:text-secondary rotate-180'
                  } ${
                    sortingColumn?.includes('Size') ? 'rotate-180' : 'rotate-0'
                  } `}
                  onClick={() => sortByColumn('Size')}
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 14l-7 7m0 0l-7-7m7 7V3'
                  />
                </svg>
                <span
                  className='cursor-pointer pl-1'
                  onClick={() => sortByColumn('Size')}
                >
                  Size
                </span>
              </div>
            </th>
            <th className='py-3 px-3 text-base-content sm:text-base font-bold whitespace-nowrap group'>
              <div className='flex items-center'>
                <svg
                  className={`w-4 h-4 cursor-pointer ${
                    activeColumn?.includes('LastModified')
                      ? 'text-primary/70 group-hover:text-primary'
                      : 'text-secondary/70 group-hover:text-secondary rotate-180'
                  } ${
                    sortingColumn?.includes('LastModified')
                      ? 'rotate-180'
                      : 'rotate-0'
                  }
           `}
                  onClick={() => sortByColumn('Name')}
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 14l-7 7m0 0l-7-7m7 7V3'
                  />
                </svg>
                <span
                  className='cursor-pointer pl-1'
                  onClick={() => sortByColumn('LastModified')}
                >
                  Last Modified
                </span>
              </div>
            </th>
            <th className='sm:text-base'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortingData?.map((data, index) => (
            <tr
              key={index}
              className='border-b border-base-content/15'
              onClick={() => handleClick(data.Path)}
            >
              <td className='py-4 px-2 h-full flex justify-center items-center'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 cursor-pointer'
                    checked={selectedRows.includes(data.id)}
                    onChange={() => {}}
                    onClick={(event) => toggleSelectRow(event, data.id)}
                  />
                </div>
              </td>
              <td className='py-1 px-2 font-normal text-base whitespace-nowrap'>
                <div className='flex flex-row items-center'>
                  <div className='px-2'>
                    {getIcon(data.Name, data.IsDir, 32)}
                  </div>
                  <span>{data?.Name}</span>
                </div>
              </td>
              <td className='py-1 px-2 font-normal text-base whitespace-nowrap'>
                {data.IsDir ? '-' : humanFileSize(data?.Size)}
              </td>
              <td className='py-1 px-2 text-base font-normal'>
                {formattedDateTime(data?.LastModified)}
              </td>
              <td>
                <div className='tooltip' data-tip='Download as zip'>
                  <button
                    className='btn btn-sm btn-neutral mr-2'
                    onClick={(event) => handleDownload(event, data)}
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
                    onClick={(event) => handleRename(event, data)}
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export { FileListView }
