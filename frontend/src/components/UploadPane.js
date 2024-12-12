import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocation } from 'react-router-dom'
import { humanFileSize } from '../utils/utils'
import { doUpload } from '../utils/apiUtils'

const InputFileUpload = () => {
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(-1)
  const { pathname } = useLocation()
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles])
    },
    [files]
  )
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  const removeFile = (file) => () => {
    const newFiles = [...files]
    newFiles.splice(newFiles.indexOf(file), 1)
    setFiles(newFiles)
  }

  const removeAll = () => {
    setFiles([])
  }

  function handleFileSelect(event) {
    setFiles(event.target.files)
  }

  const showFiles = files.map((file) => (
    <li key={file.path} className='flex flex-row justify-between'>
      <span className='ml-2 text-xs max-w-4/5 text-ellipsis overflow-hidden'>
        {`${file.path} - ${humanFileSize(file.size)}`}
      </span>
      <button
        className='btn btn-xs btn-circle btn-neutral mx-2'
        onClick={removeFile(file)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='size-2'
        >
          <path
            fillRule='evenodd'
            d='M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </li>
  ))

  const handleUpload = () => {
    if (files.length === 0) {
      return
    }
    const form = new FormData()
    files.forEach((file) => {
      form.append('upload[]', file)
    })

    const uploadPromie = doUpload(form, pathname, setProgress)
    uploadPromie
      .then(() => {
        setProgress(100)
        setTimeout(() => {
          setProgress(-1)
          setFiles([])
        }, 100)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className='w-full'>
      <div className='inline md:hidden'>
        <form onSubmit={handleUpload}>
          <input
            type='file'
            multiple
            onChange={handleFileSelect}
            className='file-input file-input-bordered w-full max-w-md'
          />
        </form>
      </div>
      <div className='card hidden md:flex card-compact mt-4 bg-base-100 shadow-xl w-full text-center justify-center'>
        <div className='card-body'>
          <div className='flex flex-col justify-center items-center'>
            <p className='text-xl font-semibold mb-4'>Upload Files</p>
            <div
              {...getRootProps({
                className:
                  'dropzone w-3/5 h-24 border-2 border-dashed border-base-content/15 flex items-center',
              })}
            >
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            {files.length > 0 && (
              <div className='flex flex-row w-2/5 mt-4 items-center justify-between'>
                <ul className='max-h-16 max-w-2/3 bg-neutral-content text-neutral overflow-scroll'>
                  {showFiles}
                </ul>
                <button
                  className='btn btn-sm btn-secondary'
                  onClick={removeAll}
                >
                  Clear All
                </button>
              </div>
            )}
            <button
              className='btn btn-outline my-4'
              disabled={!!!files.length}
              onClick={handleUpload}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='size-6'
              >
                <path
                  fillRule='evenodd'
                  d='M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z'
                  clipRule='evenodd'
                />
              </svg>
              Upload
            </button>
          </div>

          {progress >= 0 && (
            <progress
              className='progress w-4/5'
              value={progress}
              max='100'
            ></progress>
          )}
        </div>
      </div>
    </div>
  )
}

export default InputFileUpload
