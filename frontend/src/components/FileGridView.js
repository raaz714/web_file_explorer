import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Checkbox, Paper, styled, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { getIcon } from '../utils/iconUtils'
import { formattedDateTime } from '../utils/utils'
import { SelectedFilesContext } from '../contexts/SelectedFilesContext'

const FileCard = styled(Paper)(({ theme }) => ({
  // width: 240,
  height: 180,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
}))

export const FileGridView = ({ rows }) => {
  const { selectedFiles, setSelectedFiles } = useContext(SelectedFilesContext)
  const navigate = useNavigate()

  const handleChange = (event, row) => {
    event.stopPropagation()

    const found = selectedFiles.find((element) => element === row.Path)
    if (!found) {
      if (event.target.checked) {
        setSelectedFiles([...selectedFiles, row.Path])
      }
    } else {
      if (!event.target.checked) {
        let tempSelectedFiles = selectedFiles.filter((t) => t !== row.Path)
        setSelectedFiles(tempSelectedFiles)
      }
    }
  }

  const handleClick = (row) => {
    navigate(row.Path)
  }

  return (
    <Grid
      container
      columns={{ xs: 2, sm: 6, xl: 12 }}
      spacing={2}
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {rows &&
        rows.map((row) => {
          return (
            <Grid key={row.id} size={2}>
              <FileCard onClick={() => handleClick(row)}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {getIcon(row.Name, row.IsDir, 40)}
                    <Checkbox
                      onClick={(event) => handleChange(event, row)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-around',
                      alignItems: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant='h6'
                      align='left'
                      sx={{
                        textWrap: 'nowrap',
                        overflow: 'hidden',
                        width: '90%',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {row.Name}
                    </Typography>
                    <div>{formattedDateTime(row.LastModified)}</div>
                  </Box>
                </Box>
              </FileCard>
            </Grid>
          )
        })}
    </Grid>
  )
}
