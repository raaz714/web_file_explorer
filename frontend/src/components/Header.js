import { useContext } from 'react'
import Stack from '@mui/material/Stack'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import NavbarBreadcrumbs from './NavbarBreadcrumbs'
import MenuButton from './MenuButton'
import Search from './Search'
import { Box, IconButton } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import { SelectedFilesContext } from '../contexts/SelectedFilesContext'
import { ViewContext } from '../contexts/ViewContext'
import { PathContext } from '../contexts/PathContext'

const FileActionPane = ({
  pastable,
  stageToCopyOrCut,
  executePaste,
  executeRemove,
}) => {
  const { fetchRowsFromLocation } = useContext(PathContext)
  return pastable.length > 0 ? (
    <IconButton
      aria-label='paste'
      onClick={() => executePaste(fetchRowsFromLocation)}
      size='small'
      sx={{ mx: 1 }}
    >
      <ContentPasteIcon fontSize='inherit' />
    </IconButton>
  ) : (
    <Box>
      <IconButton
        aria-label='copy'
        onClick={() => stageToCopyOrCut(false)}
        size='small'
        sx={{ mx: 1 }}
      >
        <ContentCopyIcon fontSize='inherit' />
      </IconButton>
      <IconButton
        aria-label='cut'
        onClick={() => stageToCopyOrCut(true)}
        size='small'
        sx={{ mx: 1 }}
      >
        <ContentCutIcon fontSize='inherit' />
      </IconButton>
      <IconButton
        aria-label='delete'
        onClick={() => executeRemove(fetchRowsFromLocation)}
        size='small'
        sx={{ mx: 1 }}
      >
        <DeleteIcon fontSize='inherit' />
      </IconButton>
    </Box>
  )
}

export default function Header() {
  const {
    selectedFiles,
    pastable,
    stageToCopyOrCut,
    executePaste,
    executeRemove,
  } = useContext(SelectedFilesContext)

  const { view, toggleView } = useContext(ViewContext)

  return (
    <Stack
      direction='row'
      sx={{
        display: { xs: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction='row' sx={{ gap: 1 }}>
        {(selectedFiles.length > 0 || pastable.length > 0) && (
          <FileActionPane
            pastable={pastable}
            executePaste={executePaste}
            stageToCopyOrCut={stageToCopyOrCut}
            executeRemove={executeRemove}
          />
        )}
        <Search />
        <MenuButton onClick={toggleView} aria-label='Change View'>
          {view === 'grid' ? <ViewListIcon /> : <GridViewIcon />}
        </MenuButton>
      </Stack>
    </Stack>
  )
}
