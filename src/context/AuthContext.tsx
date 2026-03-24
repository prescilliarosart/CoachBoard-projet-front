import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";

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
