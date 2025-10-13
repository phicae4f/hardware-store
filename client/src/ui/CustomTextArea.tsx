import type { TextareaHTMLAttributes } from "react"
import { MdOutlineDriveFileRenameOutline } from "react-icons/md"

// interface CustomTextAreaProps {
//     placeholder: string
// }

interface CustomTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  
}

export const CustomTextArea = (props: CustomTextAreaProps) => {
    const {placeholder, ...textAreaProps} = props
    return (
        <div className="custom-textarea">
            <textarea className="custom-textarea__field" name="textarea" placeholder={placeholder} {...textAreaProps}>
            </textarea>
            <span className="custom-textarea__icon"><MdOutlineDriveFileRenameOutline size={21}/></span>
        </div>
    )
}