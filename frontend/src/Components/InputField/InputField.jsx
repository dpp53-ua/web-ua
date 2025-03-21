import styles from './InputField.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function InputField({ id, type, label, explicativeText, name, placeholder, icon }) {
    return (
        <div className={styles["input-container"]}>
            <div>
                {icon && <FontAwesomeIcon className={styles["font-icon"]} icon={icon}/>}
                <label htmlFor={id}> {label} </label>
            </div>
            {explicativeText ? <small>{explicativeText}</small> : <></>}
            <input id={id} name={name} type={type} placeholder={placeholder}></input>
        </div>
    );
}

export default InputField;

