import { useContext } from 'react'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import { FileListView } from './FileListView'
import { FileGridView } from './FileGridView'
import { PathContext } from '../contexts/PathContext'
import PreviewPane from './PreviewPane'
import { Typography } from '@mui/material'
import { ViewContext } from '../contexts/ViewContext'

export default function MainGrid() {
  const { rows, fileInfo } = useContext(PathContext)
  const { view } = useContext(ViewContext)
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      {/* cards */}
      {/* <Typography component='h2' variant='h6' sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid> */}
      <Typography component='h2' variant='h6' sx={{ mb: 2 }}>
        Details
      </Typography>
      {fileInfo ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <PreviewPane fileInfo={fileInfo} />
        </Box>
      ) : (
        <Grid container spacing={2} columns={12} justifyContent={'center'}>
          {/* <FileListView rows={rows} /> */}
          {view === 'grid' ? (
            <FileGridView rows={rows} />
          ) : (
            <FileListView rows={rows} />
          )}

          {/* <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid> */}
        </Grid>
      )}
      {/* <Copyright sx={{ my: 4 }} /> */}
    </Box>
  )
}