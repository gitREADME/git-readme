import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { clearAuthSession } from '@/utils/authStorage'
import { clearAuth } from '@/store/authSlice'
import { store } from '@/store/store'

type RequestConfig = Omit<AxiosRequestConfig, 'url' | 'method' | 'data' | 'withCredentials'>

const apiClient = axios.create()

apiClient.interceptors.request.use((config) => {
	const accessToken = typeof window === 'undefined' ? null : window.sessionStorage.getItem('accessToken')

	if (accessToken) {
		config.headers = axios.AxiosHeaders.from({
			...(config.headers ?? {}),
			Authorization: `Bearer ${accessToken}`,
		})
	}

	return config
})

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			clearAuthSession()
			store.dispatch(clearAuth())

			const requestUrl = error.config?.url ?? ''
			const isAuthRoute = /\/api\/user\/auth\/(exchange|github|me|github\/logout)/.test(requestUrl)
			const currentPath = typeof window === 'undefined' ? '' : window.location.pathname
			const shouldRedirect = !isAuthRoute && currentPath !== '/' && currentPath !== '/oauth/callback'

			if (shouldRedirect && typeof window !== 'undefined') {
				window.location.assign('/')
			}
		}

		return Promise.reject(error)
	},
)

const mergeConfig = (config?: RequestConfig): AxiosRequestConfig => ({
	...(config ?? {}),
})

export const axiosGet = async <TResponse = unknown>(
	url: string,
	config?: RequestConfig,
): Promise<TResponse> => {
	const response: AxiosResponse<TResponse> = await apiClient.get(url, mergeConfig(config))
	return response.data
}

export const axiosPost = async <TResponse = unknown, TPayload = unknown>(
	url: string,
	payload?: TPayload,
	config?: RequestConfig,
): Promise<TResponse> => {
	const response: AxiosResponse<TResponse> = await apiClient.post(url, payload, mergeConfig(config))
	return response.data
}

export const axiosPut = async <TResponse = unknown, TPayload = unknown>(
	url: string,
	payload?: TPayload,
	config?: RequestConfig,
): Promise<TResponse> => {
	const response: AxiosResponse<TResponse> = await apiClient.put(url, payload, mergeConfig(config))
	return response.data
}

export const axiosDelete = async <TResponse = unknown, TPayload = unknown>(
	url: string,
	payload?: TPayload,
	config?: RequestConfig,
): Promise<TResponse> => {
	const response: AxiosResponse<TResponse> = await apiClient.delete(url, {
		...mergeConfig(config),
		data: payload,
	})
	return response.data
}
