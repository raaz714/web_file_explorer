import * as React from 'react'
import { styled } from '@mui/material/styles'
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer'
import MenuContent from './MenuContent'
import CardAlert from './CardAlert'
import UserCard from './UserCard'

const drawerWidth = 240

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
})

const SideMenu = () => {
  return (
    <Drawer
      variant='permanent'
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* <Box
        sx={{
          display: 'flex',
          mt: '60px',
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      <Divider /> */}
      <MenuContent />
      <CardAlert />
      <UserCard />
    </Drawer>
  )
}

export default SideMenu
