const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
import userService from './user.service';

const verificationCode = (length) => {
  let result = '';
  const characters = '0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const deliverEmail = async ({ email, message = '', user_name = null }) => {
  console.log('userEmail----', email);
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || '' });
  const v_code = verificationCode(6);
  let messageData;
  try {
    if (message === '') {
      messageData = {
        from: 'RCPC AI TEAM <noreply@rcpilots.ai> ',
        to: email,
        subject: 'Welcome to RCPC AI',
        text: `Your verification code is ${v_code}.`,
      };
      const user = await userService.getUserByEmail(email);
      await userService.updateUserById(user.id, { v_code });
    } else {
      messageData = {
        from: 'RCPC AI TEAM <RCPC@rcpilots.ai>',
        to: email,
        subject: `${user_name} has invited you to join the RCPC.ai community!`,
        text: `You are invited : ${message}.`,
        html: `<html>Message from ${user_name}:<br/><br/> ${message} <br/><br/> Message from  <a href='https://www.rcpilots.ai'> RCPC.ai</a> team: <br/><br/> You've been invited to join  <a href='https://www.rcpilots.ai'> RCPC.ai</a>, a dynamic and growing community dedicated to fixed-wing RC plane enthusiasts! ${user_name}, a fellow pilot and member of  <a href='https://www.rcpilots.ai'> RCPC.ai</a>, thought you’d be a perfect fit for our sky-high adventures.<br/><br/>
      What’s in store for you at  <a href='https://www.rcpilots.ai'> RCPC.ai</a>?
      <ul style=" margin: 2px 0px 2px -20px; !important">
        <li>Connect with a network of passionate RC pilots across Canada.</li>
        <li>Access a wealth of resources, from AI-driven tutorials to expert tips.</li>
        <li>Engage in discussions, share stories, and exchange ideas in our vibrant forums.</li>
        <li>Shape the future of this platform with your insights and experiences.</li>
      </ul>
      Ready to embark on this exciting journey? Simply click the link below to accept the invitation and start exploring the world of  <a href='https://www.rcpilots.ai'> RCPC.ai</a>.
      It's time to let your RC passions soar!
      <br/><br/>
      Accept Invitation
      <br/><br/>
      We can’t wait to welcome you aboard and see how you’ll contribute to the diverse tapestry of our community.</br>
      Happy landings, The  <a href='https://www.rcpilots.ai'> RCPC.ai</a> Team <br/><br/>  P.S. The sky’s the limit when we fly together. Join us, and let's make  <a href='https://www.rcpilots.ai'> RCPC.ai</a> the ultimate haven for RC pilots! 🌟</html>`,
      };
    }

    return await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);
  } catch (error) {
    console.log('sending email with mailgun is errir', error);
    throw new ApiError(httpStatus.FORBIDDEN, error);
  }
};

const contactUs = async ({ email, message, full_name }) => {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || '' });
  let messageData;
  try {
    messageData = {
      from: 'RCPC AI TEAM <noreply@rcpilots.ai> ',
      to: process.env.CONTACT_EMAIL,
      subject: `${full_name} contacts you from rcpilots.ai`,
      html: `<html>name : ${full_name}<br/> email : ${email} </br> message: ${message}</html>`,
    };

    return await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);
  } catch (error) {
    console.log('contac us sending email', error);
    throw new ApiError(httpStatus.FORBIDDEN, error);
  }
};

const verifyEmail = async ({ code, email }) => {
  try {
    const user = await userService.getUserByEmail(email);
    if (await user.isVcodeMatch(code)) {
      userService.updateUserById(user.id, { is_EV: true });
      return user;
    } else {
      return false;
    }
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
};

const generateCodeForPwd = (email) => {
  deliverEmail({ email });
};

module.exports = {
  deliverEmail,
  verifyEmail,
  contactUs,
  generateCodeForPwd,
};
