import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, CssBaseline, Container, ThemeProvider, Box } from '@mui/material';

// Placeholder pages
const Login = React.lazy(() => import('./pages/Login'));
const Search = React.lazy(() => import('./pages/Search'));
const Booking = React.lazy(() => import('./pages/Booking'));
const Reviews = React.lazy(() => import('./pages/Reviews'));
const BookingHistory = React.lazy(() => import('./pages/BookingHistory'));
const Admin = React.lazy(() => import('./pages/Admin'));

// Auth context
const TEST_EMAIL = 'example@gmail.com';
const TEST_PASSWORD = '123456789';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => { },
});
export const useAuth = () => useContext(AuthContext);

import theme from './theme';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string, password: string) => {
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  const logout = () => setIsAuthenticated(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <Router>
          <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', textDecoration: 'none' }} component={Link} to="/">
                Travel<Box component="span" sx={{ color: 'text.primary' }}>Swift</Box>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {isAuthenticated && (
                  <>
                    <Button color="inherit" component={Link} to="/search">Search</Button>
                    <Button color="inherit" component={Link} to="/history">History</Button>
                    <Button color="inherit" component={Link} to="/reviews">Reviews</Button>
                    <Button color="inherit" component={Link} to="/admin">Admin</Button>
                  </>
                )}
                {isAuthenticated ? (
                  <Button variant="outlined" color="primary" onClick={logout} sx={{ ml: 2 }}>Logout</Button>
                ) : (
                  <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>
                )}
              </Box>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ py: 4, minHeight: 'calc(100vh - 64px)' }} className="page-container">
            <React.Suspense fallback={<Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">Loading...</Box>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/search" element={isAuthenticated ? <Search /> : <Navigate to="/login" />} />
                <Route path="/booking" element={isAuthenticated ? <Booking /> : <Navigate to="/login" />} />
                <Route path="/reviews" element={isAuthenticated ? <Reviews /> : <Navigate to="/login" />} />
                <Route path="/history" element={isAuthenticated ? <BookingHistory /> : <Navigate to="/login" />} />
                <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/search" />} />
              </Routes>
            </React.Suspense>
          </Container>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
