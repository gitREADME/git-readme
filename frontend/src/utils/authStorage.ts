export const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
export const AUTH_USER_STORAGE_KEY = "authUser";

export interface StoredAuthUser {
	login: string;
	githubId: number;
	perms: string;
}

export function getAccessToken() {
	if (typeof window === "undefined") {
		return null;
	}

	return window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function saveAuthSession(accessToken: string, user?: StoredAuthUser | null) {
	window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);

	if (user) {
		window.sessionStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
	}
}

export function saveAuthUser(user: StoredAuthUser) {
	window.sessionStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
	window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
	window.sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
}
