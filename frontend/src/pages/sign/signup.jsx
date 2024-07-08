import { useState, createRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  Box,
  Typography,
  InputBase,
  Avatar,
  SvgIcon,
  MenuItem,
  Select,
  Badge,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
// import { LoadingButton } from '@mui/lab';
import {
  CameraAlt as CameraIcon,
  Search as SearchIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
} from '@mui/icons-material';
import { useAuth } from 'hooks/useAuth';
import { useForm } from 'react-hook-form';
import instance from 'utils/axios';
import { ReactComponent as LeftArrowIcon } from '../../assets/svg/left_arrow1.svg';

export default function SignUp() {
  const navigate = useNavigate();
  const [user_name, setUsername] = useState('');
  const [first_name, setFirstname] = useState('');
  const [last_name, setLastname] = useState('');
  const [phone_number, setPhonenumber] = useState('');
  const [email, setEmail] = useState('');
  const [rpas_number, setRPAS] = useState('');
  const [plane_number, setPlane] = useState('');
  const [coordinates, setCoordinate] = useState('');
  const [club_name, setClubname] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [interest_size, setInterestSize] = useState(1);
  const [interest_type, setInterestType] = useState(1);
  const [postal_code, setPostalCode] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [pwd_show_flag, setPwdShowFlag] = useState(false);
  const [pwd1_show_flag, setPwd1ShowFlag] = useState(false);
  const [image, _setImage] = useState(null);
  const [avatar, setImageData] = useState(null);
  const inputFileRef = createRef(null);

  const {
    handleSubmit,
    register,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('first_name', first_name);
    setValue('last_name', last_name);
    setValue('rpas_number', rpas_number);
    setValue('plane_number', plane_number);
  }, [first_name, last_name, rpas_number, plane_number]);

  const handleContinue = () => {
    if (activeStep === 0) {
      if (user_name !== '' && first_name !== '' && last_name !== '') {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        if (user_name === '') {
          setError(
            'user_name',
            { type: 'server', message: 'Required' },
            { shouldFocus: true }
          );
        } else {
          clearErrors('user_name');
        }
        if (first_name === '') {
          setError(
            'first_name',
            { type: 'server', message: 'Required' },
            { shouldFocus: true }
          );
        } else {
          clearErrors('first_name');
        }
        if (last_name === '') {
          setError(
            'last_name',
            { type: 'server', message: 'Required' },
            { shouldFocus: true }
          );
        } else {
          clearErrors('last_name');
        }
      }
    } else if (activeStep === 1) {
      const phone_pattern =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/;
      const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const p = phone_pattern.test(phone_number);
      const e = email_pattern.test(email);
      if (phone_number !== '' && p === true && email !== '' && e === true) {
        instance
          .post('/profile/isExistEmail', { email })
          .then((res) => {
            if (res.data === false) {
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
              setError(
                'email',
                { type: 'server', message: 'Email already exist' },
                { shouldFocus: true }
              );
            }
          })
          .catch((err) => {
            console.log('email test error', err);
          });
      } else {
        if (phone_number === '') {
          setError(
            'phone_number',
            { type: 'server', message: 'Required' },
            { shouldFocus: true }
          );
        } else {
          if (p === false) {
            setError(
              'phone_number',
              { type: 'server', message: 'Invaild Phone Number' },
              { shouldFocus: true }
            );
          } else {
            clearErrors('phone_number');
          }
        }
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
            clearErrors('email');
          }
        }
      }
    } else if (activeStep === 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 3) {
      const password_pattern =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,}$/;
      const pass = password_pattern.test(password);
      if (pass === true && password === confirm_password) {
        clearErrors('confirm_password');
        onSubmit();
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
    const result = await signup({
      user_name,
      full_name: `${first_name} ${last_name}`,
      phone_number,
      postal_code,
      email,
      rpas_number,
      plane_number,
      coordinates,
      club_name,
      password,
      interest_size,
      interest_type,
      role: ['user'],
      avatar,
    });

    console.log('response Result---', result);
  };

  const [loading, setLoading] = useState(false);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const { signup } = useAuth();

  const handleSelectedFile = async (event) => {
    setLoading(!loading);
    const files = Array.from(event.target.files);
    let formData = new FormData();
    if (files.length > 0) {
      files.forEach(async (e, i) => {
        formData.append('profile', e);
      });
      await instance
        .post('/profile/uploadProfilePDF', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          const result = res.data;
          if (result.length > 0) {
            let name_ary = result[0].split(' ');
            if (first_name === '' && name_ary[0] !== '') {
              setFirstname(name_ary[0]);
            }
            if (last_name === '' && result[0] !== '') {
              setLastname(name_ary.slice(-1));
            }
            if (result[1] !== '' && rpas_number === '') {
              setRPAS(result[1]);
            }
            if (result[2] !== '' && plane_number === '') {
              setPlane(result[2]);
            }
            if (result[3] !== '' && coordinates === '') {
              setCoordinate(result[3]);
            }
          } else {
            alert('network error occured');
          }
          console.log('pdf upload responsed-------------', res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'user_name':
        setUsername(e.target.value);
        break;

      case 'first_name':
        setFirstname(e.target.value);
        break;

      case 'last_name':
        setLastname(e.target.value);
        break;

      case 'phone_number':
        setPhonenumber(e.target.value);
        break;

      case 'email':
        setEmail(e.target.value);
        break;
      case 'rpas_number':
        setRPAS(e.target.value);
        break;
      case 'plane_number':
        setPlane(e.target.value);
        break;
      case 'coordinates':
        setCoordinate(e.target.value);
        break;

      case 'club_name':
        setClubname(e.target.value);
        break;

      case 'password':
        setPassword(e.target.value);
        break;

      case 'confirm_password':
        setConfirmPassword(e.target.value);
        break;
      case 'interest_size':
        setInterestSize(e.target.value);
        break;
      case 'interest_type':
        setInterestType(e.target.value);
        break;

      case 'postal_code':
        setPostalCode(e.target.value);
        break;

      default:
        break;
    }
  };

  const cleanup = () => {
    URL.revokeObjectURL(image);
    inputFileRef.current.value = null;
  };

  const setImage = (newImage) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

  const handleOnChange = (event) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setImageData(newImage);
      setImage(URL.createObjectURL(newImage));
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
        <p>{`${activeStep + 1} / 4`}</p>
      </div>
      {activeStep === 0 ? (
        <>
          <p className="text-ti font-semibold flex justify-center content-center !font-futura my-8">
            What's your name?
          </p>
          <div className="input-field mb-4 text-bg-primary ">
            <p className="text-text-gray my-2">Username</p>
            <InputBase
              value={user_name}
              name="user_name"
              {...register('user_name', {
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
            {errors.user_name && errors.user_name.message}
          </div>
          <div className="input-field mb-4 text-bg-primary">
            <p className="text-text-gray my-2">First Name</p>
            <InputBase
              value={first_name}
              name="first_name"
              {...register('first_name', {
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
            {errors.first_name && errors.first_name.message}
          </div>
          <div className="input-field mb-4 text-bg-primary">
            <p className="text-text-gray my-2">Last Name</p>
            <InputBase
              {...register('last_name', {
                required: 'Required',
              })}
              value={last_name}
              name="last_name"
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
            {errors.last_name && errors.last_name.message}
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
            Your contact information
          </p>
          <div className="input-field mb-4 text-bg-primary">
            <p className="text-text-gray my-2"> Phone Number</p>
            <InputBase
              {...register('phone_number', {
                required: 'Required',
                pattern: {
                  value:
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/,
                  message: 'invalid phone number',
                },
              })}
              value={phone_number}
              name="phone_number"
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
            {errors.phone_number && errors.phone_number.message}
          </div>

          <div className="input-field mb-4">
            <p className="text-text-gray my-2">Postal Code</p>
            <InputBase
              value={postal_code}
              name="postal_code"
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
          </div>
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
      ) : activeStep === 2 ? (
        <>
          <p className="text-ti font-semibold flex justify-center content-center !font-futura my-8 text-center">
            Your profile picture
          </p>
          <div className="flex justify-center items-center mt-4 w-full">
            <Button component="label">
              <VisuallyHiddenInput
                type="file"
                ref={inputFileRef}
                accept=".jpg,.png"
                onChange={handleOnChange}
              />
              <div className="rounded-full border-bg-primary border ">
                <Avatar
                  sx={{ width: 70, height: 70 }}
                  src={image || '/static/img/avatars/default-profile.svg'}
                >
                  <CameraIcon
                    sx={{ width: 70, height: 70 }}
                    className="text-bg-primary bg-bg-white rounded-full p-4"
                  />
                </Avatar>
              </div>
            </Button>
          </div>

          <Button
            component="label"
            variant="outlined"
            size="medium"
            sx={{
              color: 'primary-main',
              borderRadius: 4,
              py: 2,
              width: 1,
              my: 3,
            }}
          >
            <VisuallyHiddenInput
              type="file"
              ref={inputFileRef}
              accept=".jpg,.png"
              onChange={handleOnChange}
            />
            {image ? `Change` : `Upload`}
          </Button>
          {image ? (
            <Button
              variant="contained"
              size="medium"
              onClick={handleContinue}
              sx={{
                color: 'primary-main',
                borderRadius: 4,
                py: 2,
                width: 1,
              }}
            >
              {`Continue`}
            </Button>
          ) : (
            <Button
              disabled
              variant="contained"
              size="medium"
              sx={{
                color: 'primary-main',
                borderRadius: 4,
                py: 2,
                width: 1,
              }}
            >
              {`Continue`}
            </Button>
          )}
        </>
      ) : (
        <>
          <p className="text-ti font-semibold flex justify-center content-center !font-futura my-8 text-center">
            Create a password
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
            {`Create `}
          </Button>

          <div className="flex text-center justify-center">
            <p className="text-base text-text-gray">I agree to </p>
            <Link to={'/userpolicy'} className="text-bg-primary ml-1">
              the terms and privacy policy
            </Link>
          </div>
        </>
      )}

      <div className="flex text-center justify-center absolute bottom-2 left-0 right-0 ml-auto mr-auto">
        <p className="text-base text-text-gray">Already have an account? </p>
        <Link to={'/signin'} className="text-bg-primary ml-1">
          Login
        </Link>
      </div>

      {/* <FormGroup> */}

      {/* <div className="input-field mb-4">
          <p className="text-text-gray my-2">RPAS Number</p>
          <InputBase
            value={rpas_number}
            name="rpas_number"
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
        </div>
        <div className="input-field mb-4">
          <p className="text-text-gray my-2">Plane Registration</p>
          <InputBase
            value={plane_number}
            name="plane_number"
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
        </div> */}
      {/* <div className="input-field mb-4">
          <p className="text-text-gray my-2">Coordinates</p>
          <InputBase
            value={coordinates}
            name="coordinates"
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
        </div>
        <div className="input-field mb-4">
          <p className="text-text-gray my-2">Club Name</p>
          <InputBase
            value={club_name}
            name="club_name"
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
        </div> */}

      {/* <div className="input-field">
          <p className="text-text-gray my-2">What type of RPAS do you fly?</p>
          <Select
            className="w-full"
            name="interest_size"
            value={interest_size}
            onChange={handleChange}
          >
            <MenuItem value={1}>
              <span>Micro:</span>
              <span className="text-text-gray p-2">under 250 grams</span>
            </MenuItem>
            <MenuItem value={2}>
              <span>Regular:</span>
              <span className="text-text-gray p-2">up to 25kgs</span>
            </MenuItem>
            <MenuItem value={3}>
              <span>Giant Scale:</span>
              <span className="text-text-gray p-2">over 25kgs</span>
            </MenuItem>
          </Select>
        </div>

        <div className="input-field my-4">
          <Select
            name="interest_type"
            className="w-full"
            value={interest_type}
            // label="Age"
            onChange={handleChange}
          >
            <MenuItem value={1}>
              <span>Fixed-Wing</span>
            </MenuItem>
            <MenuItem value={2}>
              <span>Helicopters</span>
            </MenuItem>
            <MenuItem value={3}>
              <span>Drones (Rotary-Wing)</span>
            </MenuItem>
          </Select>
        </div>
        <Button
          variant="contained"
          size="medium"
          onClick={handleSubmit(onSubmit)}
          sx={{
            color: 'primary-main',
            borderRadius: 4,
            py: 2,
            width: 1,
            my: 3,
          }}
        >
          {`Create`}
        </Button> */}
      {/* <LoadingButton
          component="label"
          variant="outlined"
          size="medium"
          loading={loading}
          loadingIndicator="Loading…"
          sx={{
            color: 'primary-main',
            borderRadius: 4,
            py: 2,
            width: 1,
            my: 3,
          }}
        >
          Upload PDF
          <VisuallyHiddenInput
            type="file"
            multiple="multiple"
            accept=".pdf"
            onChange={handleSelectedFile}
          />
        </LoadingButton> */}

      {/* </FormGroup> */}
    </div>
  );
}
