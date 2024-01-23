import  { SetStateAction, useState } from 'react';
import styles from './CustomInput.module.css'
import { CustomInputProps } from '../../data/types';

const CustomInput = ({ label, type, ...props }: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value.length !== 0 ? true : false);
  const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => setValue(e.target.value);

  return (
    <div className={`${styles.floatingLabelInput} ${isFocused || value ? styles.focused : ''}`}>
    <input
      {...props}
      type={type}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`${styles.input} ${isFocused ? styles.hidePlaceholder : ''}`}
      placeholder=" " 
    />
    <label className={`${styles.label} ${value || isFocused ? styles.filled : ''}`}>
      {label}
    </label>
    </div>
  );
};

export default CustomInput;
