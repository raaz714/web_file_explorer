import * as React from 'react'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import ToggleColorMode from './ToggleColorMode'
import getDashboardTheme from '../theme/getDashboardTheme'
import { Typography } from '@mui/material'

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  backgroundImage: 'none',
  zIndex: theme.zIndex.drawer + 1,
  flex: '0 0 auto',
}))

const GlobalFrame = ({ mode, toggleColorMode, children }) => {
  const dashboardTheme = createTheme(getDashboardTheme(mode))

  return (
    <ThemeProvider theme={dashboardTheme}>
      <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <StyledAppBar>
          <Toolbar
            variant='dense'
            disableGutters
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              p: '8px 12px',
            }}
          >
            {/* <Button
              variant='text'
              size='small'
              aria-label='Back to templates'
              startIcon={<ArrowBackRoundedIcon />}
              component='a'
              href='/material-ui/getting-started/templates/'
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Back to templates
            </Button>
            <IconButton
              size='small'
              aria-label='Back to templates'
              component='a'
              href='/material-ui/getting-started/templates/'
              sx={{ display: { xs: 'auto', sm: 'none' } }}
            >
              <ArrowBackRoundedIcon />
            </IconButton> */}
            <Typography variant='h5'>File Browser</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl
                variant='outlined'
                sx={{ minWidth: 180 }}
              ></FormControl>
              <ToggleColorMode
                data-screenshot='toggle-mode'
                mode={mode}
                toggleColorMode={toggleColorMode}
              />
            </Box>
          </Toolbar>
        </StyledAppBar>
        <Box sx={{ flex: '1 1', overflow: 'auto' }}>{children}</Box>
      </Box>
    </ThemeProvider>
  )
}

export default GlobalFrame
