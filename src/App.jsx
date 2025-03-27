import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import LayoutPage from "./layouts/LayoutPage.jsx";
import { authService } from "./services/user.service";
import RegisterPage from "./pages/RegisterPage";
import TMF_Viewer from "./pages/tmf_viewer/TMFViewer";
import HomePage from "./pages/HomePage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/toaster"


// Protected Route component
const AuthProvider = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};


function App() {

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routes>

            {/* Public routes */}
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>}/>

            {/* <Route path="/" element={<LayoutPage/>}/> */}

            {/* Protected routes */}

            <Route 
              path="/"
              element={<AuthProvider><LayoutPage/></AuthProvider>}
            >
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<HomePage/>} />
                <Route path="tmf-viewer" element={<TMF_Viewer/>} />

            </Route>
            
          </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
