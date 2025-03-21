import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./Footer.module.css"
import { faGlobe } from "@fortawesome/free-solid-svg-icons"
import { faCopyright } from "@fortawesome/free-regular-svg-icons"

export default function Footer() {
    return(
        <footer className={styles["footer-container"]}>
            <div>
                <FontAwesomeIcon icon={faGlobe} />
                <p>Español</p>
            </div>
            <div>
                <p>Copyright</p>
                <FontAwesomeIcon icon={faCopyright} />
                <p>2020. All rights reserved.</p>
            </div>
        </footer>
    )
}