import useSignIn from 'react-auth-kit/hooks/useSignIn'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { doSignIn } from '../utils/apiUtils'

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

  const signIn = useSignIn()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const username = data.get('username')
    const password = data.get('password')

    const signInPromise = doSignIn(username, password)
    signInPromise
      .then((response) => {
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
      .catch((error) => {
        console.error(error)
        navigate('/login')
      })
  }

  return (
    <div
      data-theme={mode}
      className='flex flex-col h-screen justify-center items-center'
    >
      <div className='card h-96 w-full max-w-[450px] mt-10 p-5 border border-white/15'>
        <div className='w-full text-4xl font-semibold mb-10'>Sign in</div>
        <form
          className='flex flex-col h-full justify-between w-full gap-2'
          onSubmit={handleSubmit}
          noValidate
        >
          <label
            htmlFor='usernmae'
            name='username'
            className='input input-bordered flex items-center gap-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'
            >
              <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' />
            </svg>
            <input
              id='username'
              name='username'
              type='text'
              className='grow'
              placeholder='Username'
            />
          </label>
          <label
            htmlFor='password'
            className='input input-bordered flex items-center gap-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'
            >
              <path
                fillRule='evenodd'
                d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
                clipRule='evenodd'
              />
            </svg>
            <input
              id='password'
              name='password'
              type='password'
              className='grow'
              placeholder='Password'
            />
          </label>
          <button type='submit' className='btn w-full btn-primary'>
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
