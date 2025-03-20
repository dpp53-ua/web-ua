import { faGlobe } from "@fortawesome/free-solid-svg-icons"
import { faCopyright } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "./Footer.module.css"

export default function Footer() {
    return(
        <footer className={styles["footer-basic"]}>
            <div className={styles["language-div"]}><FontAwesomeIcon icon={faGlobe}/><p>Español</p></div>
            <p>Copyright <FontAwesomeIcon icon={faCopyright}/> 2025. All rights reserved.</p>
        </footer>
    )
}