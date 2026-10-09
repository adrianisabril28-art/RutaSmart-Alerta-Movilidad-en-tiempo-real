import Joi from "joi";
import "dotenv/config";

export type ReturnEnvironmentVars = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
};

type ValidationEnvironmentVars = {
  error: Joi.ValidationError | undefined;
  value: ReturnEnvironmentVars;
};

function validateEnvVars(
  vars: NodeJS.ProcessEnv
): ValidationEnvironmentVars {
  const envSchema = Joi.object<ReturnEnvironmentVars>({
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().allow("").default(""),
    DB_NAME: Joi.string().required(),
  }).unknown(true);

  const { error, value } = envSchema.validate(vars, { stripUnknown: true });

  return { error, value: value as ReturnEnvironmentVars };
}

const loadEnvVars = (): ReturnEnvironmentVars => {
  const { error, value } = validateEnvVars(process.env);

  if (error) {
    throw new Error(`Error en variables de entorno: ${error.message}`);
  }

  return value;
};

const envs = loadEnvVars();

export default envs;