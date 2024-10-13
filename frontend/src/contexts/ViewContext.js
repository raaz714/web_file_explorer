import { createContext, useState } from 'react'

export const ViewContext = createContext()

const ViewContextProvider = (props) => {
  const [view, setView] = useState(window.innerWidth < 768 ? 'grid' : 'list')

  const toggleView = () => {
    if (view === 'list') {
      setView('grid')
    } else {
      setView('list')
    }
  }

  return (
    <ViewContext.Provider value={{ view, toggleView }}>
      {props.children}
    </ViewContext.Provider>
  )
}

export default ViewContextProvider
