import { NextFunction, Request, Response } from "express";
import appError from "../error/appError.js";
import { verifyAccessToken } from "./jwt.js";

export default function isLoggedIn(req: Request, res: Response, next: NextFunction) {
	const authorizationHeader = req.header("Authorization");

	if (!authorizationHeader) {
		return next(new appError(401, "Missing Authorization header"));
	}

	const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
	if (!match) {
		return next(new appError(401, "Malformed Bearer token"));
	}

	try {
		req.user = verifyAccessToken(match[1].trim());
		return next();
	} catch (error) {
		if (error instanceof Error && error.name === "TokenExpiredError") {
			return next(new appError(401, "Token expired"));
		}

		return next(new appError(401, "Invalid token"));
	}
} 


