import useSignOut from 'react-auth-kit/hooks/useSignOut'
import { useNavigate } from 'react-router-dom'

export default function OptionsMenu() {
  const signOut = useSignOut()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate(0)
  }

  return (
    <>
      <div className='dropdown dropdown-top dropdown-left'>
        <div tabIndex={0} role='button' className='btn m-1'>
          <div aria-label='Open menu' sx={{ borderColor: 'transparent' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-6'
            >
              <path
                fillRule='evenodd'
                d='M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>
        <ul
          tabIndex={0}
          className='dropdown-content text-xs menu bg-base-100 rounded-box z-[1] w-36 shadow'
        >
          <li onClick={() => {}}>Profile</li>
          <li onClick={() => {}}>My account</li>
          <div className='divider' />
          <li onClick={() => {}}>Add another account</li>
          <li onClick={() => {}}>Settings</li>
          <div className='divider' />
          <li className='cursor-pointer' onClick={handleLogout}>
            Logout
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-6'
            >
              <path
                fillRule='evenodd'
                d='M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z'
                clipRule='evenodd'
              />
            </svg>
          </li>
        </ul>
      </div>
    </>
  )
}
