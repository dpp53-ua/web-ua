import styles from "./Button.module.css";

export default function Boton( { type, variant, label, onClickFunction } ) {

    return (
        <button type={type} className={styles[variant]} onClick={onClickFunction}>{label}</button>
    );
}