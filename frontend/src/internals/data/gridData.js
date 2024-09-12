import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'

import { SparkLineChart } from '@mui/x-charts/SparkLineChart'
import { formattedDateTime, humanFileSize } from '../../utils/utils'
import { Stack, Typography } from '@mui/material'
import { getIcon } from '../../utils/iconUtils'

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0)
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  })
  const daysInMonth = date.getDate()
  const days = []
  let i = 1
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`)
    i += 1
  }
  return days
}

function renderSparklineCell(params) {
  const data = getDaysInMonth(4, 2024)
  const { value, colDef } = params

  if (!value || value.length === 0) {
    return null
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType='bar'
        showHighlight
        showTooltip
        colors={['hsl(210, 98%, 42%)']}
        xAxis={{
          scaleType: 'band',
          data,
        }}
      />
    </div>
  )
}

function renderStatus(status) {
  const colors = {
    Online: 'success',
    Offline: 'default',
  }

  return <Chip label={status} color={colors[status]} size='small' />
}

export function renderAvatar(params) {
  if (params.value == null) {
    return ''
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  )
}

export const columns = [
  { field: 'pageTitle', headerName: 'Page Title', flex: 1.5, minWidth: 200 },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value),
  },
  {
    field: 'users',
    headerName: 'Users',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
  },
  {
    field: 'eventCount',
    headerName: 'Event Count',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'viewsPerUser',
    headerName: 'Views per User',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'averageTime',
    headerName: 'Average Time',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'conversions',
    headerName: 'Daily Conversions',
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
]

export const headCells = [
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
