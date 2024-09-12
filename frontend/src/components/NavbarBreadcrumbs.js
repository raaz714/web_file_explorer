import { useLocation, useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import { useEffect, useState } from 'react'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}))

export default function NavbarBreadcrumbs() {
  const { pathname } = useLocation()
  const [crumbs, setCrumbs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let c = [{ name: 'Home', path: '' }]
    if (pathname === '/') {
      setCrumbs(c)
      return
    }
    const allPaths = pathname.split('/')
    allPaths.shift()
    while (allPaths.length > 0) {
      const dir = allPaths.shift()
      c.push({ name: dir, path: c.at(-1).path + '/' + dir })
    }
    setCrumbs(c)
  }, [pathname])
  return (
    <StyledBreadcrumbs
      aria-label='breadcrumb'
      separator={<NavigateNextRoundedIcon fontSize='small' />}
    >
      <Typography variant='body1'>Directory</Typography>
      {crumbs.map((c, i) => {
        return (
          <Typography
            key={i}
            variant='body1'
            onClick={() => {
              navigate(c.path)
            }}
            sx={
              i === crumbs.length - 1
                ? {
                    color: 'text.primary',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }
                : { '&:hover': { textDecoration: 'underline' } }
            }
          >
            {c.name}
          </Typography>
        )
      })}
    </StyledBreadcrumbs>
  )
}
