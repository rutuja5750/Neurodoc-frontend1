import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LayoutPage from "./layouts/LayoutPage";
import { userService } from "./services/user.service";
import RegisterPage from "./pages/RegisterPage";
import TMF_Viewer from "./pages/tmf_viewer/TMFViewer";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminGuard from "./components/guards/AdminGuard";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/toaster"
import DocumentViewer from "./pages/tmf_viewer/DocumentViewer";
// import ClinicalTrialsPage from "./pages/clinical-trials/ClinicalTrialsPage";
// import TestUpload from "./pages/clinical-trials/components/TestUpload";
import DocumentList from "./pages/documents/DocumentList";
import DocumentReview from "./pages/documents/DocumentReview";
import TMF_Library from "./pages/tmf_viewer/TMFLibrary";
// Protected Route component
const AuthProvider = ({ children }) => {
  const user = userService.getCurrentUser();
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
            {/* <Route path="clinical-trials" element={<ClinicalTrialsPage/>} /> */}
            {/* <Route path="test-upload" element={<TestUpload/>} /> */}
            <Route path="documents" element={<DocumentList/>} />
            <Route path="documents/:documentId/review" element={<DocumentReview/>} />

            {/* Protected routes */}
            <Route 
              path="/"
              element={<AuthProvider><LayoutPage/></AuthProvider>}
            >
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<HomePage/>} />
                <Route path="tmf-viewer" element={<TMF_Viewer/>} />
                <Route path="tmf-library" element={<TMF_Library/>} />
                <Route path="tmf-viewer/document/:id" element={<DocumentViewer/>} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={
                //   <AdminGuard>
                    <AdminDashboard />
                //   </AdminGuard>
                } />
          </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
