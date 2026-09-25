import Joi from "joi";

const UserCreateValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  status: Joi.number().required(),
}).options({ allowUnknown: false });

export const loadCreateUserData = (data: unknown) => {
  return UserCreateValidation.validate(data);
};