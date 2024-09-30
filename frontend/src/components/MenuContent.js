import { useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

const FileNameDialog = ({ open, handleSubmit, handleClose }) => {
  return (
    <dialog id='file-name-dialog' className='modal fixed m-auto'>
      <div className='modal-box'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            ✕
          </button>
        </form>
        <h3 className='text-lg font-bold'>Create File/Folder</h3>
        <p className='py-4'>Enter the name of new file/folder</p>
        <form
          htmlFor='filename'
          className='relative w-full'
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            handleSubmit(formJson.name)
            handleClose()
          }}
        >
          <div className='join'>
            <input
              id='name'
              name='name'
              className='input input-bordered join-item'
              placeholder='File'
            />
            <input
              type='submit'
              value='Create'
              className='btn join-item rounded-r'
            />
          </div>
        </form>
      </div>
    </dialog>
  )
}

const MenuContent = () => {
  const [open, setOpen] = useState(false)
  const [createType, setCreateType] = useState('file') // 'file' or 'folder'
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleSubmit = (value) => {
    const url = '/_execute/' + (createType === 'file' ? 'newfile' : 'newfolder')
    let data = {}

    switch (createType) {
      case 'file':
        data = { folderpath: pathname, filename: value }
        break
      case 'folder':
        data = { folderpath: pathname, foldername: value }
        break
      default:
        return
    }

    const options = {
      method: 'POST',
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: data,
    }

    axios
      .request(options)
      .then(function (response) {})
      .catch(function (error) {
        console.error(error)
      })
  }

  const handleClose = () => {
    document.getElementById('file-name-dialog').close()
    navigate(0)
    setOpen(false)
  }

  const handleNewClick = (type = 'file') => {
    setCreateType(type)
    document.getElementById('file-name-dialog').showModal()
    setOpen(true)
  }

  return (
    <div className='flex flex-col flex-grow pt-10 px-1 pb-1 justify-between'>
      <ul className='menu w-full max-w-[360px]'>
        <NavItem
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-6'
            >
              <path d='M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z' />
              <path d='m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z' />
            </svg>
          }
          label={'Home'}
        />
        <NavItem
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-6'
            >
              <path
                fillRule='evenodd'
                d='M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V10.5Z'
                clipRule='evenodd'
              />
            </svg>
          }
          label={'New Folder'}
          onClickHandler={() => handleNewClick('folder')}
        />
        <NavItem
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-6'
            >
              <path
                fillRule='evenodd'
                d='M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z'
                clipRule='evenodd'
              />
              <path d='M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z' />
            </svg>
          }
          label={'New File'}
          onClickHandler={() => handleNewClick('file')}
        />
      </ul>
      <ul className='menu w-full max-w-[360px]'>
        <NavItem
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-6'
            >
              <path d='M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27'></path>
            </svg>
          }
          label={'Github'}
          onClickHandler={() => {
            window.open(
              'https://github.com/raaz714/web_file_explorer',
              '_blank'
            )
          }}
        />
      </ul>
      <FileNameDialog
        open={open}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
      {/* <label htmlFor='file_name_dialog' className='btn'>
        open modal
      </label>
      <input type='checkbox' id='file_name_dialog' className='modal-toggle' />
      <FileNameDialog
        open={open}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      /> */}
    </div>
  )
}

const NavItem = ({ icon, label, onClickHandler }) => (
  <li
    // className='flex justify-start gap-6 px-2 h-12 cursor-pointer'
    onClick={onClickHandler}
  >
    <div className='btn-ghost' htmlFor='file_name_dialog'>
      {icon}
      {label}
    </div>
  </li>
)

export default MenuContent
