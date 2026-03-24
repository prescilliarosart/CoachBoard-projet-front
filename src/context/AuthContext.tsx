import { jwtDecode } from "jwt-decode";
import { createContext, type ReactNode, useState } from "react";

export type User = {
	id: number;
	email: string;
	role: "coach" | "eleve";
};

type AuthContextType = {
	user: User | null;
	token: null | string;
	login: (token: string) => void;
	logout: () => void;
};

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);

	const login = (token: string) => {
		try {
			const result = jwtDecode<User>(token);
			localStorage.setItem("token", token);
			setToken(token);
			setUser(result);
		} catch {
			console.error("Token ilvalide");
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
	};
}
