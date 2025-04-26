import { forwardRef } from 'react';
import styles from './InputField.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputField = forwardRef((props, ref) => {
  const {
    id,
    type,
    label,
    explicativeText,
    name,
    placeholder,
    icon,
    onChange,
    arrOptions,
    value,
  } = props;

  let inputElement;

  if (type === "textarea") {
    inputElement = (
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        ref={ref}
      />
    );
  } else if (type === "select") {
    inputElement = (
      <select
        id={id}
        name={name}
        onChange={onChange}
        defaultValue={"DEFAULT"}
        ref={ref}
      >
        <option value="DEFAULT" disabled>
          Seleccione una opción ...
        </option>
        {arrOptions?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else {
    inputElement = (
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        ref={ref}
      />
    );
  }

  return (
    <div className={styles["input-container"]}>
      <div>
        {icon && (
          <FontAwesomeIcon className={styles["font-icon"]} icon={icon} />
        )}
        <label htmlFor={id}>{label}</label>
      </div>
      {explicativeText && <small>{explicativeText}</small>}
      {inputElement}
    </div>
  );
});

export default InputField;
