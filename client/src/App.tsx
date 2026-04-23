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
import { NewWorkerPage } from "./pages/NewWorkerPage";
import { WorkerApplicationsPage } from "./pages/WorkerApplicationsPage";
import { WorkerPasswordPage } from "./pages/WorkerPasswordPage";
import { WorkerProjectDetailPage } from "./pages/WorkerProjectDetailPage";
import { AdminWorkersPage } from "./pages/AdminWorkersPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";

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
        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute requiredRole="user">
              <Layout>
                <MyReviews />
              </Layout>
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/admin/new-worker"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <NewWorkerPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/applications"
          element={
            <ProtectedRoute requiredRole="worker">
              <Layout>
                <WorkerApplicationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/change-password"
          element={
            <ProtectedRoute requiredRole="worker">
              <Layout>
                <WorkerPasswordPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/applications/:id"
          element={
            <ProtectedRoute requiredRole="worker">
              <Layout>
                <WorkerProjectDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workers"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminWorkersPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminDashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
