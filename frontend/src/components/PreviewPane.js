import { CardMedia } from '@mui/material'

const MediaView = ({ fileUrl, component }) => {
  return (
    <CardMedia
      component={component}
      sx={{ width: '100%', height: '100%' }}
      image={fileUrl}
      alt=''
      controls
    />
  )
}

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

  if (componentType) {
    return <MediaView fileUrl={fileInfo.fileUrl} component={componentType} />
  } else {
    return (
      <object data={fileInfo.fileUrl} width='100%' height='1000px'>
        <p>
          Cannot preview this file - <a href={fileInfo.fileUrl}>Download</a>
        </p>
      </object>
    )
  }
}

export default PreviewPane
