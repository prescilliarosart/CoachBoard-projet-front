import { jwtDecode } from "jwt-decode";
import { createContext, type ReactNode, useContext, useState } from "react";

export type User = {
	id: number;
	email: string;
	role: "coach" | "eleve";
	prenom: string;
	nom: string;
};

type AuthContextType = {
	user: User | null;
	token: null | string;
	login: (token: string) => User | undefined;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		const savedToken = localStorage.getItem("token");
		if (savedToken) {
			try {
				return jwtDecode<User>(savedToken);
			} catch {
				return null;
			}
		}
		return null;
	});
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token"),
	);

	const login = (token: string) => {
		try {
			const result = jwtDecode<User>(token);
			localStorage.setItem("token", token);
			setToken(token);
			setUser(result);
			return result;
		} catch {
			console.error("Token invalide");
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
	return context;
}
