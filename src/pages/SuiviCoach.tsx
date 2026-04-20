import {
	Box,
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

function CourbeProgression() {
	const [exercice, setExercice] = useState("Squat");
	const data = progressionData[exercice];
	const maxPoids = Math.max(...data.map((d) => d.poids));

	return (
		<Paper
			sx={{
				background: CARD_BG,
				border: `1px solid ${BORDER}`,
				borderRadius: 2,
				p: 2,
			}}
		>
			<Typography
				sx={{
					color: "#7a8fa6",
					fontSize: "0.78rem",
					fontFamily: "'Barlow Condensed', sans-serif",
					letterSpacing: "0.08em",
					mb: 1,
				}}
			>
				Courbe de progression
			</Typography>
			<FormControl size="small" sx={{ mb: 2, minWidth: 160 }}>
				<InputLabel
					sx={{
						color: GREEN,
						fontFamily: "'Barlow Condensed', sans-serif",
						fontSize: "0.85rem",
					}}
				>
					Exercices
				</InputLabel>
				<Select
					value={exercice}
					label="Exercices"
					onChange={(e) => setExercice(e.target.value)}
					sx={{
						color: GREEN,
						fontFamily: "'Barlow Condensed', sans-serif",
						fontSize: "0.85rem",
						"& .MuiOutlinedInput-notchedOutline": { borderColor: GREEN },
						"& .MuiSvgIcon-root": { color: GREEN },
					}}
				>
					{exercicesDisponibles.map((ex) => (
						<MenuItem
							key={ex}
							value={ex}
							sx={{
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: "0.85rem",
							}}
						>
							{ex}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<ResponsiveContainer width="100%" height={220}>
				<BarChart
					data={data}
					margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="rgba(255,255,255,0.05)"
					/>
					<XAxis
						dataKey="semaine"
						tick={{
							fill: "#7a8fa6",
							fontSize: 11,
							fontFamily: "'Barlow Condensed', sans-serif",
						}}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{
							fill: "#7a8fa6",
							fontSize: 11,
							fontFamily: "'Barlow Condensed', sans-serif",
						}}
						axisLine={false}
						tickLine={false}
					/>
					<Tooltip
						contentStyle={{
							background: "#0b1520",
							border: `1px solid ${GREEN}`,
							borderRadius: 6,
							fontFamily: "'Barlow Condensed', sans-serif",
							color: "#fff",
						}}
						formatter={(value) => [`${String(value)} KG`, "Poids"]}
					/>
					<Bar dataKey="poids" radius={[3, 3, 0, 0]}>
						{data.map((entry) => (
							<Cell
								key={entry.semaine}
								fill={entry.poids === maxPoids ? GREEN : "rgba(34,197,94,0.45)"}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</Paper>
	);
}

function PhotoPlaceholder() {
	return (
		<Paper
			sx={{
				background: CARD_BG,
				border: `1px solid ${BORDER}`,
				borderRadius: 2,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				minHeight: 280,
				position: "relative",
				overflow: "hidden",
			}}
		>
			<Box
				component="svg"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
			>
				<line
					x1="0"
					y1="0"
					x2="100"
					y2="100"
					stroke="rgba(34,197,94,0.15)"
					strokeWidth="0.5"
					vectorEffect="non-scaling-stroke"
				/>
				<line
					x1="100"
					y1="0"
					x2="0"
					y2="100"
					stroke="rgba(34,197,94,0.15)"
					strokeWidth="0.5"
					vectorEffect="non-scaling-stroke"
				/>
			</Box>
			<Typography
				sx={{
					color: "#7a8fa6",
					fontFamily: "'Barlow Condensed', sans-serif",
					fontSize: "0.9rem",
					zIndex: 1,
				}}
			>
				Texte ou photo à voir
			</Typography>
		</Paper>
	);
}

function TableauPerformances() {
	return (
		<Box>
			<Typography
				sx={{
					color: "#fff",
					fontFamily: "'Barlow Condensed', sans-serif",
					fontWeight: 600,
					fontSize: "1rem",
					mb: 2,
					letterSpacing: "0.04em",
				}}
			>
				Suivi des performances
			</Typography>
			<TableContainer
				component={Paper}
				sx={{
					background: CARD_BG,
					border: `1px solid ${BORDER}`,
					borderRadius: 2,
				}}
			>
				<Table size="small">
					<TableHead>
						<TableRow>
							{["Poids", "Exercices", "Répétition", "Effort 1/5"].map((col) => (
								<TableCell
									key={col}
									sx={{
										color: "#7a8fa6",
										fontFamily: "'Barlow Condensed', sans-serif",
										fontSize: "0.82rem",
										borderBottom: `1px solid ${BORDER}`,
										letterSpacing: "0.05em",
									}}
								>
									{col}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{performancesData.map((row) => (
							<TableRow key={row.id} sx={{ "&:last-child td": { border: 0 } }}>
								<TableCell
									sx={{
										color: GREEN,
										fontFamily: "'Barlow Condensed', sans-serif",
										fontWeight: 700,
										borderBottom: `1px solid ${BORDER}`,
									}}
								>
									{row.poids}
								</TableCell>
								<TableCell
									sx={{
										color: "#fff",
										fontFamily: "'Barlow Condensed', sans-serif",
										borderBottom: `1px solid ${BORDER}`,
									}}
								>
									{row.exercice}
								</TableCell>
								<TableCell
									sx={{
										color: "#fff",
										fontFamily: "'Barlow Condensed', sans-serif",
										borderBottom: `1px solid ${BORDER}`,
									}}
								>
									{row.repetition}
								</TableCell>
								<TableCell
									sx={{
										color: "#fff",
										fontFamily: "'Barlow Condensed', sans-serif",
										borderBottom: `1px solid ${BORDER}`,
									}}
								>
									{row.effort}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}

export default function SuiviCoach() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: BG,
				fontFamily: "'Barlow Condensed', sans-serif",
			}}
		>
			<Navbar links={navLinks} profilLabel="Profil" />
			<Toolbar />
			<Box sx={{ px: { xs: 2, md: 4 }, py: 3, maxWidth: 1200, mx: "auto" }}>
				<Typography
					variant="h5"
					sx={{
						color: "#fff",
						fontFamily: "'Barlow Condensed', sans-serif",
						fontWeight: 700,
						letterSpacing: "0.04em",
						mb: 3,
					}}
				>
					Suivi de mes élèves 🏅
				</Typography>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
						gap: 3,
						mb: 3,
					}}
				>
					<CourbeProgression />
					<PhotoPlaceholder />
				</Box>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
						gap: 3,
						alignItems: "start",
					}}
				>
					<TableauPerformances />
				</Box>
			</Box>
		</Box>
	);
}
