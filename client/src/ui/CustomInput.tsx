import type { InputHTMLAttributes } from "react";
import { FaLock, FaUser } from "react-icons/fa";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  
}

export const CustomInput = (props: CustomInputProps) => {
  const {type, name, ...inputProps} = props
  return (
    <div className="custom-input">
      <span className="custom-input__icon">
        {props.name == "login" ? <FaUser size={21} /> : <FaLock size={21} />}
      </span>
      <input
        className="custom-input__field"
        type={type}
        name={name}
        {...inputProps}
      />
    </div>
  );
};
