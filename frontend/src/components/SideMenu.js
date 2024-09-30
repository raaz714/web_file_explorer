import * as React from 'react'
import MenuContent from './MenuContent'
import CardAlert from './CardAlert'
import UserCard from './UserCard'

const SideMenu = () => {
  return (
    <div className='flex flex-col bg-base-100 z-10 max-w-64 h-full max-h-[100vh] border border-base-content/15'>
      <MenuContent />
      <div className='divider'></div>
      <CardAlert />
      <UserCard />
    </div>
  )
}

export default SideMenu
