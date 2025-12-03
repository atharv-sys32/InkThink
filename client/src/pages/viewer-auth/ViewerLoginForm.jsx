import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphql/Auth';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function ViewerLoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const [login] = useMutation(LOGIN_MUTATION);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      const response = await login({
        variables: {
          email: values.email,
          password: values.password
        }
      });

      if (response.data?.login) {
        const token = response.data.login;
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');

        toast.success('Login successful!');
        setStatus({ success: true });
        setSubmitting(false);

        navigate('/blog');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      setStatus({ success: false });
      setErrors({ submit: error.message || 'Login failed' });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={handleLogin}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Link component={RouterLink} to="/blog" variant="body2" color="text.secondary">
                    Continue as guest
                  </Link>
                  <Link component={RouterLink} to="/" variant="body2" color="primary">
                    Back to home
                  </Link>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
