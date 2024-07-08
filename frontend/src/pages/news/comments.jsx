import {
  Box,
  Avatar,
  InputBase,
  IconButton,
  SvgIcon,
  Button,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { useState, useEffect, useRef } from 'react';
import instance from 'utils/axios';
import { useAuth } from 'hooks/useAuth';
import jwtDecode from 'jwt-decode';
import { setAuth } from 'utils/setAuth';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as LeftArrowIcon } from '../../assets/svg/left_arrow.svg';

export default function Comments() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [temp_comments, setTempComments] = useState([]);
  const [post_info, setPostInfo] = useState([]);
  const [msg, setMsg] = useState('');
  const [search_state, setOpenSearchState] = useState(false);
  const bottomRef = useRef(null);
  const { user } = useAuth();
  const uid = user && user !== 'null' ? jwtDecode(user).id : null;
  const getInitialComments = () => {
    instance
      .post('/post/getPostById', { id: state.id })
      .then((res) => {
        setPostInfo(res.data);
        console.log('getPostById responsed-----', res.data);

        instance
          .post('/post/getCommentsByPostId', { id: res.data.id })
          .then((res) => {
            setComments(res.data);
            setTempComments(res.data);

            console.log('getCommnentByPostId responsed-----', res.data);
          })
          .catch((err) => {
            if (err.response.status === 401) {
              navigate('/signin');
            }
            console.log('getPost error occured-----', err);
          });
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
    getInitialComments();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments.length]);

  const sendMessage = () => {
    instance
      .post('/post/comment', { postId: post_info.id, content: msg })
      .then((res) => {
        console.log('commecs--', res.data);
        setComments([...comments, res.data]);
        setTempComments([...temp_comments, res.data]);
        setMsg('');
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate('/signin');
        }
        console.log('error----', err);
      });
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  const goBack = () => {
    navigate('/news');
  };

  const handleSearchChange = (e) => {
    const result = temp_comments.filter(
      (comment) =>
        comment.content.toLowerCase().includes(e.target.value.toLowerCase()) ===
        true
    );
    if (e.target.value === '') {
      setComments(temp_comments);
    } else {
      setComments(result);
    }
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      {temp_comments.length > 0 ? (
        <>
          <div className="inline-flex w-full justify-between pt-8 pb-10 px-9 bg-bg-primary items-center">
            {search_state === false ? (
              <>
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
                <p className="text-bg-white text-ti font-semibold !font-futura text-center">{`${post_info.comments.length} Comments`}</p>

                <div className="">
                  <button
                    onClick={() => {
                      setOpenSearchState(!search_state);
                    }}
                  >
                    <SearchIcon
                      sx={{ fontSize: '32px' }}
                      className="text-bg-white"
                    />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <button
                    onClick={() => {
                      setOpenSearchState(false);
                    }}
                  >
                    <CloseIcon
                      sx={{ fontSize: '32px' }}
                      className="!text-bg-white"
                    />
                  </button>
                </div>
                <InputBase
                  sx={{ mx: 5, flex: 1, color: '#FFFFFF' }}
                  placeholder="Search Comments"
                  onChange={handleSearchChange}
                  autoFocus
                />

                <div className="place-self-end mb-2">
                  <button
                    onClick={() => {
                      setOpenSearchState(!search_state);
                    }}
                  >
                    <SearchIcon
                      sx={{ fontSize: '32px' }}
                      className="text-bg-white"
                    />
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="h-[85vh] rounded-t-3xl bg-bg-white w-full pb-28 overflow-y-scroll -mt-5">
            <div className="flex bg-bg-gray p-4 rounded-b-xl fixed w-full z-50 rounded-t-3xl ">
              <div className="flex-row border-l-2 border-bg-primary pl-2 ">
                <p className="text-ssm text-bg-primary">
                  {post_info.userId.length > 0
                    ? post_info.userId[0].user_name
                    : 'Deleted User'}
                </p>
                <p className="text-base">{post_info.content}</p>
              </div>
            </div>
            <div className="px-5">
              {comments.length > 0 ? (
                <div className="w-full bg-bg-white flex justify-center mt-24">
                  <Button
                    variant="outlined"
                    disabled
                    size="small"
                    className="text-ssm !bg-bg-white !rounded-3xl !text-text-gray"
                  >
                    Discussion started
                  </Button>
                </div>
              ) : (
                ''
              )}
              {comments.map((item, i) => {
                const [date, time] = item.createdAt.split('T');
                const [, month, day] = date.split('-');
                const [hour, minute] = time.split('.')[0].split(':');
                const item_userID = item?.userId?.id;
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
                          {item.userId.user_name}
                        </p>
                        <p className="text-base">{item.content}</p>
                        <p className="text-text-gray text-end">{`${hour}:${minute} | ${month}/${day}`}</p>
                      </div>
                    </div>
                  );
                }
              })}
              <div ref={bottomRef} />
            </div>
          </div>
          <div className="fixed bottom-0 w-full p-3">
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
        </>
      ) : (
        <>
          <div className="inline-flex w-full justify-between pt-8 pb-10 px-9 bg-bg-primary items-center">
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
            <p className="text-bg-white text-ti font-semibold !font-futura text-center">{`Comments`}</p>

            <div className="">
              <button>
                <SearchIcon
                  sx={{ fontSize: '32px' }}
                  className="text-bg-white"
                />
              </button>
            </div>
          </div>
          <div className="h-[85vh] rounded-t-3xl bg-bg-white w-full pb-28 overflow-y-scroll -mt-5">
            <div className="flex bg-bg-gray p-4 rounded-b-xl fixed rounded-t-3xl z-50 w-full ">
              <div className="flex-row border-l-2 border-bg-primary pl-2">
                <p className="text-ssm text-bg-primary">
                  {post_info.userId === undefined
                    ? 'Deleted User'
                    : post_info.userId.length > 0
                    ? post_info.userId[0].user_name
                    : ''}
                </p>
                <p className="text-base">{post_info.content}</p>
              </div>
            </div>
            <div className="px-5">
              <div ref={bottomRef} />
            </div>
          </div>
          <div className="fixed bottom-0 w-full p-3">
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
        </>
      )}
    </Box>
  );
}
