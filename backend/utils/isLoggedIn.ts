import { NextFunction, Request, Response } from "express";
import appError from "../error/appError.js";

export default function isLoggedIn(req : Request , res : Response , next : NextFunction){
	if(process.env.NODE_ENV === "test") return next(); //for testing purposes

console.log({
  sessionID: req.sessionID,
  githubId: req.session.githubId,
  cookieHeader: req.headers.cookie,
  origin: req.headers.origin,
});
	
	if(req.session && req.session.githubId){
		next();
	}
	else{
		return next(new appError(401 , "Unauthorized"));
	}
} 

