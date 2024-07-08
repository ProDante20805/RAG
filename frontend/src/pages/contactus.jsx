import { useState, useEffect } from 'react';
import { Box, Button, InputBase, SvgIcon } from '@mui/material';
import { useAuth } from 'hooks/useAuth';

import { setAuth } from 'utils/setAuth';
import instance from 'utils/axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { ReactComponent as LeftArrowIcon } from '../assets/svg/left_arrow.svg';

export default function ContactUs() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessge] = useState('');

  const [submit_status, setSubmitStatus] = useState(0);
  const [submitting_status, setSubmittingStatus] = useState(false);

  useEffect(() => {
    setAuth(user);
    const getInfo = () => {
      instance
        .post('/profile/get')
        .then((res) => {
          console.log('profile get responsed--', res);
          setFullname(res.data.full_name);
          setEmail(res.data.email);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            // navigate('/signin');
          }
          console.log('profile get error occured in contact us', err);
        });
    };
    if (user !== 'null' && user !== null) {
      getInfo();
    }
  }, []);

  useEffect(() => {
    setValue('fullname', fullname);
    setValue('email', email);
    setValue('message', message);
  }, [fullname, email, message]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'fullname':
        setFullname(e.target.value);
        break;

      case 'email':
        setEmail(e.target.value);
        break;

      case 'message':
        setMessge(e.target.value);
        break;

      default:
        break;
    }
  };

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    setSubmittingStatus(true);
    instance
      .post('/email/contactUs', {
        fullname,
        email,
        message,
      })
      .then((res) => {
        console.log('contact us respoensed', res);
      })
      .catch((err) => {
        // if (err.response.status === 401) {
        //   navigate('/signin');
        // }
        console.log('contact us error occured', err);
      })
      .finally(() => {
        setSubmittingStatus(false);
        setSubmitStatus(1);
      });
  };

  const goBack = () => {
    navigate(-1);
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100%',
      }}
    >
      <div className="flex w-full h-40 bg-bg-primary  pt-8 justify-between  px-9">
        <div>
          <button onClick={goBack}>
            <SvgIcon
              component={LeftArrowIcon}
              inheritViewBox
              sx={{ fontSize: '32px' }}
              className="text-bg-primary"
            ></SvgIcon>
          </button>
        </div>
        <p className="text-ti !font-futura  text-bg-white font-semibold">
          Contact Us
        </p>
        <p className="place-self-end mb-2 w-[32px]"></p>
      </div>
      <div className="absolute top-24 w-full px-9">
        <div className="bg-bg-white w-full rounded-3xl shadow-md py-12">
          {submit_status === 0 ? (
            <div className="flex-col px-4">
              <div className="input-field mb-4 text-bg-primary">
                <p className="text-text-gray my-2">Full Name</p>
                <InputBase
                  value={fullname}
                  name="fullname"
                  type="text"
                  {...register('fullname', {
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
                {errors.fullname && errors.fullname.message}
              </div>

              <div className="input-field mb-4 text-bg-primary">
                <p className="text-text-gray my-2">E-mail</p>
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

              <div className="input-field mb-4 text-bg-primary">
                <p className="text-text-gray my-2">Message</p>
                <InputBase
                  value={message}
                  multiline
                  rows={4}
                  name="message"
                  type="text"
                  {...register('message', {
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
                {errors.message && errors.message.message}
              </div>
              {submitting_status ? (
                <Button
                  disabled={true}
                  variant="contained"
                  size="medium"
                  sx={{
                    color: 'primary-main',
                    borderRadius: 4,
                    py: 2,
                    width: 1,
                    my: 3,
                  }}
                >
                  Submitting...
                  <CircularProgress size={16} color="bg_gray" />
                </Button>
              ) : (
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
                  {`Submit`}
                </Button>
              )}
            </div>
          ) : (
            <div className="px-6 flex-row jutify-center items-center">
              <p className="text-ti font-semibold !font-futura text-center font-semibold">
                Thank you!
              </p>
              <p className="text-base mt-8 font-medium">
                Your message is zooming through the digital skles and will land
                safely in our inbox. Our ground crew is already gearing up to
                get you a tailwing response. Keep on eye on your radar for our
                reply! <br />
                <br />
                In the meantime, feel free to keep navlgating throught RCPC.ai
                for more hight-flying content. We’re thrilled you’re part of our
                squadron. <br />
                <br />
                Over and out! <br />
                The RCPC.ai Team
              </p>
              <Button
                variant="contained"
                size="medium"
                onClick={goBack}
                sx={{
                  color: 'primary-main',
                  borderRadius: 4,
                  py: 2,
                  width: 1,
                  my: 3,
                }}
              >
                {`Okay`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}
