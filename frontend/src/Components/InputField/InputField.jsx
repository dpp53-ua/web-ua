import styles from './InputField.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function InputField({ id, type, label, explicativeText, name, placeholder, icon, onChange, arrOptions }) {
    let inputElement;

    if (type === "textarea") {
        inputElement = (
            <textarea id={id} name={name} placeholder={placeholder} onChange={onChange} />
        );
    } else if (type === "select") {
        inputElement = (
            <select id={id} name={name} onChange={onChange}>
                {arrOptions?.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    } else {
        inputElement = (
            <input id={id} name={name} type={type} placeholder={placeholder} onChange={onChange} />
        );
    }

    return (
        <div className={styles["input-container"]}>
            <div>
                {icon && <FontAwesomeIcon className={styles["font-icon"]} icon={icon} />}
                <label htmlFor={id}>{label}</label>
            </div>
            {explicativeText && <small>{explicativeText}</small>}
            {inputElement}
        </div>
    );
}

export default InputField;
