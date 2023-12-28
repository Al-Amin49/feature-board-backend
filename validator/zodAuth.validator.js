
//validation with zod 
import {z} from 'zod';

const signupValidationSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .trim()
    .min(4, { message: "username must be at least 4 characters" })
    .max(255, { message: "username must not be more than 255 characters" }),

  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email format" }),

  password: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password must be at least 6 characters" })
    .max(255, { message: "password must not be more than 255 characters" }),
});
//login validation 
const loginValidationSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email format" }),

  password: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password must be at least 6 characters" })
    .max(255, { message: "password must not be more than 255 characters" }),
});



export const zodAuthValidationSchema={signupValidationSchema, loginValidationSchema}
