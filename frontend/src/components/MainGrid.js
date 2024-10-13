import { useContext } from 'react'
import { FileListView } from './FileListView'
import { FileGridView } from './FileGridView'
import { ViewContext } from '../contexts/ViewContext'

export default function MainGrid({ rows }) {
  const { view } = useContext(ViewContext)
  return (
    <div className='w-full h-full'>
      <div className='mt-4 w-full justify-center'>
        {view === 'grid' ? (
          <FileGridView rows={rows} />
        ) : (
          <FileListView rows={rows} />
        )}
      </div>
    </div>
  )
}
