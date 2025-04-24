import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasicLayout } from './Layouts';
import { NotFound, Home, Login, Register, PostForm, Categories, Detail, Profile, MyAssets } from './Pages';
import {PrivateRoute} from './Components'; // Importar PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* Rutas públicas adicionales */}
          <Route path="Home" element={<Home />} />
          <Route path="Categories" element={<Categories />} />
          <Route path="Detail" element={<Detail />} />
        </Route>

        {/* Rutas privadas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<Home />} />
            <Route path="Home" element={<Home />} />
            <Route path="PostForm" element={<PostForm />} />
            <Route path="profile" element={<Profile />} />
            <Route path="MyAssets" element={<MyAssets />} />
          </Route>
        </Route>

        {/* Página de error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
