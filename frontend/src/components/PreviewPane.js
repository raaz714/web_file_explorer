import { Button } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
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
            <Button
              variant='outlined'
              startIcon={<DownloadIcon />}
              href={fileInfo.fileUrl}
            >
              Download
            </Button>
          </p>
        </object>
      )
  }
  // if (componentType) {
  //   return <MediaView fileUrl={fileInfo.fileUrl} component={componentType} />
  // } else {
  //   return (
  //     <object data={fileInfo.fileUrl} width='100%' height='1000px'>
  //       <p>
  //         Cannot preview this file - <a href={fileInfo.fileUrl}>Download</a>
  //       </p>
  //     </object>
  //   )
  // }
}

export default PreviewPane
