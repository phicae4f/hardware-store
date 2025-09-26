
interface CustomInputProps {
    type: string,
    name: string,
    id: string,
    placeholder: string
}


export const CustomInput = (props: CustomInputProps) => {
    return (
        <input className="custom-input" type={props.type} name={props.name} id={props.id} placeholder={props.placeholder}/>
    )
}