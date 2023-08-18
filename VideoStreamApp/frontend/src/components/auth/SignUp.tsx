import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoginStatusContext, LoginStatus } from '../../App';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const  { setLogin }= React.useContext(LoginStatusContext) as LoginStatus;
  const [errrorMessage, setErrorMessage] = React.useState('');

  let navigate = useNavigate();
  const handleSubmit = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = {
      fullname : data.get('fname') +' '+ data.get('lname'),
      email: data.get('email'),
      password: data.get('password')
    };

    try{
    await axios.post("http://localhost:3000/api/v1/user/signup", form); 
    navigate('/')
    } catch (e){
      const error = e as AxiosError;
      const errorData = error.response?.data as {statusCode: number, message:string}
      if(errorData && errorData.statusCode === 400) setErrorMessage(errorData.message);
      if(errorData && errorData.statusCode === 409) setErrorMessage('Account with email id exist');
    }
  };

  React.useEffect(() => {
    setLogin(false);
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component="h1" variant="h5"> Sign up </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
               <NameDetailsGrid/>
               <EmailGrid/>
               <PassWordGrid/>
               <div>
               <Typography component="p" color="red"> {errrorMessage} </Typography>
               </div>
              <SignUpForPromotionGrid/>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Sign Up </Button>
            <ClickToLoginGrid/>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

const NameDetailsGrid = () => {
  return(
    <Grid item xs={12}>
    <TextField autoComplete="given-name" name="fname" required fullWidth id="fname" label="Fullname" autoFocus/>
  </Grid>
  )
}

const EmailGrid = () => {
  return(
  <Grid item xs={12}>
  <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email"/>
</Grid>
  )
}

const PassWordGrid = () => {
  return(
    <Grid item xs={12}>
    <TextField required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password"/>
  </Grid>
  )
}
const ClickToLoginGrid = () => {
  return(
    <Grid container justifyContent="flex-end">
    <Grid item>
      <Link href="/" variant="body2"> Already have an account? Sign in</Link>
    </Grid>
  </Grid>
  )
}

const SignUpForPromotionGrid = () => {
  return(
  <Grid item xs={12}>
  <FormControlLabel
    control={<Checkbox value="allowExtraEmails" color="primary" />}
    label="I want to receive inspiration, marketing promotions and updates via email."
   />
  </Grid>
  )
}