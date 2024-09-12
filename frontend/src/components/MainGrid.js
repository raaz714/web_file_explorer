import { useContext } from 'react'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import FileListView from './FileListView'
import { PathContext } from '../contexts/PathContext'
import PreviewPane from './PreviewPane'
import { Typography } from '@mui/material'

export default function MainGrid() {
  const { rows, fileInfo } = useContext(PathContext)
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
        <PreviewPane fileInfo={fileInfo} />
      ) : (
        <Grid container spacing={2} columns={12}>
          <FileListView rows={rows} />

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
