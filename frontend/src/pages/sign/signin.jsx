import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Sidenav as Sidebar } from 'layout/Sidebar';
import { LoadingButton } from '@mui/lab';
import { InputBase, SvgIcon } from '@mui/material';
import { ReactComponent as LogoIcon } from '../../assets/svg/logo1.svg';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import {
  GoogleLoginButton,
  MicrosoftLoginButton,
} from 'react-social-login-buttons';

import { useAuth } from 'hooks/useAuth';
import instance from 'utils/axios';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const { login, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    if (email === '') {
      setError(
        'email',
        { type: 'server', message: 'Required' },
        { shouldFocus: true }
      );
    } else if (pwd === '') {
      setError(
        'pwd',
        { type: 'server', message: 'Required' },
        { shouldFocus: true }
      );
    } else {
      console.log('hi');
      setLoading(!loading);
      const result = await login({ email, password: pwd });
      // const login = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess });
      console.log('result', result);
      if (result.error) {
        setError(
          'pwd',
          { type: 'server', message: result.error },
          { shouldFocus: true }
        );
        if (result.error === 'Verify email') {
          navigate('/verifyEmail', { state: { email } });
        }
      }
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    console.log('handleGoogleLoginSuccess called ---------');
    const access_token = tokenResponse.access_token;
    const payload = {
      access_token,
      email: 'test@test.com',
      password: 'testtest123',
    };
    const res = await instance.post('/auth/loginWithGoogle', payload);
    googleLogin(res.data.token);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
  });

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        clearErrors('email');
        break;

      case 'pwd':
        setPwd(e.target.value);
        clearErrors('pwd');
        break;

      default:
        break;
    }
  };

  return (
    <div className="w-full h-full overflow-y-scroll">
      <Sidebar color="white" />
      <div className="flex justify-center items-center w-full  bg-bg-primary py-20">
        <SvgIcon
          component={LogoIcon}
          inheritViewBox
          className="!text-[75px]"
        ></SvgIcon>
      </div>
      <div className="h-[65vh]  rounded-t-3xl bg-bg-white py-4 px-9 w-full -mt-5 ">
        <p className="text-ti !font-futura font-semibold flex justify-center content-center">
          Welcome Back!
        </p>

        {/* <FormGroup> */}
        <div className="input-field mb-4 border-radius-15 text-bg-primary">
          <p className="text-base text-text-gray my-2">Email</p>
          <InputBase
            id="fullWidth"
            autoFocus={true}
            value={email}
            name="email"
            type="email"
            {...register('email', {
              // required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'invalid email address',
              },
            })}
            onChange={handleChange}
            sx={{
              borderRadius: '15px',
              flex: 1,
              py: 1,
              px: 2,
              backgroundColor: 'primary.text.input_bg',
              width: 1,
            }}
          />
          {errors.email && errors.email.message}
        </div>
        <div className="input-field text-bg-primary">
          <p className="text-base text-text-gray my-2">Password</p>
          <InputBase
            name="pwd"
            type="password"
            // {...register('pwd', {
            //   required: 'Required',
            // })}
            value={pwd}
            onChange={handleChange}
            sx={{
              borderRadius: '15px',
              flex: 1,
              py: 1,
              px: 2,
              backgroundColor: 'primary.text.input_bg',
              width: 1,
            }}
          />
          {errors.pwd && errors.pwd.message}
        </div>

        <LoadingButton
          variant="contained"
          size="medium"
          loading={loading}
          loadingIndicator="Signin..."
          onClick={handleSubmit(onSubmit)}
          sx={{
            color: 'primary-main',
            borderRadius: 4,
            py: 2,
            width: 1,
            my: 3,
          }}
        >
          {`Sign In`}
        </LoadingButton>

        <p className="flex justify-center items-center mt-2 text-bg-primary">
          <Link to={{ pathname: '/forgot' }} className="text-bg-primary ml-1">
            Forgot your password?
          </Link>
        </p>
        <p className="flex justify-center items-center mt-4 pb-4 text-text-gray">
          Don't have an account?
          <Link to={{ pathname: '/signup' }} className="text-bg-primary ml-1">
            Register
          </Link>
        </p>
        {/* </FormGroup> */}
      </div>
    </div>
  );
}
