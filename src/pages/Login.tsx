import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      setError('');
      navigate('/search');
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      sx={{
        background: 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.05), transparent), radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.05), transparent)'
      }}
    >
      <Card sx={{
        minWidth: 400,
        p: 4,
        borderRadius: 4,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 800 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please enter your details to sign in
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoComplete="username"
              placeholder="example@gmail.com"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoComplete="current-password"
              sx={{ mb: 3 }}
            />
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Sign In
            </Button>
          </form>

          <Box mt={4} p={2} sx={{ bgcolor: 'background.default', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="caption" display="block" color="text.secondary" gutterBottom sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
              Prototyping Access
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              Email: example@gmail.com<br />
              Pass: 123456789
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 