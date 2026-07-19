import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Home } from './pages/Home';
import { Listings } from './pages/Listings';
import { ListingDetail } from './pages/ListingDetail';
import { Interpreters } from './pages/Interpreters';
import { Columns } from './pages/Columns';
import { ColumnDetail } from './pages/ColumnDetail';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Login } from './pages/Login';
import { SignupChoice } from './pages/SignupChoice';
import { SignupSeeker } from './pages/SignupSeeker';
import { SignupAgent } from './pages/SignupAgent';
import { MyRequests } from './pages/MyRequests';
import { AgentDashboard } from './pages/dashboard/AgentDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';

export function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/interpreters" element={<Interpreters />} />
          <Route path="/columns" element={<Columns />} />
          <Route path="/columns/:id" element={<ColumnDetail />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupChoice />} />
          <Route path="/signup/seeker" element={<SignupSeeker />} />
          <Route path="/signup/agent" element={<SignupAgent />} />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute role="seeker">
                <MyRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent"
            element={
              <ProtectedRoute role="agent">
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
