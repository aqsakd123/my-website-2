import { Specfication } from '@app/api/memo/memo-api'
import TextInputField from '@app/components/common/TextInputField/TextInputField'
import { Search } from '@mui/icons-material'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import React from 'react'
import styled from 'styled-components'

const StyledBox = styled(Box)`
  position: absolute;
  z-index: 100;
  top: 170px;
  right: 0;
  opacity: 0.7;
`

const StyledProp = styled(Box)`
  padding: 8px;

  .search-submit {
    border-radius: 22px;
  }
`
type FormProps = {
  specification: Specfication
  setSpecification: (value: Specfication) => void
}

const SearchButton: React.FC<FormProps> = (props: FormProps) => {
  const { specification, setSpecification } = props

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [name, setName] = React.useState<string | undefined>(specification?.name)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSearch = () => {
    setSpecification({ ...specification, name: name })
  }

  const open = Boolean(anchorEl)
  const id = open ? 'search-popover' : undefined

  return (
    <StyledBox>
      <Button className='search-btn' variant='contained' size='large' onClick={handleClick}>
        <Search />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <StyledProp className='container-box'>
          <TextInputField
            label='Name'
            variant='outlined'
            labelWidth={50}
            autoFocus
            fullWidth
            id='name-search-box'
            name='name'
            value={name}
            onChange={setName}
          />
          <Button
            startIcon={<Search />}
            variant='outlined'
            fullWidth
            onClick={handleSearch}
            className='search-submit'
          >
            Search
          </Button>
        </StyledProp>
      </Popover>
    </StyledBox>
  )
}

export default SearchButton
