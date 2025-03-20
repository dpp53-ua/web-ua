import { Outlet } from "react-router-dom";
import { Header, Footer } from '../../Components';

function BasicLayout () {
    return (
        <>
            <Header/>
            <main>
                <Outlet />
            </main>
            <Footer/>
        </>
    );
}

export default BasicLayout;