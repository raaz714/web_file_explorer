import { useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import GitHubIcon from '@mui/icons-material/GitHub'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

// const secondaryListItems = [
//   { text: 'Settings', icon: <SettingsRoundedIcon /> },
//   { text: 'About', icon: <InfoRoundedIcon /> },
//   { text: 'Github', icon: <GitHubIcon /> },
// ]

const FileNameDialog = ({ open, handleSubmit, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const formJson = Object.fromEntries(formData.entries())
          handleSubmit(formJson.name)
          handleClose()
        },
      }}
    >
      <DialogTitle>Name</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter new file/folder name</DialogContentText>
        <TextField
          autoFocus
          required
          margin='dense'
          id='name'
          name='name'
          label='Name'
          fullWidth
          variant='standard'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type='submit'>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

const MenuContent = () => {
  const [open, setOpen] = useState(false)
  const [createType, setCreateType] = useState('file') // 'file' or 'folder'
  const { pathname } = useLocation()

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
    setOpen(false)
  }

  const handleNewClick = (type = 'file') => {
    setCreateType(type)
    setOpen(true)
  }

  return (
    <Stack
      sx={{
        flexGrow: 1,
        pt: 10,
        px: 1,
        pb: 1,
        justifyContent: 'space-between',
      }}
    >
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component='nav'
      >
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton selected>
            <ListItemIcon>
              <HomeRoundedIcon />
            </ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => handleNewClick('folder')}>
            <ListItemIcon>
              <CreateNewFolderIcon />
            </ListItemIcon>
            <ListItemText primary={'New Folder'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => handleNewClick('file')}>
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <ListItemText primary={'New File'} />
          </ListItemButton>
        </ListItem>
      </List>

      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            component='a'
            href='https://github.com/raaz714/web_file_explorer'
            target='_blank'
          >
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary={'Github'} />
          </ListItemButton>
        </ListItem>
      </List>
      <FileNameDialog
        open={open}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </Stack>
  )
}

export default MenuContent
