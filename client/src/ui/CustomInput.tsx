import type { InputHTMLAttributes } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { MdOutlineMailOutline, MdOutlinePhone } from "react-icons/md";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  
}

export const CustomInput = (props: CustomInputProps) => {
  const {type, name, ...inputProps} = props

  const getIcon = () => {
    switch (name) {
      case "login":
        return <FaUser size={21} /> 
      case "password":
        return <FaLock size={21} />
      case "client_name":
        return <FiUser size={21} /> 
      case "email":
        return <MdOutlineMailOutline size={21} />
      case "tel":
      case "phone":
        return <MdOutlinePhone size={21}/>
      default:
        return <FaUser size={21} /> 
    }
  }
  return (
    <div className="custom-input">
      <span className="custom-input__icon">
        {getIcon()}
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
