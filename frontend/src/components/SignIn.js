import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import getDashboardTheme from '../theme/getDashboardTheme'
import { useEffect, useState } from 'react'

export default function SignIn() {
  const [mode, setMode] = useState('light')

  // This code only runs on the client side, to determine the system color preference
  useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem('themeMode')
    if (savedMode) {
      setMode(savedMode)
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      setMode(systemPrefersDark ? 'dark' : 'light')
    }
  }, [])

  const dashboardTheme = createTheme(getDashboardTheme(mode))
  const signIn = useSignIn()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const username = data.get('username')
    const password = data.get('password')

    const options = {
      method: 'POST',
      url: '_auth/login',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { username: username, password: password },
    }

    axios
      .request(options)
      .then(function (response) {
        if (
          signIn({
            auth: {
              token: response.data.token,
              type: 'Bearer',
            },
            userState: {
              name: response.data.username,
            },
          })
        ) {
          navigate('/')
        }
      })
      .catch(function (error) {
        console.error(error)
      })

    // loginHandler(data.get('username'), data.get('password'))
  }

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline enableColorScheme />
      <Stack
        direction='column'
        justifyContent='space-between'
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          variant='outlined'
          sx={{ width: '100%', maxWidth: '450px', mt: '10vh', p: 5 }}
        >
          <Typography
            component='h1'
            variant='h4'
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor='usernmae'>Username</FormLabel>
              <TextField
                id='username'
                type='text'
                name='username'
                placeholder='username'
                autoComplete='username'
                autoFocus
                required
                fullWidth
                variant='outlined'
                color={'primary'}
                sx={{ ariaLabel: 'username' }}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor='password'>Password</FormLabel>
              </Box>
              <TextField
                name='password'
                placeholder='••••••'
                type='password'
                id='password'
                autoComplete='current-password'
                autoFocus
                required
                fullWidth
                variant='outlined'
                color={'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            <Button type='submit' fullWidth variant='contained'>
              Sign in
            </Button>
          </Box>
        </Card>
      </Stack>
    </ThemeProvider>
  )
}
