import zod from "zod";

// zod validation for user signup schema
const signupSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
  firstName: zod
    .string()
    .min(2, "First name must be at least 2 characters long"),
  lastName: zod.string().min(2, "Last name must be at least 2 characters long"),
});

// zod validation for user signin schema
const signinSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
});

export { signupSchema, signinSchema };
