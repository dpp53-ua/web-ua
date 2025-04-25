import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasicLayout } from './Layouts';
import { NotFound, Home, Login, Register, PostForm, Categories, Detail, Profile, ProfileConfiguration, MyAssets, MyDownloads } from './Pages';
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
          <Route path="home" element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="detail" element={<Detail />} />
        </Route>

        {/* Rutas privadas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="post-form" element={<PostForm />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile-configuration" element={<ProfileConfiguration/>} />
            <Route path="my-assets" element={<MyAssets />} />
            <Route path="my-downloads" element={<MyDownloads />} />
          </Route>
        </Route>

        {/* Página de error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
