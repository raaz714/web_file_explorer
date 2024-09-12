import { useContext } from 'react'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { PathContext } from '../contexts/PathContext'

export default function Search() {
  const { fetchSearchResults } = useContext(PathContext)

  const onSearchInputChange = (e) => {
    const query = e.target.value
    fetchSearchResults(query, 10)
  }

  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant='outlined'>
      <OutlinedInput
        size='small'
        id='search'
        placeholder='Search…'
        onChange={onSearchInputChange}
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position='start' sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize='small' />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  )
}
