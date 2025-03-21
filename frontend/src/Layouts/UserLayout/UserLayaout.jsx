import Header from "../../Components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";

import styles from "./UserLayout.module.css"

function UserLayout () {
    return (
        <div className={styles["grid-layout"]}>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default UserLayout;