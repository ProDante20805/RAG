import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepButton,
  colors,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Check as CheckIcon,
  CheckCircleRounded as CheckCircleRoundedIcon,
} from '@mui/icons-material';
import useGlobalStore from 'utils/store';
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Learn() {
  const navigate = useNavigate();
  let socketRef = useRef(null);
  const empty_ary = [0, 1, 2, 3, 4];
  const { state } = useLocation();
  const { search_query, all_answers, _setAnswers } = useGlobalStore();
  const [activedStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(false);
  const [temp_str, setTmpStr] = useState('');
  const [is_connected, setIsConnected] = useState(false);
  const [full_answers, setFullAnswers] = useState(all_answers);
  const bottomRef = useRef(null);
  const topRef = useRef(null);
  const activedRef = useRef(0);
  const isSocketCalled = useRef(0);
  const isAnswerCalled = useRef(0);

  useEffect(() => {
    if (loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [full_answers[state.index].detail[activedStep].des.length]);

  useEffect(() => {
    if (isSocketCalled.current === 0) {
      isSocketCalled.current = 1;
      socketConnect();
    }
  }, []);

  useEffect(() => {
    if (isAnswerCalled.current === 0) {
      isAnswerCalled.current = 1;
      activedRef.current = activedStep;
      getDetailAnswer(activedStep);
    }
  }, [activedStep]);

  const getDetailAnswer = (index) => {
    console.log('detail answer--', full_answers);
    if (full_answers[state.index].detail[activedStep].des === '') {
      setLoading(true);
      socketRef.current.emit(
        'chat',
        {
          sub_question: full_answers[state?.index].detail[index].title,
          main_question: search_query,
        },
        (e) => {
          console.log('e----e', e);
        }
      );
    }
  };

  const socketConnect = () => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL + '');
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Socket has connected -----');
    });
    socketRef.current.on('disconnect', (data) => {
      setIsConnected(false);
      console.log('--- disconnected ---');
    });
    socketRef.current.on('end', (data) => {
      console.log('socket ended -------');
      console.log(data);
      handleUpdateArray(data.text, activedRef.current);
      setTmpStr('');
      setLoading(false);
    });

    socketRef.current.on('response', async (data) => {
      setTmpStr((prevState) => {
        let result = prevState + data;
        handleUpdateArray(result, activedRef.current);
        return result;
      });
    });
  };

  const handleUpdateArray = (content, index) => {
    setFullAnswers((prevState) => {
      const updatedAnswer = prevState.map((answer, i) => {
        if (i !== state.index) {
          return answer;
        } else {
          return {
            ...answer,
            detail: answer.detail.map((detail_item, j) => {
              if (j === index) {
                return {
                  ...detail_item,
                  des: content,
                };
              } else {
                return detail_item;
              }
            }),
          };
        }
      });
      _setAnswers(updatedAnswer);
      return updatedAnswer;
    });
  };

  const totalSteps = () => {
    return 5;
  };

  const isLastStep = () => {
    return activedStep === totalSteps() - 1;
  };

  const handleNext = () => {
    if (isLastStep()) {
      navigate('/');
    } else {
      const newActiveStep = activedStep + 1;
      setActiveStep(newActiveStep);
      isAnswerCalled.current = 0;
      console.log('handleNext called');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

    isAnswerCalled.current = 0;
    console.log('handleBack called');
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
    isAnswerCalled.current = 0;
    console.log('handleStep called');
  };
  const handleComplete = () => {
    setFullAnswers((prevState) => {
      const updatedAnswer = prevState.map((answer, i) => {
        if (i !== state.index) {
          return answer;
        } else {
          return {
            ...answer,
            detail: answer.detail.map((detail_item, j) => {
              if (j === activedStep) {
                return {
                  ...detail_item,
                  mark: true,
                };
              } else {
                return detail_item;
              }
            }),
          };
        }
      });
      _setAnswers(updatedAnswer);
      return updatedAnswer;
    });
    handleNext();
  };

  const handleNone = () => {
    console.log('Can not any handle!!');
  };

  const StepIcon = ({ label }) => (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          color: colors.common.white,
          position: 'absolute',
          top: '-17px',
          left: '-12px',
          width: '32px',
          height: '32px',
          textAlign: 'center',
          lineHeight: '30px',
          border: 'solid 2px white',
          borderRadius: '50%',
        }}
      >
        {label}
      </div>
    </div>
  );

  const CompletedStepIcon = ({ label }) => (
    <div style={{ position: 'relative' }}>
      <CheckCircleRoundedIcon
        sx={{
          color: colors.common.white,
          fontSize: '32px',
        }}
      />
    </div>
  );

  const ActivedStepIcon = ({ label }) => (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          color: '#FF4B55',
          position: 'absolute',
          top: '-17px',
          left: '-12px',
          width: '32px',
          height: '32px',
          textAlign: 'center',
          lineHeight: '30px',
          border: 'solid 2px white',
          borderRadius: '50%',
          backgroundColor: colors.common.white,
        }}
      >
        {label}
      </div>
    </div>
  );

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };
  if (state) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <div className="w-full flex flex-row pt-8 pb-10 px-9 items-center  bg-bg-primary">
          <div className="basis-1/6">
            {/* {loading ? (
              <ArrowBackIosNewIcon
                sx={{ fontSize: '32px', color: 'bg_white.main' }}
              />
            ) : ( */}
            <Link to={{ pathname: '/' }}>
              <ArrowBackIosNewIcon
                sx={{ fontSize: '32px', color: 'bg_white.main' }}
              />
            </Link>
            {/* )} */}
          </div>
          <div className="basis-2/3  ">
            <Stepper
              nonLinear
              connector={null}
              activeStep={activedStep}
              className="flex justify-around"
            >
              {full_answers[state?.index].detail.map((item, index) => {
                return (
                  <Step key={index} completed={item.mark}>
                    <StepButton
                      color="inherit"
                      onClick={loading ? handleNone : handleStep(index)}
                      className="!p-0 !w-[32px] !h-[32px]"
                      icon={
                        item.mark === true ? (
                          <CompletedStepIcon label={index + 1} />
                        ) : activedStep === index ? (
                          <ActivedStepIcon label={index + 1} />
                        ) : (
                          <StepIcon label={index + 1} />
                        )
                      }
                    ></StepButton>
                  </Step>
                );
              })}
            </Stepper>
          </div>
          <div className="basis-1/6"></div>
        </div>
        <div className=" h-[85vh] rounded-t-3xl bg-bg-white pt-5 px-9 md:px-56 w-full pb-28 overflow-y-scroll -mt-5 fixed">
          <div ref={topRef} />
          <p className="text-ti font-semibold !font-futura my-4 text-center">
            {full_answers[state.index].detail[activedStep].title}
          </p>
          <Markdown
            remarkPlugins={[remarkGfm]}
            children={full_answers[state.index].detail[activedStep].des}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    children={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    style={dark}
                    className="!ml-8 my-1"
                  />
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
              ol(props) {
                const { children, className, node, ...rest } = props;
                return (
                  <div className="pl-8 my-4">
                    <ul {...rest} className="list-decimal list-inside">
                      {children}
                    </ul>
                  </div>
                );
              },

              ul(props) {
                const { children, className, node, ...rest } = props;
                return (
                  <div className="pl-8 my-4">
                    <ul {...rest} className="list-decimal list-inside">
                      {children}
                    </ul>
                  </div>
                );
              },

              li(props) {
                const { children, className, node, ...rest } = props;
                return (
                  <li {...rest} className="block">
                    {children}
                  </li>
                );
              },

              p(props) {
                const { children, className, node, ...rest } = props;
                return (
                  <p {...rest} className="my-3">
                    {children}
                  </p>
                );
              },

              a(props) {
                const { children, className, node, href, ...rest } = props;
                if (isValidUrl(href)) {
                  return (
                    <a
                      {...rest}
                      href={href}
                      className="text-text-hyperlink underline"
                      target="_blank"
                    >
                      {children}
                    </a>
                  );
                } else {
                  return null;
                }
              },

              h1(props) {
                const { children } = props;
                return (
                  <Typography variant="h4" className="!my-1" gutterBottom>
                    {children}
                  </Typography>
                );
              },
              h2(props) {
                const { children } = props;
                return (
                  <Typography variant="h5" className="!my-1" gutterBottom>
                    {children}
                  </Typography>
                );
              },
              h3(props) {
                const { children } = props;
                return (
                  <Typography variant="h6" className="!my-1" gutterBottom>
                    {children}
                  </Typography>
                );
              },
            }}
          />
          <div ref={bottomRef} />
        </div>
        <div className="fixed -bottom-[1px] w-full px-9 py-5 bg-gradient-to-t from-[#ffffff] from-50% via-80% to-transparent flex flex-row justify-around">
          <Button
            onClick={handleBack}
            disabled={activedStep === 0 || loading}
            variant="contained"
            className="basis-1/3 !bg-bg-white"
            size="medium"
            sx={{
              borderRadius: 4,
              py: 2,
              marginRight: 2,
              backgroundColor: 'bg_white.main',
              color: 'primary.main',
            }}
          >
            Prev
          </Button>
          {loading ? (
            <Button
              disabled={true}
              variant="contained"
              className="basis-2/3"
              sx={{ borderRadius: 4, py: 2, marginLeft: 2 }}
            >
              Generating...
              <CircularProgress size={16} color="bg_gray" />
            </Button>
          ) : (
            <Button
              endIcon={<CheckIcon />}
              onClick={handleComplete}
              variant="contained"
              className="basis-2/3"
              sx={{ borderRadius: 4, py: 2, marginLeft: 2 }}
            >
              Mark Complete
            </Button>
          )}
        </div>
      </Box>
    );
  } else {
    return <Navigate to="/" />;
  }
}
