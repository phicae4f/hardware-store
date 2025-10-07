import { MdOutlineDriveFileRenameOutline } from "react-icons/md"

interface CustomTextAreaProps {
    placeholder: string
}

export const CustomTextArea = (props: CustomTextAreaProps) => {
    return (
        <div className="custom-textarea">
            <textarea className="custom-textarea__field" name="textarea" placeholder={props.placeholder}>
            </textarea>
            <span className="custom-textarea__icon"><MdOutlineDriveFileRenameOutline/></span>
        </div>
    )
}