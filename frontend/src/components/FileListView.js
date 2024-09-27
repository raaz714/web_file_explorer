import { useContext, useEffect, useState } from 'react'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import { SelectedFilesContext } from '../contexts/SelectedFilesContext'
import { Stack, Typography } from '@mui/material'
import { getIcon } from '../utils/iconUtils'
import { formattedDateTime, humanFileSize } from '../utils/utils'

const columns = [
  {
    field: 'Name',
    flex: 1,
    minWidth: 200,
    headerName: 'Name',
    renderCell: (params) => {
      return (
        <Stack
          sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
          direction='row'
          spacing={2}
        >
          {getIcon(params.row.Name, params.row.IsDir)}
          <Typography>{params.value}</Typography>
        </Stack>
      )
    },
  },
  {
    field: 'Size',
    flex: 1,
    minWidth: 100,
    headerName: 'Size',
    renderCell: (params) => humanFileSize(params.value),
  },
  {
    field: 'LastModified',
    flex: 1,
    minWidth: 100,
    headerName: 'Last Modified',
    renderCell: (params) => formattedDateTime(params.value),
  },
]

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  )
}

export const FileListView = ({ rows }) => {
  const [rowSelectionModel, setRowSelectionModel] = useState([])
  const navigate = useNavigate()
  const { selectedFiles, setSelectedFiles } = useContext(SelectedFilesContext)

  const handleRowSelection = (newRowSelectionModel) => {
    console.log(newRowSelectionModel)
    setRowSelectionModel(newRowSelectionModel)
    let filteredRows = rows.filter((i) => newRowSelectionModel.includes(i.id))
    filteredRows = filteredRows.map((v) => v.Path)
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
