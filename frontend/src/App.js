import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasicLayout } from './Layouts';
import { NotFound, Home, Login, Register, PostForm, Categories } from './Pages';
import { PrivateRoute } from './Components';

function App() {

  let isAuth = true; // TESTING

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<BasicLayout isAuth={ isAuth } />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* pruebas */}
          <Route path="home" element={<Home />} />  
          <Route path="categories" element={<Categories />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateRoute isAuth={ isAuth } />}>
          <Route path="/" element={<BasicLayout isAuth={ isAuth } />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="post-form" element={<PostForm />} />
          </Route>
        </Route>

        {/* Página de error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
