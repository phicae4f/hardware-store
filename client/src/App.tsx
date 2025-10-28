import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import { MainPage } from "./pages/MainPage";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MyApplications } from "./pages/MyApplications";
import { AllApplications } from "./pages/AllApplications";
import { AllReviews } from "./pages/AllReviews";
import { MyReviews } from "./pages/MyReviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <MainPage />
            </Layout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute requiredRole="user">
              <Layout>
                <MyApplications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/my-reviews" element={<ProtectedRoute requiredRole="user">
          <Layout>
            <MyReviews />
          </Layout>
        </ProtectedRoute>} />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AllApplications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AllReviews />
              </Layout>
            </ProtectedRoute>
          }
         />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
