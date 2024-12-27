'use client';
import * as React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    const newErrors = {
      username: username.trim() ? '' : 'Username is required',
      password: password.trim() ? '' : 'Password is required',
    };

    setErrors(newErrors);

    if (!newErrors.username && !newErrors.password) {
      // Login logic here
      if (username === 'admin' && password === 'password123') {
        alert('Login successful!');
      } else {
        setLoginError('Invalid username or password');
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: '90%', sm: '400px' },
          padding: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <AccountCircleIcon sx={{ fontSize: 64, color: '#388E3C' }} />
        </Box>
        <Typography
          component="h1"
          variant="h5"
          color="#388E3C"
          align="center"
          sx={{ mb: 1 }}
        >
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            User List
          </Box>{' '}
          Login
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Please log in to access your account.
        </Typography>

        {loginError && <Alert severity="error">{loginError}</Alert>}

        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              color: 'white',
              bgcolor: '#4CAF50',
              '&:hover': {
                bgcolor: '#388E3C',
              },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            type="button"
            fullWidth
            variant="outlined"
            color="primary"
            sx={{
              mt: 1,
              color: '#388E3C',
              borderColor: '#388E3C',
              '&:hover': {
                borderColor: '#2E7D32',
              },
            }}
            onClick={() => signIn('google', { callbackUrl: '/dashboard/view-data' })}
          >
            Login with Google
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            <Button size="small" sx={{ textTransform: 'none' }}>
              Forgot Password?
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
