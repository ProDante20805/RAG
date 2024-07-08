import { useState, useEffect } from 'react';
import { Box, Button, InputBase, SvgIcon } from '@mui/material';

import instance from 'utils/axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { useAuth } from 'hooks/useAuth';
import { setAuth } from 'utils/setAuth';

import { ReactComponent as LeftArrowIcon } from '../../assets/svg/left_arrow.svg';

export default function InviteFriend() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [user_name, setUserName] = useState('');
  const [message, setMessge] = useState('');
  const [submit_status, setSubmitStatus] = useState(0);
  const [submitting_status, setSubmittingStatus] = useState(false);
  const { user } = useAuth();
  const getProfile = () => {
    instance
      .post('/profile/get')
      .then((res) => {
        setUserName(res.data.full_name);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate('/signin');
        }
        console.log('get user info error----', err);
      });
  };
  useEffect(() => {
    setAuth(user);
    getProfile();
  }, []);

  useEffect(() => {
    setValue('email', email);
    setValue('message', message);
  }, [email, message]);

  const handleChange = (e) => {
    switch (e.target.name) {
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
      .post('/email/sendEmail', {
        email,
        message,
        user_name,
      })
      .then((res) => {
        const invitation_count = localStorage.getItem('i_count');
        if (invitation_count) {
          localStorage.setItem('i_count', Number(invitation_count) + 1);
        } else {
          localStorage.setItem('i_count', 1);
        }
        console.log('Invitation count:', invitation_count);
        console.log('Invite friend respoensed', res);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate('/signin');
        }
        console.log('invite friend error occured', err);
      })
      .finally(() => {
        setSubmittingStatus(false);
        setSubmitStatus(1);
      });
  };

  const goBack = () => {
    setSubmitStatus(0);
    setEmail('');
    setMessge('');
  };

  const goHome = () => {
    navigate('/');
  };

  const goProfile = () => {
    navigate('/profile');
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
          <button onClick={goProfile}>
            <SvgIcon
              component={LeftArrowIcon}
              inheritViewBox
              sx={{ fontSize: '32px' }}
              className="text-bg-primary"
            ></SvgIcon>
          </button>
        </div>
        <p className="text-ti !font-futura  text-bg-white font-semibold">
          Invite a Friend
        </p>
        <p className="place-self-end mb-2 w-[32px]"></p>
      </div>
      <div className="absolute top-24 w-full px-9">
        <div className="bg-bg-white w-full rounded-3xl shadow-md py-12">
          {submit_status === 0 ? (
            <div className="flex-col px-4">
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
              <div className="text-base mt-8 font-medium">
                {localStorage.getItem('i_count') > 1 ? (
                  <>
                    <p>
                      You did it again! Another invitation has been successfully
                      sent out to join the{' '}
                      <a
                        className="text-text-hyperlink underline"
                        href="https://www.rcpilots.ai"
                      >
                        RCPC.ai
                      </a>{' '}
                      community. Your enthusiasm is contagious, and your efforts
                      to expand our squadron of RC enthusiasts are truly
                      commendable.
                    </p>
                    <br />
                    <p>
                      Every new member you bring into the fold helps our
                      community grow stronger and more vibrant. Thank you for
                      continuing to share the{' '}
                      <a
                        className="text-text-hyperlink underline"
                        href="https://www.rcpilots.ai"
                      >
                        RCPC.ai
                      </a>{' '}
                      spirit!
                    </p>
                    <br />
                    <p>
                      Keep those invitations flying, The{' '}
                      <a
                        className="text-text-hyperlink underline"
                        href="https://www.rcpilots.ai"
                      >
                        RCPC.ai
                      </a>{' '}
                      Team
                    </p>
                    <br />
                    <p>
                      P.S. Each new pilot you invite is another wing in our
                      formation. Let’s keep building our community together! 🛬
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Awesome. Thanks to you, another avid RC pilot is on their
                      way to discovering the vibrant world of{' '}
                      <a
                        className="text-text-hyperlink underline"
                        href="https://www.rcpilots.ai"
                      >
                        RCPC.ai
                      </a>
                      {' !'} <br />
                      <br />
                      It’s people like you who fuel the spirit of our community,
                      helping us grow and reach new heights. Each new member
                      adds valuable perspective and experience to our sky-high
                      discussions and shared learning journey.
                      <br /> <br />
                      {' As '}
                      <a
                        className="text-text-hyperlink underline"
                        href="https://www.rcpilots.ai"
                      >
                        RCPC.ai
                      </a>{' '}
                      is still in its early stages, your active participation
                      and efforts to bring in fellow enthusiasts play a crucial
                      role in shaping the future of our platform.
                      <br /> Every new pilot who joins brings us closer to
                      creating a community that truly resonates with the needs
                      and aspirations of RC hobbyists like you. <br />
                      <br />
                      Remember,{' '}
                      <a
                        className="text-text-hyperlink underline"
                        href="https://www.rcpilots.ai"
                      >
                        RCPC.ai
                      </a>{' '}
                      is not just about sharing knowledge and resources; it's
                      about building connections that elevate our passion for RC
                      flying. By inviting others to join, you are contributing
                      to a thriving network where everyone can learn, share, and
                      grow together. <br />
                      <br />
                      We can't wait to welcome your invited pilot aboard and see
                      how they contribute to our community. Let's continue to
                      spread the word and make{' '}
                      <a
                        className="text-text-hyperlink underline"
                        href="https://www.rcpilots.ai"
                      >
                        RCPC.ai
                      </a>{' '}
                      the ultimate destination for RC enthusiasts!
                      <br /> <br />
                      Thank you for being an integral part of{' '}
                      <a
                        className="text-text-hyperlink underline"
                        href="https://www.rcpilots.ai"
                      >
                        RCPC.ai
                      </a>{' '}
                      and for helping our community soar to new heights!
                    </p>
                    <br />
                    <p>
                      Happy Flying! <br />
                      <br />
                      The{' '}
                      <a
                        className="text-text-hyperlink underline"
                        href="https://www.rcpilots.ai"
                      >
                        RCPC.ai
                      </a>{' '}
                      Team. <br />
                      <br />
                      P.S. Keep inviting your fellow RC pilots – every new
                      member makes our community stronger and more diverse!🚀
                    </p>
                  </>
                )}
              </div>
              <div className="w-full flex flex-row justify-around">
                <Button
                  variant="contained"
                  size="medium"
                  onClick={goHome}
                  className="basis-1/3 !bg-bg-white"
                  sx={{
                    color: 'primary.main',
                    borderRadius: 4,
                    py: 2,
                    width: 1,
                    my: 3,
                  }}
                >
                  {`Home`}
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={goBack}
                  className="basis-2/3"
                  sx={{
                    color: 'primary-main',
                    borderRadius: 4,
                    py: 2,
                    width: 1,
                    my: 3,
                    marginLeft: 1,
                  }}
                >
                  {`Invite Another Friend`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}
