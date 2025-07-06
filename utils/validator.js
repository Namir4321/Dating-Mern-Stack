const z = require("zod");

const genederEnum = z.enum(["male", "female", "other"], {
  errorMap: () => ({
    message: "Invalid gender value. Allowed: male, female, other",
  }),
});
const skillsSchema = z.array(z.string()).default([]).optional();
const validationWithZodSchema = async (data, schema) => {
  try {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.errors.map((error) => error.message);
      console.log(errors.join(", "));
      throw new Error(errors.join(", "));
    }
    return result.data;
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
};

const userSignUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").trim(),
    lastName: z.string().min(1, "Last name is required").trim().optional(),
    email: z.string().email("Invalid email format").trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .trim(),
    gender: genederEnum.optional(),
    age: z
      .number({ invalid_type_error: "Age must be a number" })
      .min(18, "Age must be at least 18")
      .optional(),
    photoUrl: z
      .string()
      .url("Invalid URL format")
      .default("https://example.com/default-profile.png")
      .optional(),
    skills: skillsSchema.optional(),
  })
  .strict();
  const userSignInSchema = z.object({
  email: z.string().email("Invalid email format").trim(),   
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .trim(),  
});
module.exports = {
  validationWithZodSchema,
  userSignUpSchema,
  userSignInSchema,
};
