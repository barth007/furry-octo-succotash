import { FormControl, MenuItem, Select } from '@mui/material';
import './Header.css';


function Header({ChangeCall, countryName, allCountries}) {

  return (
    <div className='header'>
        <h1 >covid 19 TRACKER</h1>
      <FormControl className='header__dropdown'>
         <Select
          variant='outlined'
          value={countryName} onChange={ChangeCall}>
            <MenuItem value={countryName}>Worldwide</MenuItem>
            {
              allCountries.map((country)=>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
       
         </Select>


      </FormControl>
    </div>
  )
}

export default Header