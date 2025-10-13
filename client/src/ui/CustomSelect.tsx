import type { SelectHTMLAttributes } from "react"

interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  
}

export const CustomSelect = (props: CustomSelectProps) => {
    const {...selectProps} = props
    return (
    <select className="custom-select" name="service_type" required {...selectProps}>
        <option className="custom-select__title" value=""> Выберите тип услуги</option>
        
        <optgroup label="Ремонт">
            <option value="Ремонт квартиры">Ремонт квартиры</option>
            <option value="Ремонт дома">Ремонт дома</option>
            <option value="Ремонт офиса">Ремонт офиса</option>
        </optgroup>
        
        <optgroup label="Строительство">
            <option value="Строительство дома">Строительство дома</option>
            <option value="Строительство бани">Строительство бани</option>
            <option value="Строительство гаража">Строительство гаража</option>
        </optgroup>
        
        <optgroup label="Дизайн">
            <option value="Дизайн интерьера">Дизайн интерьера</option>
        </optgroup>
        
        <option value="Консультация">Консультация</option>
        <option value="Другое">Другое</option>
    </select>
    )
}