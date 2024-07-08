import { useState, useEffect } from 'react';
import { SvgIcon, IconButton, Button, TextField } from '@mui/material';
import { KeyboardArrowLeft as KeyboardArrowLeftIcon } from '@mui/icons-material';
import instance from 'utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as MailBoxIcon } from '../../assets/svg/mailbox.svg';

const InputField = (props) => {
  return (
    <TextField
      name={props.name}
      InputProps={{
        maxLength: props.length,
        type: 'number',
        pattern: 'd*',
        inputtype: 'numeric',
        sx: { borderRadius: '15px', fontSize: '26px' },
      }}
      onChange={props.handleChange}
      onKeyDown={props.handleKeyDown}
      className="w-12 h-16 border border-slate-500 !text-sti py-3 px-3.5"
    />
  );
};

export default function VerifyEmail() {
  const { state } = useLocation();

  const [code, setCode] = useState('');
  const [v_error, setVerifyError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVerifyError('');
    const { maxLength, value, name } = e.target;
    const [, fieldIndex] = name.split('-');
    let fieldIntIndex = parseInt(fieldIndex, 10);

    let code = '';
    for (let i = 1; i <= 6; i++) {
      const item = document.querySelector(`input[name=field-${i}]`);
      code += item.value;
    }
    setCode(code);

    if (value.length > 1 && fieldIntIndex !== '6') {
      console.log(fieldIndex);
      for (let j = 1; j <= 6; j++) {
        document.querySelector(`input[name=field-${j}]`).value = value.charAt(
          j - 1
        );
        document.querySelector(`input[name=field-${j}]`).blur();
      }
      // document.querySelector(`input[name=field-6]`).focus();
    } else if (value.length > 1 && fieldIntIndex === '6') {
      document.querySelector(`input[name=field-6]`).value = value.charAt(0);
    } else {
      // Check if no of char in field == maxlength
      if (value.length >= maxLength) {
        // It should not be last input field
        if (fieldIntIndex < 6) {
          // Get the next input field using it's name
          const nextfield = document.querySelector(
            `input[name=field-${fieldIntIndex + 1}]`
          );

          // If found, focus the next field
          if (nextfield !== null) {
            nextfield.focus();
          }
        } else if (fieldIntIndex === 6) {
          document.querySelector(`input[name=field-6]`).value = value.charAt(0);
          console.log('hi');
          // document.querySelector(`input[name=field-6]`).blur();
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 8) {
      setVerifyError('');
      const { value, name } = e.target;
      const [, fieldIndex] = name.split('-');

      let fieldIntIndex = parseInt(fieldIndex, 10);

      if (value.length === 0) {
        if (fieldIntIndex >= 0) {
          const prevfield = document.querySelector(
            `input[name=field-${fieldIntIndex - 1}]`
          );
          if (prevfield !== null) {
            prevfield.focus();
          }
        }
      }
    }
  };

  const sendEmail = () => {
    instance
      .post('/email/sendEmail', {
        email: state.email,
      })
      .then((res) => {
        console.log('Sent email successful');
        console.log('in email verification page has responsed', res);
      })
      .catch((err) => {
        console.log('email verification page have some error', err);
      });
  };
  useEffect(() => {
    if (state === null) {
      goBack();
    } else {
      sendEmail();
    }
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    const result = await instance.post('/email/verifyEmail', {
      code,
      email: state.email,
    });
    console.log('verify result----', result);
    if (result.data === false) {
      setVerifyError('verify code is wrong!!');
      console.log('verify code is wrong!!');
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="w-full h-full overflow-y-scroll py-8 px-9">
      <div className="flex-row">
        <div
          className="!bg-bg-gray rounded-lg w-[56px] h-[56px] flex justify-center items-center"
          onClick={goBack}
        >
          <IconButton aria-label="back">
            <KeyboardArrowLeftIcon />
          </IconButton>
        </div>

        <p className="text-ti !font-futura font-semibold mt-12">
          Email Verification
        </p>

        <div className="flex-row my-8">
          <p className="text-text-gray text-base">We have sent a code to </p>
          <p className="text-text-gray text-base">
            {state
              ? `${state.email.split('@')[0].substr(0, 3)}*********@${
                  state.email.split('@')[1]
                }`
              : ''}
          </p>
        </div>

        <div className="flex justify-around my-8">
          <InputField
            name="field-1"
            length="1"
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
          />
          <InputField
            name="field-2"
            length="1"
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
          />
          <InputField
            name="field-3"
            length="1"
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
          />
          <InputField
            name="field-4"
            length="1"
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
          />
          <InputField
            name="field-5"
            length="1"
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
          />
          <InputField
            name="field-6"
            length="1"
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
          />
        </div>
        <div className="text-bg-primary justify-center flex">{v_error}</div>

        <div className="flex flex-row justify-center my-14">
          <p className="text-base text-text-main font-medium">
            Did not receive the code?
          </p>
          <p
            className="text-bg-primary text-base ml-1 font-medium"
            onClick={sendEmail}
          >
            Resend
          </p>
        </div>

        <Button
          size="medium"
          variant="contained"
          className="w-full !py-4 !rounded-xl my-8"
          onClick={handleSubmit}
        >
          {' '}
          Continue
        </Button>

        <div className="w-full flex justify-center mt-16 mb-4">
          <SvgIcon
            component={MailBoxIcon}
            inheritViewBox
            sx={{ width: '176px', height: '151px' }}
          />
        </div>
      </div>
    </div>
  );
}
