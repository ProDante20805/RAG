import { Box, SvgIcon } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { ReactComponent as LeftArrowIcon } from '../assets/svg/left_arrow.svg';

export default function Working() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
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
          <button onClick={goBack}>
            <SvgIcon
              component={LeftArrowIcon}
              inheritViewBox
              sx={{ fontSize: '32px' }}
              className="text-bg-primary"
            ></SvgIcon>
          </button>
        </div>
        <p className="text-ti !font-futura  text-bg-white font-semibold">
          Working...
        </p>
        <p className="place-self-end mb-2 w-[32px]"></p>
      </div>
      <div className="absolute top-24 w-full px-9">
        <div className="bg-bg-white w-full rounded-3xl shadow-md py-12">
          <div className="px-6 flex-row jutify-center items-center">
            <p className="text-ti font-semibold !font-futura text-center font-semibold">
              Thank you!
            </p>
            <div className="text-lg mt-8 font-medium">
              <p className="my-2">
                Coming Soon! We are working on it, please visit again later!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
