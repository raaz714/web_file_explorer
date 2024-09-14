import FolderIcon from '@mui/icons-material/Folder'
import DescriptionIcon from '@mui/icons-material/Description'
import ImageIcon from '@mui/icons-material/Image'
import AudioFileIcon from '@mui/icons-material/AudioFile'
import VideoFileIcon from '@mui/icons-material/VideoFile'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import {
  blue,
  blueGrey,
  deepOrange,
  orange,
  red,
  teal,
} from '@mui/material/colors'

const re = /(?:\.([^.]+))?$/
const getIcon = (filename, isDir, size = 30) => {
  if (isDir) {
    return <FolderIcon sx={{ color: blue[400], fontSize: size }} />
  }

  let ext = re.exec(filename)[1]

  if (!ext) {
    return <DescriptionIcon sx={{ color: blueGrey[400], fontSize: size }} />
  }

  ext = ext.toLowerCase()

  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'gif':
    case 'png':
    case 'bmp':
      return <ImageIcon sx={{ color: orange[400], fontSize: size }} />

    case 'wmv':
    case 'mp4':
    case 'avi':
    case 'avchd':
    case 'flv':
    case 'f4v':
    case 'swf':
    case 'mkv':
    case 'webm':
      return <VideoFileIcon sx={{ color: deepOrange[400], fontSize: size }} />

    case 'aac':
    case 'm4a':
    case 'wma':
    case 'wav':
    case 'flac':
    case 'mp3':
      return <AudioFileIcon sx={{ color: teal[400], fontSize: size }} />
    case 'pdf':
      return <PictureAsPdfIcon sx={{ color: red[400], fontSize: size }} />

    default:
      return <DescriptionIcon sx={{ color: blueGrey[400], fontSize: size }} />
  }
}

export { getIcon }
