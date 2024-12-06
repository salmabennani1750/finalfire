import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { TextField, Button, Typography } from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { auth } from './firebase';

const SignUpForm = ({ closeModal, role, switchToSignIn, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const apiUrl = 'https://backend-documents-api-d9ehb3dfdzg4grey.francecentral-01.azurewebsites.net';

  const storeUserInDb = async (user, rawPassword = '') => {
    try {
      const payload = {
        uid: user.uid,
        email: user.email,
        role,
        name: user.displayName || null,
        password: rawPassword || null,
      };

      const response = await axios.post(`${apiUrl}/api/users`, payload);

      if (response.status === 201) {
        setSuccessMessage('Utilisateur enregistré avec succès.');
        return response.data;
      } else {
        throw new Error('Erreur lors de l’enregistrement.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’enregistrement.');
    }
  };

  const handleEmailPasswordSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await storeUserInDb(user, password);
      onLogin(user);
      closeModal();
    } catch (err) {
      setError('Erreur lors de l’inscription.');
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await storeUserInDb(user);
      onLogin(user);
      closeModal();
    } catch {
      setError('Erreur lors de l’inscription avec Google.');
    }
  };

  const handleGitHubSignUp = async () => {
    const provider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await storeUserInDb(user);
      onLogin(user);
      closeModal();
    } catch {
      setError('Erreur lors de l’inscription avec GitHub.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Sign Up as {role === 'student' ? 'Student' : 'Teacher'}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <Button variant="outlined" color="primary" startIcon={<GoogleIcon />} onClick={handleGoogleSignUp}>
          Sign up with Google
        </Button>
        <Button variant="outlined" color="inherit" startIcon={<GitHubIcon />} onClick={handleGitHubSignUp}>
          Sign up with GitHub
        </Button>
      </Box>
      <form onSubmit={handleEmailPasswordSignUp}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {successMessage && (
        <Typography color="success" align="center" sx={{ mt: 2 }}>
          {successMessage}
        </Typography>
      )}
      <Typography align="center" sx={{ mt: 2 }}>
        Already have an account? <Button onClick={switchToSignIn}>Sign In</Button>
      </Typography>
    </Box>
  );
};

export default SignUpForm;
