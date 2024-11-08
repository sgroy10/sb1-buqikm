import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { STLViewer } from './components/STLViewer';
import { Landing } from './components/Landing';
import { Help } from './components/Help';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/viewer" 
          element={
            <ProtectedRoute>
              <STLViewer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}