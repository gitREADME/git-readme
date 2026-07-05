import jwt from "jsonwebtoken";

export interface JwtUserPayload {
	githubId: string;
	username: string;
}

const ACCESS_TOKEN_EXPIRES_IN = "15m";

function getJwtSecret() {
	const jwtSecret = process.env.JWT_SECRET;

	if (!jwtSecret) {
		throw new Error("JWT_SECRET is required to sign and verify access tokens");
	}

	return jwtSecret;
}

export function assertJwtSecretConfigured() {
	getJwtSecret();
}

export function signAccessToken(payload: JwtUserPayload) {
	return jwt.sign(payload, getJwtSecret(), {
		expiresIn: ACCESS_TOKEN_EXPIRES_IN,
	});
}

export function verifyAccessToken(token: string): JwtUserPayload {
	const decoded = jwt.verify(token, getJwtSecret());

	if (typeof decoded === "string") {
		throw new Error("Invalid JWT payload");
	}

	const githubId = decoded.githubId;
	const username = decoded.username;

	if (typeof githubId !== "string" || typeof username !== "string") {
		throw new Error("Invalid JWT payload");
	}

	return {
		githubId,
		username,
	};
}