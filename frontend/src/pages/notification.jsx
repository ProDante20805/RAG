import { useState, useEffect } from 'react';
import instance from 'utils/axios';
import { useNavigate } from 'react-router-dom';
import { Close as CloseIcon, Check as CheckIcon } from '@mui/icons-material';
import { Avatar, IconButton, SvgIcon } from '@mui/material';

import { ReactComponent as SignalIcon } from '../assets/svg/signal.svg';
import { ReactComponent as FlightIcon } from '../assets/svg/flight.svg';

export default function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    instance
      .post('/post/getNotifications')
      .then((res) => {
        console.log('get notifications-----', res.data);
        setNotifications(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate('/signin');
        }
        console.log(err);
      });
  };

  const handelAccept = (id) => {
    instance
      .post('/post/acceptInvite', { id })
      .then((res) => {
        console.log('get acceptInvite-----', res.data);
        getNotifications();
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate('/signin');
        }
        console.log(err);
      });
  };

  const handelDecline = () => {};

  return (
    <div className="w-full h-screen px-9 pt-8">
      <div className="p-2 flex justify-around">
        <div></div>
        <p className="text-ti !font-futura font-semibold">Notifications </p>
        <button className="" onClick={goBack}>
          <CloseIcon />
        </button>
      </div>

      {notifications.length > 0 ? (
        <div className="mt-6">
          {notifications.map((item, i) => {
            const [date, time] = item.createdAt.split('T');
            const [, month, day] = date.split('-');
            const [hour, minute] = time.split('.')[0].split(':');
            if (item.type === 0) {
              //system
            } else if (item.type === 1) {
              //normal
            } else {
              // invitation accept
              return (
                <div key={i} className="flex justify-around items-start">
                  <Avatar
                    src={`${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${item.from.id}.png`}
                    sx={{ width: 40, height: 40 }}
                  />
                  <div className="">
                    <div className="flex">
                      <p className="text-ssm text-bg-primary">
                        {item.from.user_name}
                      </p>
                      <p className="text-ssm ml-1 text-text-gray">
                        invited you to Flight Crews
                      </p>
                    </div>
                    <div className="flex mt-2">
                      <IconButton
                        onClick={() => {
                          handelAccept(item.from.id);
                        }}
                        className="!bg-bg-green1 !rounded-md  !border !border-bg-green !px-6 !rounded-xl !mr-4"
                        sx={{ border: 1 }}
                      >
                        <CheckIcon className="text-bg-green" />
                      </IconButton>

                      <IconButton
                        onClick={handelDecline}
                        className="!bg-bg-primary1 !rounded-md !border !border-bg-primary !px-6 !rounded-xl"
                        sx={{ border: 1 }}
                      >
                        <CloseIcon className="text-bg-primary" />
                      </IconButton>
                    </div>
                  </div>
                  <p className="text-ssm text-text-gray">
                    {' '}
                    {`${hour}:${minute} | ${month}/${day}`}{' '}
                  </p>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <div className="mt-1/3 flex justify-center items-center flex flex-col">
          <SvgIcon
            component={SignalIcon}
            inheritViewBox
            sx={{ fontSize: '263px' }}
          ></SvgIcon>

          <SvgIcon
            component={FlightIcon}
            inheritViewBox
            sx={{ fontSize: '263px' }}
            className="-mt-28 "
          ></SvgIcon>
          <p className="text-ti !font-futura  text-bg-black font-semibold">
            No notifications here yet
          </p>
        </div>
      )}
    </div>
  );
}
