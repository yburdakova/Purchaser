import  { SetStateAction, useState } from 'react';
import styles from './CustomInput.module.css'
import { CustomInputProps } from '../../data/types';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';


const CustomInput = ({ label, type, ...props }: CustomInputProps) => {

  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value.length !== 0 ? true : false);
  const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => setValue(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className={`${styles.floatingLabelInput} ${isFocused || value ? styles.focused : ''}`}>
    <input
      {...props}
      type={showPassword ? 'text' : type}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
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
  );
};

export default CustomInput;
