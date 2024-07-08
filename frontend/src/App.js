import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from 'pages/home';
import SignUp from 'pages/sign/signup';
import SignIn from 'pages/sign/signin';
import Forgot from 'pages/sign/forgot';
import VerifyEmail from 'pages/sign/verify_email';
import ProfileDetail from 'pages/profile/detail';
import ProfileHome from 'pages/profile/index';
import ProfileEdit from 'pages/profile/edit';
import ProfileTcdoc from 'pages/profile/tcdoc';
import InviteFriend from 'pages/profile/invite';
import News from 'pages/news';
import Resources from 'pages/resources';
import Dashboard from 'pages/dashboard';
import ExamSupport from 'pages/exam_support';
import Comments from 'pages/news/comments';
import LearnModule from 'pages/learn';
import ContactUs from 'pages/contactus';
import UserPolicy from 'pages/userpolicy';
import PrivacyPolicy from 'pages/privacypolicy';
import AboutUs from 'pages/aboutus';
import Working from 'pages/working';
import Notification from 'pages/notification';
import { ProtectedRoute } from 'components/routes/protected';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

import './App.css';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#FF4B55',
        text: {
          main: '#242424',
          second: '#98A4A8',
          input_bg: '#F5F6F6',
        },
      },
      secondary: purple,
      bg_white: {
        main: '#FFFFFF',
        light: '#FFFFFF',
        // dark: will be calculated from palette.secondary.main,
        contrastText: '#FFFFFF',
      },
      bg_gray: '#98A4A8',
      bg_light_gray: '#F5F5F5',
      button_gray: {
        main: '#F5F6F6',
        light: '#F5F5F5',
        // dark: will be calculated from palette.secondary.main,
        contrastText: '#242424',
      },
    },
  });
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1, height: '100vh' }}>
          {/* <BrowserRouter> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exam_support" element={<ExamSupport />} />
            <Route exact path="/" element={<ProtectedRoute />}>
              <Route exact path="/profile/" element={<ProfileHome />}></Route>
              <Route
                exact
                path="/profile/detail"
                element={<ProfileDetail />}
              ></Route>
              <Route
                exact
                path="/profile/edit"
                element={<ProfileEdit />}
              ></Route>
              <Route
                exact
                path="/profile/tcdoc"
                element={<ProfileTcdoc />}
              ></Route>

              <Route
                exact
                path="/profile/invite"
                element={<InviteFriend />}
              ></Route>

              <Route exact path="/news" element={<News />} />
              <Route exact path="/news/comments" element={<Comments />} />
              <Route exact path="/notification" element={<Notification />} />
            </Route>

            <Route path="/forgot" element={<Forgot />} />
            <Route path="/learn" element={<LearnModule />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/userpolicy" element={<UserPolicy />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/working" element={<Working />} />
          </Routes>
          {/* </BrowserRouter> */}
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
