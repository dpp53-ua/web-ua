import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasicLayout } from './Layouts';
import { NotFound, Home, Login, Register, PostForm, Categories, Detail, Profile, ProfileConfiguration, MyAssets, MyDownloads, SearchResults, Support } from './Pages';
import { PrivateRoute } from './Components'; // Importar PrivateRoute


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="home" element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="detail" element={<Detail />} />
          <Route path="detail/:id" element={<Detail />} />
          {/*<Route path="buscar/:idCategoria" element={<SearchResults />} />   */}
          <Route path="/buscar" element={<SearchResults />} />
          <Route path="/support" element={<Support />} />

          {/* Rutas privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="post-form" element={<PostForm />} />
            <Route path="post-form/:id" element={<PostForm />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile-configuration" element={<ProfileConfiguration />} />
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
