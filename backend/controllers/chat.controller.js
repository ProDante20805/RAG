import { getMainCourses, getSubTitles } from '../utils/pinecone-helper';

export const getMainCourse = async (req) => {
  console.log('getMainCourse called : ', req.body);
  return getMainCourses(req.body);
};

export const getSubTitle = async (req) => {
  console.log('getSubTitle called: ', req.body);
  return getSubTitles(req.body);
};
