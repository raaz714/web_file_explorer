import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'

export default function CardAlert() {
  return (
    <Card variant='outlined' sx={{ m: 1.5, p: 1.5 }}>
      <CardContent>
        <AutoAwesomeRoundedIcon fontSize='small' />
        <Typography gutterBottom sx={{ fontWeight: 600 }}>
          Expose local server using btunnel
        </Typography>
        <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
          Subscription only at
        </Typography>
        <Typography display='inline' sx={{ fontSize: '1.2rem' }}>
          $4.2
        </Typography>
        <Typography
          display='inline'
          variant='body2'
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          /month
        </Typography>
        <Button
          variant='contained'
          href='https://www.btunnel.in'
          target='_blank'
          size='small'
          fullWidth
        >
          Go to btunnel
        </Button>
      </CardContent>
    </Card>
  )
}
