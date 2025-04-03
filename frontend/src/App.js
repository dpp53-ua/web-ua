import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasicLayout } from './Layouts';
import { NotFound, Home, Login, Register, Placeholder, Categories } from './Pages';
import { NotFound, Home, Login, Register, PostForm } from './Pages';
import { PrivateRoute } from './Components';

function App() {

  let isAuth = true; // TESTING
  let isAuth = true; // TESTING

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<BasicLayout isAuth={ isAuth } />}>
          <Route index element={<Login />} />
          <Route path="Login" element={<Login />} />
          <Route path="Register" element={<Register />} />
          {/* pruebas */}
          <Route path="Home" element={<Home />} />  
          <Route path="Categories" element={<Categories />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateRoute isAuth={ isAuth } />}>
          <Route path="/" element={<BasicLayout isAuth={ isAuth } />}>
            <Route index element={<Home />} />
            <Route path="Home" element={<Home />} />
            <Route path="PostForm" element={<PostForm />} />
          </Route>
        </Route>

        {/* Página de error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
