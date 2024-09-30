import { useLocation } from 'react-router-dom'

const getComponentType = (fileType) => {
  if (fileType.startsWith('image')) {
    return 'img'
  }

  if (fileType.startsWith('video/mp4') || fileType.startsWith('video/webm')) {
    return 'video'
  }

  if (
    fileType.startsWith('audio/aac') ||
    fileType.startsWith('audio/mpeg') ||
    fileType.startsWith('audio/ogg')
  ) {
    return 'audio'
  }

  return null
}

const PreviewPane = ({ fileInfo }) => {
  const componentType = getComponentType(fileInfo.fileType)
  const { pathname } = useLocation()

  switch (componentType) {
    case 'img':
      return (
        <img
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          src={fileInfo.fileUrl}
          alt=''
        ></img>
      )
    case 'video':
      return (
        <video style={{ maxWidth: '100%', maxHeight: '100%' }} controls>
          <source src={fileInfo.fileUrl} />
          <track
            label='English'
            kind='subtitles'
            src={'/_sub/' + pathname}
            default
          />
          Your browser does not support HTML video.
        </video>
      )
    case 'audio':
      return (
        <audio style={{ maxWidth: '100%', maxHeight: '100%' }} controls>
          <source src={fileInfo.fileUrl} />
          Your browser does not support HTML audio.
        </audio>
      )
    default:
      return (
        <object data={fileInfo.fileUrl} width='100%' height='1000px'>
          <p>
            Cannot preview this file -{' '}
            <a
              role='button'
              className='btn btn-outline'
              href={fileInfo.fileUrl}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='size-6'
              >
                <path
                  fillRule='evenodd'
                  d='M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z'
                  clipRule='evenodd'
                />
              </svg>
              Download
            </a>
          </p>
        </object>
      )
  }
}

export default PreviewPane
