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
    ...rest
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
        {...rest}
      />
    );
  } else if (type === "select") {
    inputElement = (
      <select
        id={id}
        name={name}
        onChange={onChange}
        defaultValue={value || "DEFAULT"}
        ref={ref}
        className={
          value === "DEFAULT" ? styles["select-placeholder"] : ""
        }
        {...rest}
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
        multiple
        {...rest}
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
