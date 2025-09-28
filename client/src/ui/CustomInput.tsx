import { FaLock, FaUser } from "react-icons/fa";

interface CustomInputProps {
  type: string;
  name: string;
  id: string;
  placeholder: string;
}

export const CustomInput = (props: CustomInputProps) => {
  return (
    <div className="custom-input">
      <span className="custom-input__icon">
        {props.name == "login" ? <FaUser size={21} /> : <FaLock size={21} />}
      </span>
      <input
        className="custom-input__field"
        type={props.type}
        name={props.name}
        id={props.id}
        placeholder={props.placeholder}
      />
    </div>
  );
};
