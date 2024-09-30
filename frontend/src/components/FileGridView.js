import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIcon } from '../utils/iconUtils'
import { formattedDateTime } from '../utils/utils'
import { SelectedFilesContext } from '../contexts/SelectedFilesContext'

export const FileGridView = ({ rows }) => {
  const { selectedFiles, setSelectedFiles } = useContext(SelectedFilesContext)
  const navigate = useNavigate()

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

  return (
    <div className='grid grid-cols-2 sm:grid-cols-6 xl:grid-cols-12 gap-2 justify-start items-center w-full'>
      {rows &&
        rows.map((row) => {
          return (
            <div key={row.id} className='col-span-2'>
              <div
                className='h-[200px] p-3 text-left card bg-base-100 shadow-xl'
                onClick={() => handleClick(row)}
              >
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
                    <div className='text-xl text-nowrap overflow-hidden w-11/12 text-ellipsis'>
                      {row.Name}
                    </div>
                    <div>{formattedDateTime(row.LastModified)}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
