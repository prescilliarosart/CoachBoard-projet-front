const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:3310").replace(
	/\/$/,
	"",
);

export async function apiFetch<T = unknown>(
	path: string,
	init: RequestInit = {},
): Promise<T> {
	const token = localStorage.getItem("token");

	const res = await fetch(`${BASE}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
			...init.headers,
		},
	});

	if (res.status === 401) {
		localStorage.removeItem("token");
		window.location.href = "/login";
		throw new Error("Session expirée");
	}

	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.error ?? `HTTP ${res.status}`);
	}

	return res.status === 204 ? (null as T) : res.json();
}
