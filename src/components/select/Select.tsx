import * as React from 'react'; 
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface SelectComponentProps {
    options: string[];
    value: string;
    onChange: (value: string) => void; 
  }

const SelectComponent: React.FC<SelectComponentProps> = ({ options, value, onChange }) => {

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <FormControl>
        <Select 
          displayEmpty
          value={value}
          onChange={handleChange}
          input={<OutlinedInput />}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {options.map((option) => (
            <MenuItem
            key={option} value={option}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectComponent;