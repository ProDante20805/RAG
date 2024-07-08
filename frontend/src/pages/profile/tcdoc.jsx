import { useState, createRef } from 'react';
import { SvgIcon, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { ReactComponent as LeftArrowIcon } from '../../assets/svg/left_arrow.svg';
import { ReactComponent as DownloadIcon } from '../../assets/svg/download.svg';

export default function ProfileTcdoc() {
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const inputFileRef = createRef(null);
  const [pdf, _setPDF] = useState(null);
  const [pdf_file, setPDFData] = useState(null);

  const cleanup = () => {
    URL.revokeObjectURL(pdf);
    inputFileRef.current.value = null;
  };

  const setPDF = (newPDF) => {
    if (pdf) {
      cleanup();
    }
    _setPDF(newPDF);
  };
  const handleSelectedFile = async (event) => {
    const newPDF = event.target?.files?.[0];

    if (newPDF) {
      setPDFData(newPDF);
      setPDF(URL.createObjectURL(newPDF));
    }
  };

  return (
    <div className="w-full h-full bg-bg-primary">
      <div className="inline-flex w-full justify-between pt-8 px-9 items-center">
        <div>
          <Link to={{ pathname: '/profile' }} className="text-bg-primary">
            <SvgIcon
              component={LeftArrowIcon}
              inheritViewBox
              sx={{ fontSize: '32px' }}
            ></SvgIcon>
          </Link>
        </div>
        <p className="text-bg-white text-ti font-semibold !font-futura text-center">
          TC document
        </p>

        <div className="place-self-end mb-2"></div>
      </div>

      <div className="mt-5 h-full rounded-t-3xl  py-5 px-9 md:px-56 w-full bg-bg-white p-4">
        <div className="flex justify-between">
          <div className="flex-row">
            <p className="text-ti font-semibold !font-futura">RC-145894556</p>
            <p className="text-text-gray">RPAS Registration</p>
          </div>
          <div className="flex justify-center items-center">
            <IconButton component="label">
              <SvgIcon
                component={DownloadIcon}
                inheritViewBox
                sx={{ fontSize: '24px' }}
                className="text-bg-primary rotate-180"
              ></SvgIcon>
              <VisuallyHiddenInput
                type="file"
                accept=".pdf"
                onChange={handleSelectedFile}
              />
            </IconButton>
          </div>
        </div>
        <Button
          component="label"
          variant="contained"
          className="shadow w-full h-[200px] mt-4"
          color="button_gray"
          sx={{ marginTop: '12px' }}
        >
          No File, Please select the File
          <VisuallyHiddenInput
            type="file"
            accept=".pdf"
            onChange={handleSelectedFile}
          />
        </Button>

        <div className="flex justify-between mt-4">
          <div className="flex-row">
            <p className="text-ti font-semibold !font-futura">C-2343454545</p>
            <p className="text-text-gray">RPAS Registration</p>
          </div>
          <div className="flex justify-center items-center">
            <IconButton component="label">
              <SvgIcon
                component={DownloadIcon}
                inheritViewBox
                sx={{ fontSize: '24px' }}
                className="text-bg-primary rotate-180"
              ></SvgIcon>
              <VisuallyHiddenInput
                type="file"
                accept=".pdf"
                onChange={handleSelectedFile}
              />
            </IconButton>
          </div>
        </div>
        <Button
          component="label"
          variant="contained"
          className="shadow w-full h-[200px] mt-4"
          color="button_gray"
          sx={{ marginTop: '12px' }}
        >
          No File, Please select the File
          <VisuallyHiddenInput
            type="file"
            accept=".pdf"
            onChange={handleSelectedFile}
          />
        </Button>
      </div>
    </div>
  );
}
