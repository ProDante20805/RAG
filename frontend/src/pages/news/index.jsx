import {
  Box,
  Avatar,
  InputBase,
  IconButton,
  Divider,
  AvatarGroup,
  SvgIcon,
  Modal,
} from '@mui/material';
import {
  Send as SendIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Mail as MailIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

import { Sidenav as Sidebar } from 'layout/Sidebar';
import { useState, useEffect, useRef } from 'react';
import instance from 'utils/axios';
import { useAuth } from 'hooks/useAuth';
import jwtDecode from 'jwt-decode';
import { setAuth } from 'utils/setAuth';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as LeftArrowIcon } from '../../assets/svg/left_arrow.svg';
import { ReactComponent as InviteIcon } from '../../assets/svg/invite_friend.svg';

export default function News() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [modalOpen, setOpen] = useState(false);
  const [modalOpen1, setOpen1] = useState(false);
  const [pageType, setPageType] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [crewText, setCrewText] = useState('');
  const [creator, setCreator] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [myFC, setMyFC] = useState([]);
  const [allFC, setAllFC] = useState([]);
  const [crew, setCrewName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [crewError, setCrewError] = useState('');
  const [startTouch, setStartTouch] = useState({ x: 0, y: 0 });
  const swipeRef = useRef(null);
  const [msg, setMsg] = useState('');
  const bottomRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpen1 = () => {
    if (myFC.length > 0) {
      setOpen1(false);
    } else {
      setOpen1(true);
    }
  };
  const handleClose1 = () => setOpen1(false);

  const { user } = useAuth();
  const uid = user && user !== 'null' ? jwtDecode(user).id : null;

  const getInitialMessages = () => {
    instance
      .post('/post/getPosts')
      .then((res) => {
        setMessages(res.data);
        console.log('getPost responsed-----', res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate('/signin');
        }
        console.log('getPost error occured-----', err);
      });
  };

  useEffect(() => {
    setAuth(user);

    getInitialMessages();
  }, [user]);

  const getAllFC = () => {
    instance
      .post('/post/getAllFC')
      .then((res) => {
        setAllFC(res.data.all);
        setMyFC(res.data.mine);
        console.log('getAllFC responsed-----', res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate('/signin');
        }
        console.log('getAllFC error occured-----', err);
      });
  };

  useEffect(() => {
    getAllFC();
  }, [currentIndex]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const sendMessage = () => {
    instance
      .post(
        '/post/addPost',
        pageType === 0
          ? { content: msg }
          : { content: msg, fc_creator: creator }
      )
      .then((res) => {
        console.log(res.data);
        setMessages([...messages, res.data]);
        setMsg('');
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate('/signin');
        }
        console.log('error----', err);
      });
  };

  const sendInvite = () => {
    const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const is_email = email_pattern.test(inviteEmail);
    if (is_email) {
      setEmailError('');
      instance
        .post('/post/inviteFC', { email: inviteEmail })
        .then((res) => {
          console.log('news invite---------', res.data);
          if (res.data === true) {
            setEmailError('');
            handleClose();
          } else {
            setEmailError(res.data);
          }
        })
        .catch((err) => {
          console.log('error----', err);
          // if (err.response.status === 401) {
          //   navigate('/signin');
          // }
        });
    } else {
      setEmailError('Invalid Email');
    }
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  const handleEmailChange = (e) => {
    setInviteEmail(e.target.value);
  };

  const handleCrewChange = (e) => {
    setCrewName(e.target.value);
  };

  const createCrew = () => {
    instance
      .post('/post/createCrew', { crew })
      .then((res) => {
        console.log('create crew---------', res.data);
        setMyFC([...myFC, res.data]);
        handleClose1();
      })
      .catch((err) => {
        console.log('error----', err);
        // if (err.response.status === 401) {
        //   navigate('/signin');
        // }
      });
  };

  const handleComment = (id) => {
    navigate(`/news/comments`, { state: { id } });
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartTouch({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (startTouch.x === 0 && startTouch.y === 0) {
      return;
    }

    const touch = e.touches[0];
    const deltaX = touch.clientX - startTouch.x;
    // Set a threshold for swipe movement before changing the text
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (deltaX < 0 && currentIndex < texts.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      setStartTouch({ x: 0, y: 0 });
    }
  };

  const handleTouchEnd = () => {
    setStartTouch({ x: 0, y: 0 });
  };

  const texts = ['Hanger', 'Flight Crews'];

  const goFlightCrew = (creator_id, text) => {
    setCrewText(text);
    setCreator(creator_id);
    setCurrentIndex(0);
    instance
      .post('/post/getFCPosts', { creator_id })
      .then((res) => {
        setMessages(res.data);
        console.log('getFCPost responsed-----', res.data);
        setPageType(1);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate('/signin');
        }
        console.log('getFCPost error occured-----', err);
      });
    console.log(creator_id);
  };

  const goBackFromCrew = () => {
    getInitialMessages();
    setPageType(0);
    setCurrentIndex(1);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <div className="inline-flex w-full justify-center bg-bg-primary">
        {pageType === 0 ? (
          <>
            <Sidebar color="white" />
            <div className="text-bg-white text-ti font-semibold !font-futura text-center pt-8 pb-10">
              <div
                ref={swipeRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-full relative overflow-hidden"
              >
                <div
                  className="h-full flex items-center justify-center overflow-hidden"
                  style={{
                    width: '200%',
                    transform: `translateX(-${currentIndex * 50}%)`,
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  {/* {texts.map((text, index) => ( */}
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    {texts[0]}
                  </div>
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    {texts[1]}
                  </div>
                  {/* ))} */}
                </div>
              </div>
              <div className="flex justify-center">
                {currentIndex === 0 ? (
                  <>
                    <div className="rounded-full w-2 h-2 bg-bg-primary outline outline-3 outline-white mr-1"></div>
                    <div className="rounded-full w-2 h-2 bg-bg-white opacity-50 ml-1"></div>
                  </>
                ) : (
                  <>
                    <div className="rounded-full w-2 h-2 bg-bg-white opacity-50 mr-1"></div>
                    <div className="rounded-full w-2 h-2 bg-bg-primary outline outline-3 outline-white ml-1"></div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="inline-flex w-full justify-between pt-8 pb-10 px-9 bg-bg-primary items-center">
            <div>
              <button onClick={goBackFromCrew}>
                <SvgIcon
                  component={LeftArrowIcon}
                  inheritViewBox
                  sx={{ fontSize: '32px' }}
                  className="text-bg-primary"
                ></SvgIcon>
              </button>
            </div>
            <p className="text-bg-white text-ti font-semibold !font-futura text-center">
              {crewText}
            </p>
            <div className="stroke-bg-white">
              <button onClick={handleOpen}>
                <SvgIcon
                  component={InviteIcon}
                  inheritViewBox
                  sx={{ fontSize: '32px' }}
                ></SvgIcon>
              </button>
              <Modal
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div className="absolute top-1/3 left-2/4 width-20 shadow w-80 -ml-40 rounded-xl bg-bg-white p-4 shadow">
                  {modalOpen === true ? (
                    <div className="p-3">
                      <div className="flex mb-1">
                        <p className="text-lg">
                          Invite a friend to your Flight Crew
                        </p>
                        <button onClick={handleClose} className="flex">
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="inline-flex w-full items-center justify-between mt-2">
                        <InputBase
                          value={inviteEmail}
                          sx={{ ml: 1, flex: 1, py: 1 }}
                          className="!bg-bg-gray_1 !ml-0 !mr-2 !rounded-md !px-2"
                          placeholder="Enter the email address"
                          onChange={handleEmailChange}
                        />
                        <IconButton
                          aria-label="send message"
                          onClick={sendInvite}
                          className="!bg-bg-primary !rounded-md"
                        >
                          <MailIcon className="text-bg-white" />
                        </IconButton>
                      </div>
                      <p className="text-bg-primary">
                        {emailError !== '' ? emailError : ''}
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Modal>
            </div>
          </div>
        )}
      </div>
      {currentIndex > 0 ? (
        <div className=" h-[85vh] rounded-t-3xl bg-bg-white pt-5 px-9 md:px-56 w-full pb-28 overflow-y-scroll -mt-5 fixed">
          <div className="mt-3">
            <p className="text-text-gray text-lg">My FC</p>
            <div className="flex w-full overflow-x-scroll">
              {myFC.map((item, i) => {
                return (
                  <button
                    className="flex flex-col shadow-lg w-1/3 p-3 justify-center items-center mt-2 mr-4"
                    onClick={() => goFlightCrew(item.creator.id, item.fc_name)}
                  >
                    <Avatar
                      src={`${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${item.creator.id}.png`}
                      sx={{ width: 50, height: 50 }}
                      className="my-4"
                    />
                    <p className="text-center text-text-gray">
                      {item.creator.user_name}
                    </p>
                    <p className="text-center">{item.fc_name}</p>
                  </button>
                );
              })}

              <button
                onClick={handleOpen1}
                className="rounded border-2 border-dashed border-gray-100 w-1/3 flex justify-center items-center py-12"
              >
                <AddIcon className="text-text-gray !text-ti" />
              </button>

              <Modal
                open={modalOpen1}
                onClose={handleClose1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div className="absolute top-1/3 left-2/4 width-20 shadow w-80 -ml-40 rounded-xl bg-bg-white p-4 shadow">
                  {modalOpen1 === true ? (
                    <div className="p-3">
                      <div className="flex mb-1 justify-around">
                        <p className="text-lg">Create my flight crew.</p>
                        <button onClick={handleClose1} className="flex">
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="inline-flex w-full items-center justify-between mt-2">
                        <InputBase
                          value={crew}
                          sx={{ ml: 1, flex: 1, py: 1 }}
                          className="!bg-bg-gray_1 !ml-0 !mr-2 !rounded-md !px-2"
                          placeholder="Enter the name of flight crew"
                          onChange={handleCrewChange}
                        />
                        <IconButton
                          aria-label="send message"
                          onClick={createCrew}
                          className="!bg-bg-primary !rounded-md"
                        >
                          <CheckIcon className="text-bg-white" />
                        </IconButton>
                      </div>
                      <p className="text-bg-primary">
                        {crewError !== '' ? crewError : ''}
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Modal>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-text-gray text-lg my-4">All FCs</p>
            <div className="flex overflow-x-scroll w-full">
              {allFC.map((item, i) => {
                return (
                  <button
                    className="flex flex-col shadow-lg w-1/3 p-5 justify-center items-center mt-2 mr-4"
                    onClick={() => goFlightCrew(item.creator.id, item.fc_name)}
                  >
                    <Avatar
                      src={`${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${item.creator.id}.png`}
                      sx={{ width: 50, height: 50 }}
                      className="my-4"
                    />
                    <p className="text-center text-text-gray">
                      {item.creator.user_name}
                    </p>
                    <p className="text-center">{item.fc_name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className=" h-[85vh] rounded-t-3xl bg-bg-white pt-5 px-9 md:px-56 w-full pb-28 overflow-y-scroll -mt-5 fixed">
          {messages.map((item, i) => {
            const [date, time] = item.createdAt.split('T');
            const [, month, day] = date.split('-');
            const [hour, minute] = time.split('.')[0].split(':');
            const item_userID = item?.userId[0]?.id;
            if (uid === item_userID || !item_userID) {
              return (
                <div
                  key={i}
                  className="bg-bg-primary mt-5 rounded-xl p-3 ml-24 "
                >
                  <p className=" text-bg-white">{item.content}</p>
                  <p className="text-end text-bg-white">
                    {`${hour}:${minute} | ${month}/${day}`}
                  </p>
                  <Divider variant="middle" className="!my-2" />
                  <button
                    onClick={() => handleComment(item.id)}
                    className="flex justify-between items-center w-full "
                  >
                    <div className="flex items-center">
                      <div>
                        {item.comments.length > 0 ? (
                          <>
                            <AvatarGroup max={3}>
                              {item.comments.map((item, i) => {
                                if (i <= 2) {
                                  return (
                                    <Avatar
                                      key={i}
                                      className="!w-[20px] !h-[20px]"
                                      src={`${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${item.userId}.png`}
                                    ></Avatar>
                                  );
                                } else {
                                  return false;
                                }
                              })}
                            </AvatarGroup>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                      <p
                        className="text-ssm text-bg-white ml-2"
                        id={item.id}
                      >{`${item.comments.length} comments*`}</p>
                    </div>
                    <KeyboardArrowRightIcon className="!text-lg text-bg-white" />
                  </button>
                </div>
              );
            } else {
              return (
                <div key={i} className="inline-flex w-full mt-5">
                  <Avatar
                    src={`${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${item_userID}.png`}
                    sx={{ width: 50, height: 50 }}
                  />
                  <div className="flex flex-col p-3 bg-bg-gray w-full ml-3 rounded-xl mr-8">
                    <p className="my-2 text-bg-primary text-ssm">
                      {item.userId[0].user_name}
                    </p>
                    <p className="text-base">{item.content}</p>
                    <p className="text-text-gray text-end">{`${hour}:${minute} | ${month}/${day}`}</p>
                    <Divider variant="middle" className="!my-2" />
                    <button
                      onClick={() => handleComment(item.id)}
                      className="flex justify-between items-center "
                    >
                      <div className="flex items-center">
                        <div>
                          {item.comments.length > 0 ? (
                            <>
                              <AvatarGroup max={3}>
                                {item.comments.map((item, i) => {
                                  if (i <= 2) {
                                    return (
                                      <Avatar
                                        key={i}
                                        className="!w-[20px] !h-[20px]"
                                        src={`${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${item.userId}.png`}
                                      ></Avatar>
                                    );
                                  } else {
                                    return false;
                                  }
                                })}
                              </AvatarGroup>
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                        <p
                          className="text-ssm text-bg-primary ml-2"
                          id={item.id}
                        >{`${item.comments.length} comments*`}</p>
                      </div>
                      <KeyboardArrowRightIcon className="!text-lg text-bg-primary" />
                    </button>
                  </div>
                </div>
              );
            }
          })}
          <div ref={bottomRef} />
          <div className="fixed bottom-0 w-full p-3 -ml-9">
            <div className="bg-bg-gray_1 p-2 inline-flex w-full items-center">
              <InputBase
                value={msg}
                sx={{ ml: 1, flex: 1, py: 1 }}
                placeholder="Message"
                onChange={handleChange}
              />
              <IconButton aria-label="send message" onClick={sendMessage}>
                <SendIcon className="bg-bg-gray_1 text-bg-primary" />
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
}
