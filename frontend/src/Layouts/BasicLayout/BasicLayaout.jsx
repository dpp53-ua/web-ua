import { Outlet } from "react-router-dom";
import { Header, Footer } from '../../Components';

import styles from "./BasicLayout.module.css"

function BasicLayout () {
    return (
        <>
            <Header/>
            <main className={styles["main-container"]}>
                <Outlet />
            </main>
            <Footer/>
        </>
    );
}

export default BasicLayout;