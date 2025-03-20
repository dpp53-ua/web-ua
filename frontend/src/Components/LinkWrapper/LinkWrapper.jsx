import style from "./LinkWrapper.module.css";
import { Link } from "react-router-dom";

function LinkWrapper({ to, innerText }) {
    return <Link className = { style["LinkWrapper"] } to= { to } > { innerText } </Link>
}

export default LinkWrapper;