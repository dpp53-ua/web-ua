import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasicLayout } from './Layouts';
import { NotFound, Home, Login, Register, PostForm, Categories, Detail, Profile,MyAssets } from './Pages';
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
          {/* pruebas */}
          <Route path="Home" element={<Home />} />  
          <Route path="Categories" element={<Categories />} />
          <Route path="Detail" element={<Detail />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateRoute isAuth={isAuth} />}>
          <Route path="/" element={<BasicLayout isAuth={isAuth} setIsAuth={setIsAuth} />}>
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
