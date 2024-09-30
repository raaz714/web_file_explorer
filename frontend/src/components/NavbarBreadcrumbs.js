import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

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
    <div className='breadcrumbs text-sm'>
      <ul>
        {crumbs.map((c, i) => (
          <li key={i}>
            <button
              className='link link-hover'
              onClick={() => {
                navigate(c.path)
              }}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
