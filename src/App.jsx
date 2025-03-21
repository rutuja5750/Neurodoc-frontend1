import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import LayoutPage from "./layouts/LayoutPage.jsx";
import { authService } from "./services/user.service";
import RegisterPage from "./pages/RegisterPage";



// Protected Route component
const AuthProvider = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};


function App() {
  return (

    <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>}/>

          <Route path="/" element={<LayoutPage/>}/>

          {/* Protected routes */}

          {/* <Route 
            path="/"
            element={<AuthProvider><LayoutPage/></AuthProvider>}
          >
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<h1>Home Page</h1>} />

          </Route> */}
          
        </Routes>
    </BrowserRouter>
  )
}

export default App
