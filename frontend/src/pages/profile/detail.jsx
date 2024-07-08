import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { Box, Avatar, SvgIcon, Tabs, Tab } from '@mui/material';
import { useAuth } from 'hooks/useAuth';

import { setAuth } from 'utils/setAuth';

import instance from 'utils/axios';

import useGlobalStore from 'utils/store';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg';
import { ReactComponent as LeftArrowIcon } from '../../assets/svg/left_arrow.svg';

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

export default function ProfileDetail() {
  const { _setActiveTab, active_tab } = useGlobalStore();

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
  const { user } = useAuth();
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
  const timestamp = new Date().getTime();

  const [tab_value, setTabValue] = useState(active_tab);

  const handleTabChange = (event, newValue) => {
    _setActiveTab(newValue);
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100%', backgroundColor: 'primary.main' }}>
      <div className="inline-flex w-full justify-between pt-8 px-9 items-center">
        <div>
          <Link to={{ pathname: '/profile' }}>
            <SvgIcon
              component={LeftArrowIcon}
              inheritViewBox
              sx={{ fontSize: '32px' }}
              className="text-bg-primary"
            ></SvgIcon>
          </Link>
        </div>
        <p className="text-bg-white text-ti font-semibold !font-futura text-center">
          Detail Profile
        </p>

        <div className="place-self-end mb-2">
          <Link to={{ pathname: '/profile/edit', state: active_tab }}>
            <SvgIcon
              component={EditIcon}
              inheritViewBox
              sx={{ fontSize: '32px' }}
              className="text-bg-primary"
            ></SvgIcon>
          </Link>
        </div>
      </div>
      <div className="mt-6 h-full rounded-t-3xl  py-5 px-4 md:px-56 w-full bg-bg-white">
        <div className="flex justify-center items-center mt-4 w-full flex-col">
          <Avatar
            src={`${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${uid}.png?${timestamp}`}
            sx={{ width: 70, height: 70 }}
          />
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

        <div className="p-4">
          <CustomTabPanel value={tab_value} index={0}>
            <div className="my-2">
              <p className="text-sm text-text-gray"> Username</p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.user_name}
              </p>
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray"> First Name</p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.full_name.split(' ')[0]}
              </p>
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray"> Last Name</p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.full_name.split(' ')[1]}
              </p>
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray"> Phone Number</p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.phone_number}
              </p>
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray"> Postal Code</p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.postal_code}
              </p>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={tab_value} index={1}>
            <div className="my-4">
              <p className="text-sm text-text-gray">Email</p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.email}
              </p>
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray">
                {' '}
                Pilot Certification Number
              </p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.rpas_number}
              </p>
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray"> Registeration Number</p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.plane_number}
              </p>
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray"> Coordinates</p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.coordinates}
              </p>
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray"> Club Name</p>
              <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                {user_information.club_name}
              </p>
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray"> Size and Weight of RPAS</p>
              {user_information.interest_size === 1 ? (
                <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                  {'Micro:'}{' '}
                  <span className="text-text-gray ml-1">under 250 grams</span>
                </p>
              ) : user_information.interest_size === 2 ? (
                <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                  {'Regular:'}{' '}
                  <span className="text-text-gray ml-1">up to 25kgs</span>
                </p>
              ) : (
                <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                  {'Giant Scale:'}{' '}
                  <span className="text-text-gray ml-1">over 25kgs</span>
                </p>
              )}
            </div>

            <div className="my-4">
              <p className="text-sm text-text-gray"> Type of RPAS</p>
              {user_information.interest_type === 1 ? (
                <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                  {'Fixed-Wing'}
                </p>
              ) : user_information.interest_type === 2 ? (
                <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                  {'Helicopters'}
                </p>
              ) : (
                <p className="text-sm  py-4 border-gray-100 border-b border-gray-100">
                  {'Drones (Rotary-Wing)'}
                </p>
              )}
            </div>
          </CustomTabPanel>
        </div>
      </div>
    </Box>
  );
}
