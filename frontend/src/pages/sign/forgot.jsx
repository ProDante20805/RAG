import { useState } from 'react';
import { Button, InputBase, SvgIcon } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
} from '@mui/icons-material';

import { useAuth } from 'hooks/useAuth';
import { useForm } from 'react-hook-form';
import instance from 'utils/axios';
import { ReactComponent as LeftArrowIcon } from '../../assets/svg/left_arrow1.svg';

export default function Forgot() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verification, setVerification] = useState('');
  const [pwd_show_flag, setPwdShowFlag] = useState(false);
  const [pwd1_show_flag, setPwd1ShowFlag] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');

  const {
    handleSubmit,
    register,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const handleContinue = () => {
    if (activeStep === 0) {
      const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const e = email_pattern.test(email);
      if (email === '') {
        setError(
          'email',
          { type: 'server', message: 'Required' },
          { shouldFocus: true }
        );
      } else {
        if (e === false) {
          setError(
            'email',
            { type: 'server', message: 'Invaild Email' },
            { shouldFocus: true }
          );
        } else {
          instance
            .post('/profile/generateCodeForPwd', { email })
            .then((res) => {
              if (res.data === false) {
                setError(
                  'email',
                  { type: 'server', message: `Email doesn't exist` },
                  { shouldFocus: true }
                );
              } else {
                clearErrors('email');
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
              }
            })
            .catch((err) => {
              console.log('forgot password error', err);
            });
        }
      }
    } else if (activeStep === 1) {
      if (verification === '') {
        setError(
          'verification',
          { type: 'server', message: 'Required' },
          { shouldFocus: true }
        );
      } else {
        clearErrors('verification');
        instance
          .post('/email/verifyEmail', {
            code: verification,
            email,
          })
          .then((res) => {
            if (res.data === false) {
              setError(
                'verification',
                { type: 'server', message: 'Wrong verification code' },
                { shouldFocus: true }
              );
            } else {
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
          })
          .catch((err) => {
            console.log('password verification error', err);
          });
      }
    } else {
      const password_pattern =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,}$/;
      const pass = password_pattern.test(password);
      if (pass === true && password === confirm_password) {
        clearErrors('confirm_password');
        instance
          .post('/profile/resetPassword', { email, password })
          .then((res) => {
            navigate('/signin');
          })
          .catch((err) => {
            console.log('reset password error', err);
          });
      } else {
        if (password === '') {
          setError(
            'password',
            { type: 'server', message: 'Required' },
            { shouldFocus: true }
          );
        } else {
          if (pass === false) {
            setError(
              'password',
              {
                type: 'server',
                message:
                  'Must contains at least 1 digit, 1 capital letter, 1 symbol and over 9 characters!',
              },
              { shouldFocus: true }
            );
          } else {
            clearErrors('password');
          }
        }

        if (confirm_password !== password) {
          setError(
            'confirm_password',
            { type: 'server', message: 'Passwords do not match' },
            { shouldFocus: true }
          );
        } else {
          clearErrors('confirm_password');
        }
      }
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/signin');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const onSubmit = async () => {
    console.log('onSubmit called---');
  };

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;

      case 'verification':
        setVerification(e.target.value);
        break;

      case 'password':
        setPassword(e.target.value);
        break;

      case 'confirm_password':
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleShowCasePwd = () => {
    setPwdShowFlag(!pwd_show_flag);
  };

  const handleShowCasePwd1 = () => {
    setPwd1ShowFlag(!pwd1_show_flag);
  };

  return (
    <div className="w-full h-screen px-9 pt-8">
      <div className="flex justify-between">
        <button onClick={handleBack}>
          <SvgIcon
            component={LeftArrowIcon}
            inheritViewBox
            sx={{ fontSize: '32px' }}
            className="text-bg-white"
          ></SvgIcon>
        </button>
        <p>{`${activeStep + 1} / 3`}</p>
      </div>
      {activeStep === 0 ? (
        <>
          <p className="text-ti font-semibold flex justify-center content-center !font-futura my-8 text-center">
            Input your email.
          </p>

          <div className="input-field mb-4 text-bg-primary">
            <p className="text-text-gray my-2">Email</p>
            <InputBase
              value={email}
              name="email"
              type="email"
              {...register('email', {
                required: 'Required',
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
          <Button
            variant="contained"
            size="medium"
            onClick={handleContinue}
            sx={{
              color: 'primary-main',
              borderRadius: 4,
              py: 2,
              width: 1,
              my: 3,
            }}
          >
            {`Continue`}
          </Button>
        </>
      ) : activeStep === 1 ? (
        <>
          <p className="text-ti font-semibold flex justify-center content-center !font-futura my-8 text-center">
            Input your verification code from your mail.
          </p>

          <div className="input-field mb-4 text-bg-primary">
            <p className="text-text-gray my-2">Verification Code</p>
            <InputBase
              value={verification}
              name="verification"
              type="text"
              {...register('verification', {
                required: 'Required',
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
            {errors.verification && errors.verification.message}
          </div>
          <Button
            variant="contained"
            size="medium"
            onClick={handleContinue}
            sx={{
              color: 'primary-main',
              borderRadius: 4,
              py: 2,
              width: 1,
              my: 3,
            }}
          >
            {`Continue`}
          </Button>
        </>
      ) : (
        <>
          <p className="text-ti font-semibold flex justify-center content-center !font-futura my-8 text-center">
            Reset a password
          </p>
          <div className="input-field text-bg-primary">
            <p className="text-text-gray my-2">Password</p>
            <div className="flex bg-text-input_bg rounded-2xl">
              <InputBase
                type={pwd_show_flag ? 'text' : 'password'}
                {...register('password', {
                  required: 'Required',
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,}$/,
                    message:
                      'Must contains at least 1 digit, 1 capital letter, 1 symbol and over 9 characters',
                  },
                })}
                name="password"
                value={password}
                onChange={handleChange}
                sx={{
                  borderRadius: '15px',
                  flex: 1,
                  py: 1,
                  px: 2,
                  width: 1,
                }}
              />
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                onClick={handleShowCasePwd}
              >
                {pwd_show_flag ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </IconButton>
            </div>
            {errors.password && errors.password.message}
          </div>

          <div className="input-field text-bg-primary">
            <p className="text-text-gray my-2">Confirm Password</p>
            <div className="flex bg-text-input_bg rounded-2xl">
              <InputBase
                type={pwd1_show_flag ? 'text' : 'password'}
                {...register('confirm_password', {
                  required: 'Required',
                })}
                name="confirm_password"
                value={confirm_password}
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
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                onClick={handleShowCasePwd1}
              >
                {pwd1_show_flag ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </IconButton>
            </div>
            {errors.confirm_password && errors.confirm_password.message}
          </div>
          <Button
            variant="contained"
            size="medium"
            onClick={handleContinue}
            sx={{
              color: 'primary-main',
              borderRadius: 4,
              py: 2,
              width: 1,
              my: 3,
            }}
          >
            {`Submit `}
          </Button>
        </>
      )}

      <div className="flex text-center justify-center absolute bottom-2 left-0 right-0 ml-auto mr-auto">
        <p className="text-base text-text-gray">
          Do you remember your password?{' '}
        </p>
        <Link to={'/signin'} className="text-bg-primary ml-1">
          Login
        </Link>
      </div>
    </div>
  );
}
