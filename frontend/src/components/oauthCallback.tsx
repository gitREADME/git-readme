import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { authApiFn } from "@/api/authApi";
import { clearAuthSession, getAccessToken, saveAuthSession } from "@/utils/authStorage";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/store/authSlice";
import { Loader2 } from "lucide-react";

const OAuthCallback = () => {
	const [searchParams] = useSearchParams();
	const dispatch = useAppDispatch();

	const redirectToDashboard = () => {
		window.location.replace("/dashboard");
	};

	const withTimeout = async <T,>(promise: Promise<T>, timeoutMs = 8000) => {
		let timeoutId: number | undefined;

		try {
			return await Promise.race([
				promise,
				new Promise<T>((_, reject) => {
					timeoutId = window.setTimeout(() => {
						reject(new Error("Request timed out"));
					}, timeoutMs);
				}),
			]);
		} finally {
			if (timeoutId) {
				window.clearTimeout(timeoutId);
			}
		}
	};

	useEffect(() => {
		const code = searchParams.get("code");
		if (!code) {
			const timeoutId = window.setTimeout(() => {
				window.location.replace("/");
			}, 2500);

			return () => window.clearTimeout(timeoutId);
		}

		let cancelled = false;
		const tryCompleteLogin = async () => {
			if (cancelled) {
				return;
			}

			const storedToken = getAccessToken();
			if (storedToken) {
				try {
					const currentUserResponse = await withTimeout(authApiFn.fetchCurrentUser());
					if (cancelled || !currentUserResponse.success || !currentUserResponse.data) {
						return;
					}

					dispatch(setAuth(currentUserResponse.data));
					redirectToDashboard();
					return;
				} catch {
					clearAuthSession();
				}
			}

			try {
				const exchangeResponse = await withTimeout(authApiFn.exchangeOAuthCode(code));
				const accessToken = exchangeResponse.data?.accessToken;

				if (!accessToken) {
					return;
				}

				const exchangeUser = exchangeResponse.data?.user;
				saveAuthSession(accessToken, exchangeUser ? {
					login: exchangeUser.username,
					githubId: exchangeUser.githubId,
					perms: "normal",
				} : null);

				if (cancelled) {
					return;
				}

				if (exchangeUser) {
					dispatch(setAuth({
						isAuthenticated: true,
						login: exchangeUser.username,
						githubId: exchangeUser.githubId,
						perms: "normal",
					}));
				}

				const cleanUrl = new URL(window.location.href);
				cleanUrl.searchParams.delete("code");
				window.history.replaceState({}, document.title, cleanUrl.pathname);
				redirectToDashboard();
			} catch {
				// Keep polling until the code exchange completes or the token appears in storage.
			}
		};

		void tryCompleteLogin();

		const pollTimer = window.setInterval(() => {
			void tryCompleteLogin();
		}, 1200);

		return () => {
			cancelled = true;
			window.clearInterval(pollTimer);
		};
	}, [dispatch, searchParams]);

	return (
		<main className="flex min-h-dvh items-center justify-center bg-zinc-950 px-6 text-white">
			<div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
				<Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
				<span className="text-sm text-zinc-300">Loading...</span>
			</div>
		</main>
	);
};

export default OAuthCallback;