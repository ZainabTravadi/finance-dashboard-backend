import Joi from 'joi';

const email = Joi.string().email().lowercase().trim().required();
const password = Joi.string().min(6).required();

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email,
  password,
});

export const loginSchema = Joi.object({
  email,
  password,
});

export const recordCreateSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().trim().min(2).max(100).required(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().trim().max(500).allow('').optional(),
});

export const recordUpdateSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().trim().min(2).max(100).optional(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().trim().max(500).allow('').optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required to update a record',
  });

export const validateBody = (schema, payload) => {
  return schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
};
