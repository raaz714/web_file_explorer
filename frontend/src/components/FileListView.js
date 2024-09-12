import { useContext, useEffect, useState } from 'react'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid'
import { headCells as columns } from '../internals/data/gridData'
import { useLocation, useNavigate } from 'react-router-dom'
import { SelectedFilesContext } from '../contexts/SelectedFilesContext'

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  )
}

export default function FileListView({ rows }) {
  const [rowSelectionModel, setRowSelectionModel] = useState([])
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { selectedFiles, setSelectedFiles } = useContext(SelectedFilesContext)

  const handleRowSelection = (newRowSelectionModel) => {
    console.log(newRowSelectionModel)
    setRowSelectionModel(newRowSelectionModel)
    let filteredRows = rows.filter((i) => newRowSelectionModel.includes(i.id))
    filteredRows = filteredRows.map((v) => pathname + '/' + v.Name)
    console.log(filteredRows)
    setSelectedFiles(filteredRows)
  }

  useEffect(() => {
    if (selectedFiles.length === 0) setRowSelectionModel([])
  }, [selectedFiles])

  const handleClick = (params, event, details) => {
    navigate(params.row.Path)
  }

  return (
    <DataGrid
      onRowClick={handleClick}
      autoHeight
      checkboxSelection
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
        sorting: {
          sortModel: [{ field: 'Name', sort: 'asc' }],
        },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      slots={{
        toolbar: CustomToolbar,
      }}
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
      onRowSelectionModelChange={handleRowSelection}
      rowSelectionModel={rowSelectionModel}
    />
  )
}
