import Header from "../../Components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";

import styles from "./BasicLayout.module.css"

function BasicLayout ( {isAuth} ) {
    return (
        <div className={styles["flex-layout"]}>
            <Header isAuth = { isAuth } className={styles["header-layout"]} />
            <main className={styles["main-content"]}>
                <Outlet />
            </main>
            <Footer className={styles["footer-layout"]} />
        </div>
    );
}

export default BasicLayout;