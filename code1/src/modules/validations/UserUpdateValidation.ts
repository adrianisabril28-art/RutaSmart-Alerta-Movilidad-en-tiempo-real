import Joi from "joi";

const UserUpdateValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  status: Joi.number(),
})
  .min(1)
  .options({ allowUnknown: false });

export const loadUpdateUserData = (data: unknown) => {
  return UserUpdateValidation.validate(data);
};