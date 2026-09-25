import Joi from "joi";

const EmailValidation = Joi.object({
  email: Joi.string().email().required(),
}).options({ allowUnknown: false });

export const loadEmailData = (data: unknown) => {
  return EmailValidation.validate(data);
};