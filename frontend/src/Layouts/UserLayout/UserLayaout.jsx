import Header from "../../Components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";

function UserLayout () {
    return (
        <>
        <Header userType="user" />
        <main>
            <Outlet />
        </main>
        <Footer />
        </>
    );
}

export default UserLayout;