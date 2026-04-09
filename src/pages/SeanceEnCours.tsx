import {
	Box,
	Button,
	LinearProgress,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

type Exercice = {
	ID_SEANCES_EXERCICES: number;
	NOM_EXERCICE: string;
	SERIES: number;
	REPS: number;
	CHARGE: number;
	REPOS: number;
	ORDRE: number;
	GROUPE_MUSCULAIRE: string;
};

type GifData = {
	nom: string;
	gif_url: string;
	muscles: string[];
};

const elevLinks = [
	{ label: "Programmes", path: "/mon-programme" },
	{ label: "Suivi", path: "/mon-suivi" },
];

const SX_IN = {
	"& .MuiOutlinedInput-root": {
		background: "#111e2c",
		borderRadius: "6px",
		fontFamily: "'Barlow',sans-serif",
		fontSize: "0.88rem",
		color: "#e2e8f0",
		"& fieldset": { borderColor: "rgba(34,197,94,0.18)" },
		"&:hover fieldset": { borderColor: "rgba(34,197,94,0.4)" },
		"&.Mui-focused fieldset": { borderColor: "#22c55e" },
	},
	"& .MuiInputLabel-root": { color: "#7a8fa6", fontSize: "0.82rem" },
	"& .MuiInputLabel-root.Mui-focused": { color: "#22c55e" },
};

function getGif(ex: Exercice, gifs: GifData[]): string | null {
	const nomLower = ex.NOM_EXERCICE.toLowerCase().trim();
	const muscles = ex.GROUPE_MUSCULAIRE ? ex.GROUPE_MUSCULAIRE.split(", ") : [];

	const byNom = gifs.find(
		(g) =>
			g.nom.toLowerCase().includes(nomLower) ||
			nomLower.includes(g.nom.toLowerCase()),
	);
	if (byNom) return byNom.gif_url;

	if (muscles.length > 0) {
		const byMuscle = gifs.find((g) =>
			g.muscles?.some((m) => muscles.includes(m)),
		);
		if (byMuscle) return byMuscle.gif_url;
	}

	return null;
}
