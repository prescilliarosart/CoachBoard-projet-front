import {
	Box,
	Button,
	Chip,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import CalendrierProgres from "../components/CalendrierProgres";
import Navbar from "../components/Navbar";
import { apiFetch } from "../services/api";
import type { Eleve, Suivi, SuiviAvecDetails } from "../types";

// ─── Constantes ───────────────────────────────────────────────────────────────

const GREEN = "#22c55e";
const BG = "#0b1520";
const CARD_BG = "#0f1e2e";
const BORDER = "rgba(34,197,94,0.13)";

const navLinks = [
	{ label: "Programmes", path: "/programmes" },
	{ label: "Séances", path: "/seances" },
	{ label: "Exercices", path: "/exercices" },
];

// ─── Types locaux ─────────────────────────────────────────────────────────────

interface SeanceGroupee {
	date: string;
	titre_seance: string;
	RESSENTI: string | null;
	POIDS_CORPOREL: number | null;
	exercices: string[];
}

// ─── Fonctions utilitaires ────────────────────────────────────────────────────

function grouperParSeance(data: SuiviAvecDetails[]): SeanceGroupee[] {
	const map = new Map<string, SeanceGroupee>();
	for (const row of data) {
		const key = `${row.DATE}_${row.titre_seance}`;
		if (!map.has(key)) {
			map.set(key, {
				date: row.DATE,
				titre_seance: row.titre_seance,
				RESSENTI: row.RESSENTI,
				POIDS_CORPOREL: row.POIDS_CORPOREL,
				exercices: [],
			});
		}
		map.get(key)?.exercices.push(row.nom_exercice);
	}
	return Array.from(map.values()).sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
}

function getRessentiColor(ressenti: string): string {
	switch (ressenti) {
		case "Facile":
			return "#6ffa60";
		case "Moyen":
			return "#fa7c15";
		case "Difficile":
			return "#fa151d";
		default:
			return "#7a8fa6";
	}
}

// ─── Placeholders temporaires ─────────────────────────────────────────────────

function CourbeProgression(_props: { suiviData?: Suivi[] }) {
	return <Box />;
}

function TableauPerformances(_props: { data: SuiviAvecDetails[] }) {
	return <Box />;
}

function CalculIMC() {
	return <Box />;
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function SuiviCoach() {
	const [eleves, setEleves] = useState<Eleve[]>([]);
	const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
	const [suivi, setSuivi] = useState<SuiviAvecDetails[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEleves = async () => {
			try {
				const data = await apiFetch<Eleve[]>("/api/eleves");
				setEleves(data);
				if (data.length > 0) setSelectedEleve(data[0]);
			} catch (err) {
				console.error("Erreur chargement élèves :", err);
			}
		};
		fetchEleves();
	}, []);

	useEffect(() => {
		if (!selectedEleve) return;
		const fetchSuivi = async () => {
			setLoading(true);
			try {
				const data = await apiFetch<SuiviAvecDetails[]>(
					`/api/suivi/eleve/${selectedEleve.ID_ELEVE}`,
				);
				setSuivi(data);
			} catch (err) {
				console.error("Erreur chargement suivi :", err);
			} finally {
				setLoading(false);
			}
		};
		fetchSuivi();
	}, [selectedEleve]);

	return (
		<Box>{loading ? <Typography>Chargement...</Typography> : <Box />}</Box>
	);
}
