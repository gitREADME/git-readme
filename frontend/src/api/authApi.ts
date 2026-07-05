import { axiosGet, axiosPost } from "./axiosMethods";
import type { Response } from "./response";
import type { authState } from "@/store/authSlice";

export interface OAuthExchangeUser {
	githubId: number;
	username: string;
}

export interface OAuthExchangeResponseData {
	accessToken: string;
	user: OAuthExchangeUser;
}

interface CurrentUserResponse extends Response<authState> {}

interface ExchangeResponse extends Response<OAuthExchangeResponseData> {}

interface LogoutResponse extends Response<null> {}

const fn = {
	fetchCurrentUser: async () => {
		const res = await axiosGet<CurrentUserResponse>(
			`${import.meta.env.VITE_BACKEND_URL}/api/user/auth/me`,
		);
		return res;
	},
	exchangeOAuthCode: async (code: string) => {
		const res = await axiosPost<ExchangeResponse, { code: string }>(
			`${import.meta.env.VITE_BACKEND_URL}/api/user/auth/exchange`,
			{ code },
		);
		return res;
	},
	logoutUser: async () => {
		const res = await axiosPost<LogoutResponse>(
			`${import.meta.env.VITE_BACKEND_URL}/api/user/auth/github/logout`,
		);
		return res;
	},
};

export { fn as authApiFn };