import style from './InputField.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function InputField({ id, type, label, explicativeText, name, placeholder, icon }) {
    return (
        <div className={style["form-input-container"]}>
            <div className={style["input-label-container"]}>
                {icon && <FontAwesomeIcon icon={icon} className={style["input-icon"]} />}
                <label htmlFor={id}> {label} </label>
            </div>
            {explicativeText ? <small>{explicativeText}</small> : <></>}
            <input id={id} name={name} type={type} placeholder={placeholder}></input>
        </div>
    );
}

export default InputField;

