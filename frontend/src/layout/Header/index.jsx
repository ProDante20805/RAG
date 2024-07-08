import { Avatar, Box, Grid } from '@mui/material';
import Logo from 'assets/images/logo.png';
import AvatarImage from 'assets/images/avatar.png';

import { useAuth } from 'hooks/useAuth';

const NormalHeader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100px',
        backgroundColor: 'primary.main',
      }}
    >
      <img src={Logo} className="w-[80px] h-[80px]" alt="archey logo" />
    </Box>
  );
};

const AuthHeader = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        width: '100%',
        height: '80px',
        paddingLeft: '32px',
        backgroundColor: '#070b10',
        color: 'white',
      }}
    >
      <Grid container>
        <Grid item md={2}>
          <img
            src={Logo}
            alt="archey logo"
            className="mr-8"
            style={{ width: '60px' }}
          />
        </Grid>
        <Grid
          item
          md={8}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            paddingLeft: '2rem',
          }}
        >
          {/* <Link to="/home/brand-guidelines" className="text-2xl mr-8 font-bold">
            Brand Guidelines
          </Link>
          <Link to="/home/archetype-explorer" className="text-2xl font-bold">
            Archetype Explorer
          </Link> */}
        </Grid>
        <Grid
          item
          md={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
            paddingRight: '20px',
          }}
        >
          <Avatar src={AvatarImage} alt="avatar image" />
          <p className="ml-2 cursor-pointer" onClick={handleLogout}>
            Log out
          </p>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function Header({ authenticated = false }) {
  return authenticated ? <AuthHeader /> : <NormalHeader />;
}
