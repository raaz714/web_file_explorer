import { useState } from 'react'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { MuiFileInput } from 'mui-file-input'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const InputFileUpload = () => {
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(-1)
  const { pathname } = useLocation()

  const handleFilePick = (newValue) => {
    setFiles(newValue)
  }

  const handleUpload = () => {
    if (files.length === 0) {
      return
    }
    const form = new FormData()
    files.forEach((file) => {
      form.append('upload[]', file)
    })

    axios
      .post(`/_upload?destination=${pathname}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (p) => {
          setProgress((p.loaded / p.total) * 100)
        },
      })
      .then((data) => {
        setFiles([])
        setProgress(100)
        setTimeout(() => {
          setProgress(-1)
        }, 100)
      })
  }

  return (
    <Card
      sx={{
        width: '100%',
        height: '80%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <CardContent
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Stack
            spacing={2}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              component='h2'
              variant='subtitle2'
              gutterBottom
              sx={{ fontWeight: '600' }}
            >
              Upload Files
            </Typography>
            <MuiFileInput
              value={files}
              multiple
              onChange={handleFilePick}
              placeholder='Click or drag and drop here to select files'
              inputProps={{
                sx: {
                  '&::MuiFileInput-placeholder': {
                    color: 'red',
                  },
                },
              }}
              clearIconButtonProps={{
                children: <CloseIcon fontSize='large' />,
              }}
              InputProps={{
                startAdornment: <CloudUploadIcon />,
                sx: { height: 100 },
              }}
            />
            <Button
              component='button'
              // sx={{ width: '80%' }}
              role={undefined}
              variant='outlined'
              disabled={!!!files.length}
              tabIndex={-1}
              onClick={handleUpload}
              startIcon={<FileUploadIcon />}
            >
              Upload
            </Button>
          </Stack>
        </Box>

        {progress >= 0 && (
          <LinearProgress
            sx={{ width: '80%' }}
            variant='determinate'
            value={progress}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default InputFileUpload
