import { useContext } from 'react'
import { FileListView } from './FileListView'
import { FileGridView } from './FileGridView'
import { PathContext } from '../contexts/PathContext'
import PreviewPane from './PreviewPane'
import { ViewContext } from '../contexts/ViewContext'

export default function MainGrid() {
  const { rows, fileInfo } = useContext(PathContext)
  const { view } = useContext(ViewContext)
  return (
    <div className='w-full h-full'>
      <div className='mb-2 text-xl'>Details</div>
      {fileInfo ? (
        <div
          className='flex flex-col justify-center'
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <PreviewPane fileInfo={fileInfo} />
        </div>
      ) : (
        <div className='w-full justify-center'>
          {/* <FileListView rows={rows} /> */}
          {view === 'grid' ? (
            <FileGridView rows={rows} />
          ) : (
            <FileListView rows={rows} />
          )}
        </div>
      )}
    </div>
  )
}
