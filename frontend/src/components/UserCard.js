import { Avatar, Box, Stack, Typography } from '@mui/material'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import OptionsMenu from './OptionsMenu'

const UserCard = () => {
  const auth = useAuthUser()
  return (
    auth && (
      <Stack
        direction='row'
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes='small'
          alt='John Doe'
          // src='/static/images/avatar/7.jpg'
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography
            variant='body2'
            sx={{ fontWeight: 500, lineHeight: '16px' }}
          >
            {auth.name}
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.secondary' }}>
            {auth.name}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    )
  )
}

export default UserCard
