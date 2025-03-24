import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./Footer.module.css"
import { faGlobe } from "@fortawesome/free-solid-svg-icons"
import { faCopyright } from "@fortawesome/free-regular-svg-icons"

export default function Footer() {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.idioma}>
                <FontAwesomeIcon icon={faGlobe} />
                <p>Español</p>
            </div>
            <div className={styles.copyrightContainer}>
                <div className={styles.copyright}>
                    <p>Copyright</p>
                    <FontAwesomeIcon icon={faCopyright} />
                </div>
                <p>2020. All rights reserved.</p>
            </div>
        </footer>
    );
}
