import styles from "./Button.module.css";

export default function Boton( { type, onClickFunction } ) {

    let style = "enabled-button";
    let text = "";
    let disabled;
    switch ( type ) {
        case "reset":
            text = "Limpiar";
            disabled = false;
            break;
        case "submit":
            text = "Aceptar";
            disabled = false;
            break;
        case "cancel":
            text = "Cancelar"
            disabled = false;
            break;
        default:
            style = "disabled-button";
            text = "No disponible";
            disabled = true;
            break;
    }

    return (
        <button className={ styles[style] } type={ type } onClick={ onClickFunction } disabled={ disabled }> 
            { text }
        </button>
    );
}