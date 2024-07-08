import { useState, useEffect } from 'react';
import { useAuth } from 'hooks/useAuth';
import { setAuth } from 'utils/setAuth';
import jwtDecode from 'jwt-decode';

import {
  Button,
  Box,
  InputBase,
  IconButton,
  Divider,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  SvgIcon,
} from '@mui/material';

import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  ViewInAr as ViewInArIcon,
  AutoAwesomeOutlined as AutoAwesomeOutlinedIcon,
  GridViewOutlined as GridViewOutlinedIcon,
  CategoryOutlined as CategoryOutlinedIcon,
  PaletteOutlined as PaletteOutlinedIcon,
} from '@mui/icons-material';
import { Sidenav as Sidebar } from 'layout/Sidebar';
import { useNavigate, Link } from 'react-router-dom';
import instance from 'utils/axios';
import useGlobalStore from 'utils/store';

import { ReactComponent as BellIcon } from '../../assets/svg/bell.svg';

export default function Home() {
  const services = [
    'Hangar and Flight Crew features coming soon!',
    // 'Horizon Hobby Announces New F-16 90mm...',
    // 'MAAC causing confusing on RPAS Regulation requirement...frustrating fixed pilots',
    // 'RCPC.ai announces NEW live stream Member content feed...check it out',
    // 'RCPC has helped 53 Members complete their advanced certificate 900 since 2023!',
  ];
  const icons = [
    <ViewInArIcon />,
    <PaletteOutlinedIcon />,
    <AutoAwesomeOutlinedIcon />,
    <GridViewOutlinedIcon />,
    <CategoryOutlinedIcon />,
  ];
  const navigate = useNavigate();
  const { _setAnswers, _setSearchQuery, search_query, all_answers } =
    useGlobalStore();
  // const [answers, setAnswers] = useState([]);
  const [search_temp_text, setTempSearchText] = useState('');

  const { user } = useAuth();
  const input_warning = `Please check out your question or I can't find the answer.`;
  const input_normal = 'For example: Help me write my RPAS certification exam!';
  const uid = user && user !== 'null' ? jwtDecode(user).id : null;
  const [loading, setLoading] = useState(false);
  const [pre_loading, setPreLoading] = useState(false);
  const [help_text, setHelpText] = useState(input_normal);
  const [open, setOpen] = useState(false);
  const [noti_length, setNotiLength] = useState(0);

  useEffect(() => {
    setAuth(user);
  });

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    instance
      .post('/post/getNotifications')
      .then((res) => {
        console.log('get notifications length-----', res.data.length);
        setNotiLength(res.data.length);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate('/signin');
        }
        console.log(err);
      });
  };

  const setAnswerParsed = (result) => {
    _setAnswers(result);

    setHelpText(input_normal);
    setTempSearchText('');
  };

  const getAnswer = () => {
    if (search_temp_text) {
      setLoading(!loading);
      _setSearchQuery(search_temp_text);
      instance
        .post('/chat/getMainCourse', {
          question: search_temp_text,
        })
        .then((res) => {
          console.log('chat response-----', res);

          const answer_ary = res.data.text;
          if (Array.isArray(answer_ary) && answer_ary.length === 5) {
            setAnswerParsed(answer_ary);
          } else {
            setHelpText(input_warning);
            setOpen(true);
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            navigate('/signin');
          }
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSearchText = (e) => {
    setTempSearchText(e.target.value);
  };

  const goProfilePage = () => {
    navigate('/profile');
  };

  const updateAnswer = async (title_ary, index) => {
    const updatedArray = await all_answers.map((obj, i) => {
      if (index !== i) {
        return obj;
      } else {
        return {
          ...obj,
          detail: [
            { title: title_ary[0], des: '', mark: false },
            { title: title_ary[1], des: '', mark: false },
            { title: title_ary[2], des: '', mark: false },
            { title: title_ary[3], des: '', mark: false },
            { title: title_ary[4], des: '', mark: false },
          ],
        };
      }
    });
    await _setAnswers(updatedArray);
  };

  const goLearnPage = (answer, index) => {
    if (!all_answers[index].detail) {
      setPreLoading(true);
      let main_title = '';
      let sub_title = '';
      main_title += all_answers.map((item, i) => {
        return item.title;
      });
      sub_title += all_answers.map((item, i) => {
        if (item.detail) {
          return item.detail.map((s_item, j) => {
            return s_item.title;
          });
        } else {
          return '';
        }
      });
      instance
        .post('/chat/getSubTitle', {
          sub_question: answer.title,
          main_question: search_query,
          title: main_title + sub_title,
        })
        .then((res) => {
          console.log('detail title chat response-----', res);
          const title_array = JSON.parse(res.data.text);
          updateAnswer(title_array, index);

          navigate('/learn', {
            state: { index },
          });
        })
        .catch((err) => {
          console.log('getting detail title----', err);
          if (err.response?.status === 401) {
            navigate('/signin');
          }
        })
        .finally(() => {
          setPreLoading(false);
        });
    } else {
      navigate('/learn', {
        state: { index },
      });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const goNotification = () => {
    navigate('/notification');
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100%', p: '36px' }}>
      {pre_loading ? (
        <div className="fixed top-0 left-0 z-[5001] w-full h-full bg-bg-black opacity-50 flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        ''
      )}

      <Box
        sx={{
          width: 1,
          display: 'inline-flex',
          justifyContent: 'flex-end',
        }}
      >
        {user && user !== 'null' ? (
          <div className="flex ">
            <button className="stroke-bg-black mr-4" onClick={goNotification}>
              {noti_length > 0 ? (
                <div className="rounded-full w-2 h-2 bg-bg-white outline outline-4 outline-bg-primary mr-1"></div>
              ) : (
                <></>
              )}

              <SvgIcon
                component={BellIcon}
                inheritViewBox
                sx={{ fontSize: '32px' }}
                className="text-bg-white"
              ></SvgIcon>
            </button>
            <Avatar
              onClick={goProfilePage}
              src={`${process.env.REACT_APP_BACKEND_ORIGIN_URL}/avatar/${uid}.png`}
              sx={{ width: 40, height: 40 }}
            />
          </div>
        ) : (
          <Button
            href="/signin"
            variant="contained"
            sx={{ color: 'primary-main', borderRadius: 4, px: 3 }}
          >
            {'Log In'}
          </Button>
        )}
      </Box>
      <Box
        sx={{
          width: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          color: 'primary.text.main',
        }}
      >
        <p className="text-ti font-semibold mt-12 font-semibold !font-futura">
          RCPC.ai
        </p>
        <p className="text-base text-text-gray px-10 text-center mt-5">
          Learn anything about RC flying in Canada
        </p>
      </Box>

      <div className="m-auto mt-5 sm:mt-20 md:mt-15 items-center w-full sm:w-6/12   rounded-2xl  bg-text-input_bg flex">
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          <SearchIcon sx={{ width: '24px' }} />
        </IconButton>
        <InputBase
          value={search_temp_text}
          sx={{ ml: 1, flex: 1, py: 1, px: 2 }}
          placeholder="Ask me anything"
          onChange={handleSearchText}
          className="!m-0 !pr-[44px] !pl-0"
        />
      </div>
      <p className="text-sm text-text-gray m-auto mt-3 w-full sm:w-6/12">
        {help_text}
      </p>
      {loading ? (
        <Button
          variant="contained"
          size="medium"
          disabled
          className=" bg-bg-primary w-full sm:w-6/12 flex justify-center items-center"
          sx={{
            borderRadius: 4,
            py: 2,
            width: 1,
            m: 'auto',
            my: 3,
          }}
        >
          {'Generating Answer...'}
          <CircularProgress size={16} color="bg_gray" />
        </Button>
      ) : (
        <Button
          onClick={getAnswer}
          component="label"
          variant="contained"
          size="medium"
          className=" bg-bg-primary w-full sm:w-6/12 flex justify-center items-center"
          sx={{
            color: 'primary-main',
            borderRadius: 4,
            py: 2,
            width: 1,
            m: 'auto',
            my: 3,
          }}
        >
          {"Let's Roll"}
        </Button>
      )}

      <div className="mt-5 sm:mt-20 md:mt-15 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-2">
        {uid !== null && all_answers.length !== 0
          ? all_answers.map((item, i) => {
              return (
                <button
                  key={i}
                  onClick={() => {
                    goLearnPage(item, i);
                  }}
                  className="bg-text-input_bg rounded-xl p-6 inline-flex w-full justify-between"
                >
                  <div className="text-left">
                    <p className="text-base font-medium text-text-main">
                      {`0${i + 1} ${item.title}`}
                    </p>
                    <p className="text-sm font-medium text-text-gray mt-4 h-14 overflow-hidden text-ellipsis">
                      {item.description}
                    </p>
                  </div>
                  <div className="p-2 bg-bg-white rounded-xl h-fit text-text-gray">
                    {icons[i]}
                  </div>
                </button>
              );
            })
          : services.map((item, i) => {
              return (
                <div key={i} className="flex flex-row items-center">
                  <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <CheckCircleIcon sx={{ color: 'primary.main' }} />
                  </IconButton>
                  <p
                    className="text-base text-text-gray m-0"
                    color="primary.text.second"
                  >
                    {item}
                  </p>
                </div>
              );
            })}
      </div>
      <div className="flex py-8 items-center w-full justify-around">
        <div>
          <Link to={{ pathname: '/contactus' }} className="text-bg-primary">
            Contact Us
          </Link>
        </div>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ m: 0, backgroundColor: 'primary.text.main' }}
        />
        <div>
          <Link to={{ pathname: '/userpolicy' }} className="text-bg-primary">
            User Terms
          </Link>
        </div>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ m: 0, backgroundColor: 'primary.text.main' }}
        />
        <div>
          <Link to={{ pathname: '/aboutus' }} className="text-bg-primary">
            About Us
          </Link>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          {input_warning}
        </Alert>
      </Snackbar>
      <Sidebar />
    </Box>
  );
}
