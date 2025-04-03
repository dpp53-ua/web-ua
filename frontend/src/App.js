import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasicLayout } from './Layouts';
import { NotFound, Home, Login, Register, Placeholder, Profile } from './Pages';
import { PrivateRoute } from './Components';
import { useState } from "react"; 

function App() {
  const [isAuth, setIsAuth] = useState(true);
  //let isAuth = true; // TESTING

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<BasicLayout isAuth={isAuth} setIsAuth={setIsAuth} />}>
          <Route index element={<Login setIsAuth={setIsAuth} />} />
          <Route path="login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="register" element={<Register />} />
          <Route path="home" element={<Home />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateRoute isAuth={isAuth} />}>
          <Route path="/" element={<BasicLayout isAuth={isAuth} setIsAuth={setIsAuth} />}>
            <Route index element={<Home />} />
            <Route path="placeholder" element={<Placeholder />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Página de error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
