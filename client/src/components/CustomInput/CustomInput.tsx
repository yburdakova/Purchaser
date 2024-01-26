import  { useState } from 'react';
import styles from './CustomInput.module.css'
import InputMask from 'react-input-mask';

import { CustomInputProps } from '../../data/types';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const CustomInput = ({ label, type, required, isMask, getValue, valueProps, ...props }: CustomInputProps) => {

  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(valueProps);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () =>{ 
    const phoneMask = "+7-___-___-__-__";
    setIsFocused(value !== phoneMask ? false : true )};
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (getValue) { 
      getValue(newValue); 
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className={styles.inputBox}>
      <div className={`${styles.floatingLabelInput} ${isFocused || value ? styles.focused : ''}`}>
        <InputMask
          {...props}
          required={required}
          type={showPassword ? 'text' : type}
          value={valueProps}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          mask={isMask? "+7 999 999-99-99": ""}
          className={`${styles.input} ${isFocused ? styles.hidePlaceholder : ''}`}
          placeholder=" " 
        />
        {type === 'password' && (
            <div onClick={toggleShowPassword} className={styles.togglePasswordButton}>
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </div>
          )}
        <label className={`${styles.label} ${value || isFocused ? styles.filled : ''}`}>
          {label}
        </label>
      </div>
    </div>
  )
};

export default CustomInput;
