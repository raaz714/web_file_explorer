const FolderIcon = ({ className }) => (
  <svg
    className={className}
    focusable='false'
    aria-hidden='true'
    viewBox='0 0 24 24'
    data-testid='FolderIcon'
  >
    <path d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8z'></path>
  </svg>
)

const DescriptionIcon = ({ className }) => (
  <svg
    className={className}
    focusable='false'
    aria-hidden='true'
    viewBox='0 0 24 24'
    data-testid='DescriptionIcon'
  >
    <path d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z'></path>
  </svg>
)

const ImageIcon = ({ className }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    height='24'
    viewBox='0 0 24 24'
    width='24'
  >
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
  </svg>
)

const AudioFileIcon = ({ className }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    height='24'
    viewBox='0 0 24 24'
    width='24'
  >
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z' />
  </svg>
)

const VideoFileIcon = ({ className }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    height='24'
    viewBox='0 0 24 24'
    width='24'
  >
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z' />
  </svg>
)

const PictureAsPdfIcon = ({ className }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    height='24'
    viewBox='0 0 24 24'
    width='24'
  >
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z' />
  </svg>
)

const re = /(?:\.([^.]+))?$/
const getIcon = (filename, isDir, size = 30) => {
  if (isDir) {
    return <FolderIcon className='w-8 h-8 fill-blue-500' />
  }

  let ext = re.exec(filename)[1]

  if (!ext) {
    return <DescriptionIcon className='w-8 h-8 fill-blue-300' />
  }

  ext = ext.toLowerCase()

  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'gif':
    case 'png':
    case 'bmp':
      return <ImageIcon className='w-8 h-8 fill-orange-400' />

    case 'wmv':
    case 'mp4':
    case 'avi':
    case 'avchd':
    case 'flv':
    case 'f4v':
    case 'swf':
    case 'mkv':
    case 'webm':
      return <VideoFileIcon className='w-8 h-8 fill-orange-800' />

    case 'aac':
    case 'm4a':
    case 'wma':
    case 'wav':
    case 'flac':
    case 'mp3':
      return <AudioFileIcon className='w-8 h-8 fill-teal-400' />
    case 'pdf':
      return <PictureAsPdfIcon className='w-8 h-8 fill-red-400' />

    default:
      return <DescriptionIcon className='w-8 h-8 fill-gray-500' />
  }
}

export { getIcon }
