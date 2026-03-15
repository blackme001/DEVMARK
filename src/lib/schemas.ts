import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
});

export const signupSchema = z
    .object({
        firstName: z.string().min(2, "First name is too short"),
        lastName: z.string().min(2, "Last name is too short"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        role: z.enum(["buyer", "seller", "both"]),
        field: z.string().min(2, "Please select your professional field"),
        techStack: z.string().min(1, "Please enter your tech stack (comma separated)"),
        agreeTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
    })
    .refine((data) => data.password.length >= 8, {
        message: "Password is too weak",
        path: ["password"],
    });

export const projectUploadSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    category: z.string().min(1, "Please select a category"),
    price: z.number().min(1, "Price must be at least 1 USD"),
    techStack: z.string().min(1, "Please enter at least one technology"),
    demoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProjectUploadInput = z.infer<typeof projectUploadSchema>;
