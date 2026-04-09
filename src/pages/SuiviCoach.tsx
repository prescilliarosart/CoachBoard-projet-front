import {
	Box,
	Button,
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
import { useState } from "react";
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
import Navbar from "../components/Navbar";

const GREEN = "#22c55e";
const BG = "#0b1520";
const CARD_BG = "#0f1e2e";
const BORDER = "rgba(34,197,94,0.13)";

const navLinks = [
	{ label: "Programmes", path: "/programmes" },
	{ label: "Séances", path: "/seances" },
	{ label: "Exercices", path: "/exercices" },
	{ label: "Élèves", path: "/eleves" },
	{ label: "Suivi", path: "/suivi" },
];

const exercicesDisponibles = ["Squat", "Développé couché", "Soulevé de terre"];

const progressionData: Record<string, { semaine: string; poids: number }[]> = {
	Squat: [
		{ semaine: "S1", poids: 75 },
		{ semaine: "S2", poids: 78 },
		{ semaine: "S3", poids: 80 },
		{ semaine: "S4", poids: 83 },
		{ semaine: "S5", poids: 90 },
		{ semaine: "S6", poids: 87 },
		{ semaine: "S7", poids: 95 },
	],
	"Développé couché": [
		{ semaine: "S1", poids: 60 },
		{ semaine: "S2", poids: 62 },
		{ semaine: "S3", poids: 65 },
		{ semaine: "S4", poids: 65 },
		{ semaine: "S5", poids: 67 },
		{ semaine: "S6", poids: 70 },
		{ semaine: "S7", poids: 72 },
	],
	"Soulevé de terre": [
		{ semaine: "S1", poids: 100 },
		{ semaine: "S2", poids: 105 },
		{ semaine: "S3", poids: 107 },
		{ semaine: "S4", poids: 110 },
		{ semaine: "S5", poids: 115 },
		{ semaine: "S6", poids: 112 },
		{ semaine: "S7", poids: 120 },
	],
};

const performancesData = [
	{ id: 1, poids: "95 KG", exercice: "Squat", repetition: 5, effort: "4/5" },
	{
		id: 2,
		poids: "72 KG",
		exercice: "Développé couché",
		repetition: 8,
		effort: "3/5",
	},
	{
		id: 3,
		poids: "120 KG",
		exercice: "Soulevé de terre",
		repetition: 3,
		effort: "5/5",
	},
];
