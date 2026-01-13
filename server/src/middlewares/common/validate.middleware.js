import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError } from "../../utility/helpers.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.VALIDATION_ERROR.CODE,
      errors[0]?.message
    );
  }

  req.body = result.data;
  next();
};
