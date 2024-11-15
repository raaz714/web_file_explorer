import * as React from 'react'
import SideMenu from './SideMenu'

const GlobalFrame = ({ mode, toggleColorMode, children }) => {
  // const dashboardTheme = createTheme(getDashboardTheme(mode))

  return (
    <div className='drawer lg:drawer-open bg-base-300' data-theme={mode}>
      <input id='left-nav' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col items-center justify-center'>
        {/* Page content here */}
        <div
          className='w-full h-screen flex flex-col'
          //  sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}
        >
          <NavBar mode={mode} toggleColorMode={toggleColorMode} />
          <div className='flex'>{children}</div>
        </div>
        <label
          htmlFor='left-nav'
          className='btn btn-ghost fixed top-1 left-1 drawer-button lg:hidden'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
            />
          </svg>
        </label>
      </div>
      <div className='drawer-side'>
        <label
          htmlFor='left-nav'
          aria-label='close sidebar'
          className='drawer-overlay'
        ></label>
        {/* Sidebar content here */}
        <SideMenu />
      </div>
    </div>
  )
}

const NavBar = ({ mode, toggleColorMode }) => {
  return (
    <div className='navbar bg-base-200'>
      <div className='w-full'>
        <img
          className='w-10 rounded-full border-2 border-info'
          src='/logo.png'
          alt='logo'
        />
        <div className='text-xl w-full text-center md:w-fit font-semibold ml-4'>
          File Browser
        </div>
      </div>
      <label className='flex cursor-pointer gap-2'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='12' r='5' />
          <path d='M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' />
        </svg>
        <input
          type='checkbox'
          value='dark'
          checked={mode === 'dark'}
          onChange={toggleColorMode}
          className='toggle theme-controller'
        />
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
        </svg>
      </label>
    </div>
  )
}

export default GlobalFrame
