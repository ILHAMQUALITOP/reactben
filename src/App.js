import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MapComponent from "./components/MapComponent";
import AuthProvider from "./auth/context/auth-provider";
import { AuthConsumer } from "./auth/context/auth-consumer";
import GuestGuard from "./auth/guards/guest-guard";
import AuthGuard from "./auth/guards/auth-guard";

function App() {
  return (
    <AuthProvider>
      <AuthConsumer>
        <Router>
          <Routes>
            {/* Guest Guard  */}
            <Route element={<GuestGuard />}>
              <Route path="/" element={<Home />} />
            </Route>
            {/* Guest Guard  */}

            {/* Protected Routes */}
            <Route element={<AuthGuard />}>
              <Route path="/mapcomponent" element={<MapComponent />} />
            </Route>
            {/* Protected Routes */}
          </Routes>
        </Router>
      </AuthConsumer>
    </AuthProvider>
  );
}

export default App;
