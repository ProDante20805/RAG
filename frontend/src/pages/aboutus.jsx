import { Box, SvgIcon } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { ReactComponent as LeftArrowIcon } from '../assets/svg/left_arrow.svg';

export default function AboutUs() {
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
          About Us
        </p>
        <p className="place-self-end mb-2 w-[32px]"></p>
      </div>
      <div className="absolute top-24 w-full px-9">
        <div className="bg-bg-white w-full rounded-3xl shadow-md py-12">
          <div className="px-6 flex-row jutify-center items-center">
            <p className="text-ti font-semibold !font-futura text-center font-semibold">
              Thank you!
            </p>
            <div className="text-base mt-8 font-medium">
              <p className="text-lg my-2">
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                – Reviving the Spirit of RC Flying in Canada
              </p>
              <p className="my-2">
                Welcome to{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                , a pioneering online platform where the sky is not the limit
                but just the beginning for fixed-wing RC plane enthusiasts
                across Canada. Born from a shared passion for RC aviation and a
                drive to reconnect pilots with the joy of their hobby,{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                is more than just a website – it's a thriving community and a
                hub for innovation.
              </p>
              <p className="my-2">
                In the face of new regulations and changing dynamics in the RC
                flying world, we recognized a growing need for a space that not
                only provides resources and guidance but also champions the
                voices and interests of RC pilots. That's where{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                takes flight, offering a blend of traditional community support
                with cutting-edge AI technology.
              </p>

              <p className="my-2">
                <b>Our Vision:</b>
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                envisions a vibrant, informed, and interconnected RC flying
                community in Canada. We aim to be the go-to platform for pilots
                seeking knowledge, support, and camaraderie in the RC world. By
                fostering a space where enthusiasts can freely share
                experiences, learn from each other, and have their regulatory
                concerns addressed, we're reigniting the excitement and freedom
                inherent in RC flying.
              </p>
              <div>
                <p className="font-bold">What We Offer:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>
                    <span className="font-bold">AI-Driven Assistance:</span>
                    Utilizing advanced AI, we provide instant, tailored
                    responses to your RC queries, making problem-solving faster
                    and more efficient.
                  </li>
                  <li>
                    <span className="font-bold">Community Forums: </span>A place
                    to connect, discuss, and share with fellow RC enthusiasts,
                    where both seasoned pilots and newcomers can find a home.
                  </li>
                  <li>
                    <span className="font-bold">Educational Resources: </span>
                    From beginners’ guides to expert tips, our resource library
                    is a treasure trove of information to enhance your flying
                    skills.
                  </li>
                  <li>
                    <span className="font-bold">
                      Advocacy and Representation:{' '}
                    </span>
                    We're not just a platform; we're your voice.{' '}
                    <a
                      className="text-text-hyperlink underline"
                      href="https://www.rcpilots.ai"
                    >
                      {` RCPC.ai `}
                    </a>
                    actively engages in advocacy to ensure fair and enjoyable
                    flying experiences for all.
                  </li>
                  <li>
                    <span className="font-bold">Events and Engagement: </span>
                    Bringing the virtual community into the real world, our
                    events, newsletter and forums are designed to strengthen
                    bonds and create unforgettable flying experiences.
                  </li>
                </ul>
              </div>
              <p className="my-2">
                <span className="font-bold">Our Journey: </span>
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                began as a vision to bridge the gap between RC hobbyists and the
                resources they need. As we grow, each new member, each piece of
                feedback, and each shared story shapes and enriches our
                platform. We're in the early stages of development, but with a
                community as passionate as ours, the possibilities are endless.
              </p>
              <p className="my-2">
                <span className="font-bold">Join Us: </span>
                Whether you're a lifelong RC pilot or just starting,{' '}
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>
                invites you to be part of a community where your passion for RC
                flying can truly take flight. Join us, and let's soar into the
                future of RC aviation together!
              </p>
              <p className="my-2 font-bold">
                <a
                  className="text-text-hyperlink underline"
                  href="https://www.rcpilots.ai"
                >
                  {` RCPC.ai `}
                </a>{' '}
                – Where Passion Meets Possibility in the Sky!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
