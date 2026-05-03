import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),

    PORT: Joi.number().port().default(3000),

    JWT_ACCESS_TOKEN_EXPIRE: Joi.string()
        .pattern(/^\d+(ms|s|m|h|d|w|y)$/)
        .required(),

    JWT_REFRESH_TOKEN_EXPIRE: Joi.string()
        .pattern(/^\d+(ms|s|m|h|d|w|y)$/)
        .required(),

    DATABASE_HOST: Joi.string().required(),

    DATABASE_PORT: Joi.number().default(5432),
});

