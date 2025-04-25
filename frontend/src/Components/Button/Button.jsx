// Button.jsx
import styles from "./Button.module.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Button({
  type = "button", // Default: button
  variant,
  label,
  onClick, // 👈 Nombre estándar
  icon,
  to
}) {
  const buttonContent = (
    <button type={type} className={styles[variant]} onClick={onClick}>
      {icon && <FontAwesomeIcon icon={icon} className={styles.icon} />}
      {label && <span>{label}</span>}
    </button>
  );

  return to ? <Link to={to}>{buttonContent}</Link> : buttonContent;
}
