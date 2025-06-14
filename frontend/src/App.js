import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasicLayout, UserLayout } from './Layouts';
import { NotFound, Home, Login, Register, Placeholder } from './Pages';
import { PrivateRoute } from './Components';

function App() {

  let isAuth = false; // TESTING

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Login />} />
          <Route path="Login" element={<Login />} />
          <Route path="Register" element={<Register />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateRoute isAuth={ isAuth } />}>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="Home" element={<Home />} />
            <Route path="Placeholder" element={<Placeholder />} />
          </Route>
        </Route>

        {/* Página de error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
