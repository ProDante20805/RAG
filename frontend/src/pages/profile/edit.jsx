import { useState, useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Avatar,
  SvgIcon,
  Tabs,
  Tab,
  Button,
  Modal,
  InputBase,
  MenuItem,
  Badge,
  Select,
} from '@mui/material';
import { CameraAlt as CameraIcon } from '@mui/icons-material';
import { useAuth } from 'hooks/useAuth';
import { setAuth } from 'utils/setAuth';
import instance from 'utils/axios';
import useGlobalStore from 'utils/store';
import { ReactComponent as ReloadIcon } from '../../assets/svg/reload.svg';
import { ReactComponent as LeftArrowIcon } from '../../assets/svg/left_arrow.svg';
import { ReactComponent as LockIcon } from '../../assets/svg/lock.svg';

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

export default function ProfileEdit() {
  const { active_tab } = useGlobalStore();

  // const count = useGlobalStore((state) => state.active_tab);

  const {
    handleSubmit,
    register,
    setError,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [image, _setImage] = useState(null);
  const [avatar, setImageData] = useState(null);

  const [old_password, setOldPwd] = useState('');
  const [new_password, setNewPwd] = useState('');
  const [confirm_password, setConfirmPwd] = useState('');

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
  const inputFileRef = createRef(null);

  const handleOnChange = (event) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setImageData(newImage);
      setImage(URL.createObjectURL(newImage));
    }
  };

  const form = {
    club_name: '',
    coordinates: '',
    email: '',
    full_name: '',
    first_name: '',
    last_name: '',
    interest_size: 1,
    interest_type: 1,
    phone_number: '',
    plane_number: '',
    postal_code: '',
    rpas_number: '',
    user_name: '',
  };
  const [user_info, setInformation] = useState(form);
  const { user } = useAuth();
  const uid = user && user !== 'null' ? jwtDecode(user).id : null;

  useEffect(() => {
    setAuth(user);
    const getProfile = () => {
      instance
        .post('/profile/get')
        .then((res) => {
          const response = res.data;
          const full_name = response.full_name.split(' ');
          setInformation({
            ...user_info,
            first_name: full_name[0],
            last_name: full_name[1],
            user_name: response.user_name,
            email: response.email,
            phone_number: response.phone_number,
            postal_code: response.postal_code,
            rpas_number: response.rpas_number,
            plane_number: response.plane_number,
            coordinates: response.coordinates,
            club_name: response.club_name,
            interest_size: response.interest_size,
            interest_type: response.interest_type,
          });
        })
        .catch((err) => {
          if (err.response.status === 401) {
            navigate('/signin');
          }
          console.log('get user info error----', err);
        });
    };
    getProfile();
  }, [user]);

  useEffect(() => {
    setValue('first_name', user_info.first_name);
    setValue('user_name', user_info.user_name);
    setValue('last_name', user_info.last_name);
    setValue('email', user_info.email);
    setValue('phone_number', user_info.phone_number);
  }, [
    user_info.first_name,
    user_info.user_name,
    user_info.last_name,
    user_info.email,
    user_info.phone_number,
  ]);

  const [tab_value, setTabValue] = useState(active_tab);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // _setActiveTab(newValue);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangeModal = (e) => {
    switch (e.target.name) {
      case 'old_password':
        setOldPwd(e.target.value);
        break;

      case 'new_password':
        setNewPwd(e.target.value);
        break;

      case 'confirm_password':
        setConfirmPwd(e.target.value);
        break;

      default:
        break;
    }
  };

  const handleChange = (e) => {
    setInformation({ ...user_info, [e.target.name]: e.target.value });
  };

  const onSubmit = async (values) => {
    if (new_password !== confirm_password) {
      alert('New password must be unique with Confirm Password.');
    } else {
      instance
        .post('/profile/changePassword', {
          old_password,
          new_password,
        })
        .then((res) => {
          console.log('changed the password successful', res);
          handleClose();
        })
        .catch((err) => {
          console.log('error occured while change password', err);
          setError(
            'old_password',
            { type: 'server', message: 'Old Pssword is incorrect!' },
            { shouldFocus: true }
          );
          if (err.response.status === 401) {
            navigate('/signin');
          }
        });
    }
  };

  const onSave = async (values) => {
    try {
      console.log('value-----', values);
      const response = await instance.post('/profile/update', {
        ...user_info,
        ['full_name']: `${user_info.first_name} ${user_info.last_name}`,
      });

      if (response.err) {
        let error_name = null;
        const error_message = response.error.message;
        if (error_message.includes('Email')) {
          error_name = 'email';
        } else if (error_message.includes('phone_number')) {
          error_name = 'phone_number';
        }
        error_name !== null &&
          setError(
            error_name,
            { type: 'server', message: error_message },
            { shouldFocus: true }
          );
        console.log(errors);
      } else {
        console.log('updated info successful --', response);
        if (avatar !== null) {
          let formData = new FormData();
          formData.append('file', avatar);
          await instance
            .post('/profile/updateAvatar/edit', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((res) => {
              const result = res.data;
              console.log('avatar upload edit responsed-------------', result);
            })
            .catch((err) => {
              if (err.response.status === 401) {
                navigate('/signin');
              }
              console.log('avatar upload error', err);
            });
        }
        navigate(`/profile/detail`);
      }
    } catch (err) {
      console.log('updateprofile error occured---', err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100%', backgroundColor: 'primary.main' }}>
      <div className="inline-flex w-full justify-between pt-8 px-9 items-center">
        <div>
          <Link
            to={{ pathname: '/profile/detail' }}
            className="text-bg-primary"
          >
            <SvgIcon
              component={LeftArrowIcon}
              inheritViewBox
              sx={{ fontSize: '32px' }}
            ></SvgIcon>
          </Link>
        </div>
        <p className="text-bg-white text-ti !font-futura font-semibold text-center">
          Edit Profile
        </p>

        <div className="place-self-end mb-2">
          <Link to={{ pathname: '/profile/edit' }} className="text-bg-primary">
            <SvgIcon
              component={ReloadIcon}
              inheritViewBox
              sx={{ fontSize: '32px' }}
            ></SvgIcon>
          </Link>
        </div>
      </div>
      <div className="mt-6 h-full rounded-t-3xl  py-5 px-4 md:px-56 w-full bg-bg-white">
        <div className="flex justify-center items-center mt-4 w-full flex-col">
          <div className="flex justify-center items-center w-full">
            <Button component="label">
              <VisuallyHiddenInput
                type="file"
                ref={inputFileRef}
                accept=".jpg,.png"
                onChange={handleOnChange}
              />
              <Badge
                overlap="circular"
                className="bg-bg-white"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <CameraIcon className="text-bg-primary bg-bg-white rounded-full p-1" />
                }
              >
                <Avatar
                  src={
                    image ||
                    `${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${uid}.png`
                  }
                  sx={{ width: 70, height: 70 }}
                />
              </Badge>
            </Button>
          </div>

          <div className="w-full mt-4">
            <Tabs
              value={tab_value}
              onChange={handleTabChange}
              aria-label="basic tabs example"
              centered
              indicatorColor="bg_white"
            >
              <Tab
                sx={{ textTransform: 'none' }}
                label="User Info"
                className="!text-lg"
                {...a11yProps(0)}
              />
              <Tab
                sx={{ textTransform: 'none' }}
                label="Account Info"
                className="!text-lg"
                {...a11yProps(1)}
              />
            </Tabs>
          </div>
        </div>

        <CustomTabPanel value={tab_value} index={0}>
          <div className="input-field mb-4 text-bg-primary">
            <p className="text-text-gray my-2">Username</p>
            <InputBase
              value={user_info.user_name}
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
              value={user_info.first_name}
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
              value={user_info.last_name}
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
              value={user_info.phone_number}
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
              value={user_info.postal_code}
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

          <Button
            variant="contained"
            endIcon={<LockIcon />}
            color="button_gray"
            onClick={handleOpen}
            sx={{ padding: '12px' }}
          >
            Change password
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="absolute top-1/4 left-2/4 width-20 shadow w-80 -ml-40 rounded-xl bg-bg-white p-4 shadow">
              {open === true ? (
                <>
                  {' '}
                  <div className="input-field text-bg-primary">
                    <p className="text-text-gray my-2">Old Password</p>
                    <InputBase
                      type="password"
                      {...register('old_password', {
                        required: 'Required',
                      })}
                      name="old_password"
                      value={old_password}
                      onChange={handleChangeModal}
                      sx={{
                        borderRadius: '15px',
                        flex: 1,
                        py: 1,
                        px: 2,
                        backgroundColor: 'primary.text.input_bg',
                        width: 1,
                      }}
                    />
                    {errors.old_password && errors.old_password.message}
                  </div>
                  <div className="input-field text-bg-primary">
                    <p className="text-text-gray my-2">New Password</p>
                    <InputBase
                      type="password"
                      {...register('new_password', {
                        required: 'Required',
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,}$/,
                          message:
                            'Must contains at least 1 digit, 1 capital letter, 1 symbol and over 9 characters',
                        },
                      })}
                      name="new_password"
                      value={new_password}
                      onChange={handleChangeModal}
                      sx={{
                        borderRadius: '15px',
                        flex: 1,
                        py: 1,
                        px: 2,
                        backgroundColor: 'primary.text.input_bg',
                        width: 1,
                      }}
                    />
                    {errors.new_password && errors.new_password.message}
                  </div>
                  <div className="input-field text-bg-primary">
                    <p className="text-text-gray my-2">Confirm Password</p>
                    <InputBase
                      type="password"
                      {...register('confirm_password', {
                        required: 'Required',
                        validate: (value) =>
                          value === new_password ||
                          'The passwords do not match',
                      })}
                      name="confirm_password"
                      value={confirm_password}
                      onChange={handleChangeModal}
                      sx={{
                        borderRadius: '15px',
                        flex: 1,
                        py: 1,
                        px: 2,
                        backgroundColor: 'primary.text.input_bg',
                        width: 1,
                      }}
                    />
                    {errors.confirm_password && errors.confirm_password.message}
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className="flex justify-around mt-4">
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                  Change
                </Button>
              </div>
            </div>
          </Modal>
        </CustomTabPanel>
        <CustomTabPanel value={tab_value} index={1}>
          <div className="input-field mb-4 text-bg-primary">
            <p className="text-text-gray my-2">Email</p>
            <InputBase
              value={user_info.email}
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
          <div className="input-field mb-4">
            <p className="text-text-gray my-2">RPAS Number</p>
            <InputBase
              value={user_info.rpas_number}
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
              value={user_info.plane_number}
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
          </div>
          <div className="input-field mb-4">
            <p className="text-text-gray my-2">Coordinates</p>
            <InputBase
              value={user_info.coordinates}
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
              value={user_info.club_name}
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
          </div>

          <div className="input-field">
            <p className="text-text-gray my-2">What type of RPAS do you fly?</p>
            <Select
              className="w-full"
              name="interest_size"
              value={user_info.interest_size}
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
              value={user_info.interest_type}
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
        </CustomTabPanel>
        <div className="p-6">
          <Button
            variant="contained"
            size="medium"
            onClick={handleSubmit(onSave)}
            sx={{
              color: 'primary-main',
              borderRadius: 4,
              py: 2,
              width: 1,
              my: 3,
            }}
          >
            {`Save`}
          </Button>
        </div>
      </div>
    </Box>
  );
}
