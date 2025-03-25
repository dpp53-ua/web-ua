import styles from "./Button.module.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// export default function Boton( { type, variant, label, onClickFunction, icon, to} ) {
//   const buttonContent = (
//     <button type={type} className={styles[variant]} onClick={onClickFunction}>
//       {icon && <FontAwesomeIcon icon={icon} className={styles.icon} />}
//       {label}
//     </button>
//   );

//   // Si to está presente, usamos <Link>, sino, solo mostramos el botón sin redirección.
//   return to ? <Link to={to}>{buttonContent}</Link> : buttonContent;
// }

export default function Boton({ type, variant, label, onClickFunction, onChangeFunction, icon, to }) {
  const buttonContent = (
    <button type={type} className={styles[variant]} onClick={onClickFunction}>
      {icon && <FontAwesomeIcon icon={icon} className={styles.icon} />}
      {label && <span>{label}</span>} {/* Ahora el texto está dentro de un <span> */}
    </button>
  );

  return to ? <Link to={to}>{buttonContent}</Link> : buttonContent;
}
