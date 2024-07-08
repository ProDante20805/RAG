import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Box, Avatar, SvgIcon } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  AccountCircleOutlined as UserIcon,
  KeyboardArrowRight as ArrowIcon,
} from '@mui/icons-material';
import { useAuth } from 'hooks/useAuth';

import { setAuth } from 'utils/setAuth';

import { Sidenav as Sidebar } from 'layout/Sidebar';
import instance from 'utils/axios';

import { ReactComponent as TCdocIcon } from '../../assets/svg/tcdoc.svg';
import { ReactComponent as InviteFIcon } from '../../assets/svg/invite_friend.svg';
import { ReactComponent as NewsLetterIcon } from '../../assets/svg/news_letter.svg';
import { ReactComponent as PrivacyIcon } from '../../assets/svg/privacy_policy.svg';
import { ReactComponent as LogoutIcon } from '../../assets/svg/logout.svg';

export default function ProfileHome() {
  const form = {
    club_name: '',
    coordinates: '',
    email: '',
    full_name: '',
    interest_size: 1,
    interest_type: 1,
    phone_number: '',
    plane_number: '',
    postal_code: '',
    rpas_number: '',
    user_name: '',
  };
  const [user_information, setInformation] = useState(form);
  const { user, logout } = useAuth();
  const uid = user && user !== 'null' ? jwtDecode(user).id : null;
  const navigate = useNavigate();
  const getProfile = () => {
    instance
      .post('/profile/get')
      .then((res) => {
        setInformation(res.data);
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
  }, [user]);

  const handleLogout = () => {
    logout();
  };
  const timestamp = new Date().getTime();
  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100%',
      }}
    >
      <div className="flex w-full h-40 bg-bg-primary text-ti font-semibold !font-futura text-bg-white justify-center pt-8">
        Profile
      </div>
      <Sidebar color="white" />
      <div className="w-full bg-bg-white"></div>
      <div className="absolute top-24 w-full px-9">
        <div className="bg-bg-white w-full rounded-3xl shadow-md py-12">
          <div className="flex justify-center items-center  w-full flex-col">
            <Avatar
              sx={{ width: 70, height: 70 }}
              src={`${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${uid}.png?${timestamp}`}
            />
            <p className="text-base my-2">{user_information.full_name}</p>
            <p className="text-sm text-text-gray mb-4">{`@${user_information.user_name}`}</p>
          </div>

          <div className="flex-col">
            <Link
              className="flex justify-between px-4 py-4 items-center"
              to={{ pathname: '/profile/detail' }}
            >
              <div className="flex jutify-center items-center">
                <UserIcon className=" text-text-gray mt-[2px]" />
                <p className="ml-1 text-text-main text-lg ">My Details</p>
              </div>
              <ArrowIcon className="font-sm text-text-gray" />
            </Link>

            <Link
              className="flex justify-between px-4 py-4 items-center"
              to={{ pathname: '/profile/tcdoc' }}
            >
              <div className="flex">
                <SvgIcon
                  component={TCdocIcon}
                  inheritViewBox
                  sx={{ fontSize: '24px', marginTop: '2px' }}
                ></SvgIcon>
                <p className="ml-1 text-text-main text-lg ">TC Documents</p>
              </div>
              <ArrowIcon className="font-sm text-text-gray" />
            </Link>

            <Link
              className="flex justify-between px-4 py-4 items-center"
              to={{ pathname: '/profile/invite' }}
            >
              <div className="flex stroke-text-gray">
                <SvgIcon
                  component={InviteFIcon}
                  inheritViewBox
                  sx={{
                    fontSize: '24px',
                    marginTop: '2px',
                  }}
                ></SvgIcon>
                <p className="ml-1 text-text-main text-lg ">Invite a Friend</p>
              </div>
              <ArrowIcon className="font-sm text-text-gray" />
            </Link>

            <Link
              className="flex justify-between px-4 py-4 items-center"
              to={{ pathname: '/working' }}
            >
              <div className="flex">
                <SvgIcon
                  component={NewsLetterIcon}
                  inheritViewBox
                  sx={{ fontSize: '24px', marginTop: '2px' }}
                ></SvgIcon>
                <p className="ml-1 text-text-main text-lg">Newsletter</p>
              </div>
              <ArrowIcon className="font-sm text-text-gray" />
            </Link>

            <Link
              className="flex justify-between px-4 py-4 items-center"
              to={{ pathname: '/privacypolicy' }}
            >
              <div className="flex">
                <SvgIcon
                  component={PrivacyIcon}
                  inheritViewBox
                  sx={{ fontSize: '24px', marginTop: '2px' }}
                ></SvgIcon>
                <p className="ml-1 text-text-main text-lg">Privacy Policy</p>
              </div>
              <ArrowIcon className="font-sm text-text-gray" />
            </Link>
          </div>
        </div>

        <div className="flex my-12">
          <div
            className="flex justify-start px-4"
            underline="none"
            onClick={handleLogout}
            sx={{ marginTop: '25px' }}
          >
            <SvgIcon
              component={LogoutIcon}
              inheritViewBox
              sx={{ fontSize: '24px', color: 'black' }}
            ></SvgIcon>
            <p className="ml-1 text-text-main text-lg">Log out</p>
          </div>
        </div>
      </div>
    </Box>
  );
}
