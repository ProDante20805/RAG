const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const catchAsyncReqRes = (fn) => (req, res) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    throw new Error(err);
  });
};

export { catchAsync, catchAsyncReqRes };
