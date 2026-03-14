import { Routes, Route, Navigate } from 'react-router-dom';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Family Tree V2</h1>
              <p className="text-gray-600">Welcome to your family tree</p>
            </div>
          </div>
        }
      />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl text-gray-600">404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
}
