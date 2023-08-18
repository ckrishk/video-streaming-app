import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { LoginStatus, LoginStatusContext } from '../../App';


export default function SignIn() {
  const  { login, user, setLogin, setUser }= React.useContext(LoginStatusContext) as LoginStatus;
  const [errrorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();
  const theme = createTheme();

  const handleSubmit = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    const { data } = await axios.post("http://localhost:3000/api/v1/user/signin", form);
    console.log('user=>', data);
    if (data.status === parseInt('401')) {
      setErrorMessage(data.response)
    } else {
      localStorage.setItem('token', data.token);
      await setLogin(true);
      await setUser(data.email)
      navigate('/videos');
    }
  };

  React.useEffect(() => {
      setLogin(false);
      localStorage.removeItem('token');
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{marginTop: 8,display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component="h1" variant="h5"> Sign in </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus/>
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password"/>
            <Typography component="p" color="red"> {errrorMessage} </Typography>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Sign In </Button>
            <Grid container>
              <ForgotPasswordGrid/>
              <SignUpGrid/>
            </Grid>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
  );
}

const ForgotPasswordGrid:React.FC<{}> = () => {
  return (
    <Grid item xs>
    {/* <>TODO:// Create a Forgot Password functionality</> */}
    <Link href="/SignUp" variant="body2"> 
      Forgot password?
    </Link>
  </Grid>
  )
}

const SignUpGrid:React.FC<{}> = () => {
  return(
    <Grid item>
    <Link href="SignUp" variant="body2">
      {"Don't have an account? Sign Up"}
    </Link>
  </Grid>
  )
}