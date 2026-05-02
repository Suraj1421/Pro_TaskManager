import { ApiError } from '../utils/apiError.js';

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return next(new ApiError('Validation failed', 400, result.error.flatten()));
  }

  req.body = result.data.body ?? req.body;
  req.params = result.data.params ?? req.params;
  req.query = result.data.query ?? req.query;

  return next();
};

export default validate;
