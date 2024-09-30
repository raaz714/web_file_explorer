import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import OptionsMenu from './OptionsMenu'

const avImage = (
  <svg
    className='w-10 h-10 fill-base-content'
    focusable='false'
    aria-hidden='true'
    viewBox='0 0 24 24'
  >
    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'></path>
  </svg>
)

const UserCard = () => {
  const auth = useAuthUser()
  return (
    auth && (
      <div className='flex flex-row p-2 gap-1 items-center border-t border-solid border-base-content/15'>
        <div className='avatar'>
          <div className='ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2'>
            {avImage}
          </div>
        </div>
        <div className='ml-4 mr-auto flex flex-col'>
          <span className='font-medium'>{auth.name}</span>
          <span className='text-xs text-secondary'>{auth.name}</span>
        </div>
        <OptionsMenu />
      </div>
    )
  )
}

export default UserCard
