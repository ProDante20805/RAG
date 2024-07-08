import { Box, SvgIcon } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { ReactComponent as LeftArrowIcon } from '../assets/svg/left_arrow.svg';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
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
          Privacy and Policy
        </p>
        <p className="place-self-end mb-2 w-[32px]"></p>
      </div>
      <div className="absolute top-24 w-full px-9">
        <div className="bg-bg-white w-full rounded-3xl shadow-md pt-12 pb-16">
          <div className="px-6 flex-row jutify-center items-center">
            <div className="text-base mt-2 font-medium">
              <p className="text-ti font-semibold !font-futura text-center font-semibold">
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                Privacy and Policy
              </p>

              <p className="my-2">Last Updated: [October 26, 2023]</p>
              <p className="my-2">
                Welcome to{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                ! We are committed to protecting your privacy and ensuring the
                security of your personal information. This Privacy Policy
                outlines how we collect , use, disclose, and protect your
                information when you use our website and services. By using{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  RCPC.ai
                </a>{' '}
                , you agree to the terms of this Privacy Policy.
              </p>

              <p className="text-lg my-2">1.Information We Collect</p>
              <p className=" my-2">1.1. Personal Information</p>
              <p className=" my-2">
                We collect personal information that you voluntarily provide to
                us when you register for an account, create a profile,
                participate in our forums, or sign up for our newsletter. This
                may include your name, email address, location, and any other
                information you choose to provide.
              </p>

              <p className=" my-2">1.2. Usage Information</p>
              <p className=" my-2">
                We collect information about your interactions with{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                , including the pages you visit, the content you view, and the
                search queries you make.
              </p>

              <p className=" my-2">1.3. Cookies and Tracking Technologies</p>
              <p className=" my-2">
                We use cookies and other tracking technologies to collect
                information about your use of{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                and to personalize your experience.
              </p>
              <p className="text-lg my-2">2.How We Use Your Information</p>
              <p className=" my-2">2.1. To Provide and Improve Our Services</p>
              <p className=" my-2">
                We use your information to provide, maintain, and improve
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                , to respond to your queries, and to personalize your
                experience.
              </p>

              <p className=" my-2">2.2. To Communicate With You</p>
              <p className=" my-2">
                We use your information to send you updates, newsletters, and
                other communications related to{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                .
              </p>

              <p className=" my-2">2.3. For Research and Development</p>
              <p className=" my-2">
                We use your information to understand how users interact with
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                , to identify trends, and to develop new features and services.
              </p>

              <p className="text-lg my-2">3.How We Share Your Information</p>
              <p className=" my-2">3.1. With Service Providers</p>
              <p className=" my-2">
                We may share your information with third-party service providers
                who assist us in providing{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                .
              </p>

              <p className=" my-2">3.2. For Legal Reasons</p>
              <p className=" my-2">
                We may disclose your information if required by law or if we
                believe such disclosure is necessary to protect our rights,
                protect your safety or the safety of others, or comply with a
                legal process.
              </p>

              <p className=" my-2">3.3. For Legal Reasons</p>
              <p className=" my-2">
                We may share your information with third parties when we have
                your consent to do so.
              </p>

              <p className="text-lg my-2">4.Data Protection</p>
              <p className=" my-2">4.1. Security</p>
              <p className=" my-2">
                We take reasonable measures to protect your information from
                unauthorized access, disclosure, alteration, and destruction.
              </p>

              <p className=" my-2">4.2. Data Retention</p>
              <p className=" my-2">
                We retain your information for as long as your account is active
                or as needed to provide you with{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                , and for a reasonable period thereafter as required by law or
                for business purposes.
              </p>

              <p className="text-lg my-2">5. Your Choices</p>
              <p className=" my-2">5.1. Account Information</p>
              <p className=" my-2">
                You may update, correct, or delete your account information at
                any time by logging into your account.
              </p>

              <p className=" my-2">5.2. Data Retention</p>
              <p className=" my-2">
                You can set your browser to reject cookies or to notify you when
                cookies are being sent. However, please note that some features
                of{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                may not function properly if cookies are disabled.
              </p>

              <p className="text-lg my-2">6. Changes to This Privacy Policy</p>
              <p className=" my-2">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the updated Privacy Policy
                on{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                . Your continued use of{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                after any changes signifies your acceptance of the updated
                Privacy Policy.
              </p>

              <p className="text-lg my-2">7. Contact Us</p>
              <p className=" my-2">
                If you have any questions about this Privacy Policy, please
                contact us at{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai/contactus"
                >
                  {` Contact Us `}
                </a>
                . Thank you for being a part of the{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                community. We are committed to protecting your privacy and
                creating a safe and enjoyable experience for all users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
