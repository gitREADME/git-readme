import { z } from "zod";
import { RequestValidationSchema } from "../error/validateMiddleware.js";


interface UserValidations {
	pushReadmeSchema: RequestValidationSchema;
	exchangeOAuthCodeSchema: RequestValidationSchema;
}

export const userValidations: UserValidations = {
	pushReadmeSchema: z.object({
		body: z.object({
			readmeContent: z.string().min(1, "README content is required"),
		}),
	}),
	exchangeOAuthCodeSchema: z.object({
		body: z.object({
			code: z.string().min(1, "OAuth exchange code is required"),
		}),
	}),
};