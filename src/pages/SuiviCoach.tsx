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

function CourbeProgression({ suiviData = [] }: { suiviData?: Suivi[] }) {
	const dataMap = new Map<string, number>();
	suiviData.forEach((item) => {
		if (item.POIDS_CORPOREL && item.POIDS_CORPOREL > 0) {
			dataMap.set(item.DATE, item.POIDS_CORPOREL);
		}
	});

	const chartData = Array.from(dataMap.entries())
		.map(([date, poids]) => ({
			affichageDate: new Date(date).toLocaleDateString("fr-FR", {
				month: "short",
				day: "2-digit",
				timeZone: "Europe/Paris",
			}),
			poids,
			rawDate: new Date(date).getTime(),
		}))
		.sort((a, b) => a.rawDate - b.rawDate);

	const maxPoids =
		chartData.length > 0 ? Math.max(...chartData.map((d) => d.poids)) : 0;

	if (chartData.length === 0) {
		return (
			<Paper
				sx={{
					background: CARD_BG,
					border: `1px solid ${BORDER}`,
					borderRadius: 2,
					p: 2,
					height: 268,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Typography
					sx={{
						color: "#7a8fa6",
						fontFamily: "'Barlow Condensed', sans-serif",
					}}
				>
					Aucune donnée de poids enregistrée
				</Typography>
			</Paper>
		);
	}

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
					fontSize: "1rem",
					fontFamily: "'Barlow Condensed', sans-serif",
					letterSpacing: "0.08em",
					mb: 1,
				}}
			>
				Évolution du poids corporel
			</Typography>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart
					data={chartData}
					margin={{ top: 20, right: 20, left: -15, bottom: 5 }}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="rgba(255,255,255,0.05)"
						vertical={false}
					/>
					<XAxis
						dataKey="affichageDate"
						padding={{ left: 0, right: 0 }}
						tick={{
							fill: "#7a8fa6",
							fontSize: 14,
							fontFamily: "'Barlow Condensed', sans-serif",
						}}
						axisLine={{ stroke: BORDER }}
						tickLine={false}
					/>
					<YAxis
						tick={{ fill: "#7a8fa6", fontSize: 14 }}
						axisLine={false}
						tickLine={false}
						domain={["dataMin - 5", "dataMax + 5"]}
					/>
					<Tooltip
						contentStyle={{
							background: "#0b1520",
							border: `1px solid ${GREEN}`,
							borderRadius: 6,
							fontFamily: "'Barlow Condensed', sans-serif",
							color: "#fff",
						}}
						itemStyle={{ color: "#fff" }}
						labelStyle={{ color: "#7a8fa6" }}
						cursor={{ fill: "rgba(255,255,255,0.05)" }}
						formatter={(value) => [`${value} KG`, "Poids"]}
					/>
					<Bar dataKey="poids" radius={[3, 3, 0, 0]} barSize={30}>
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.poids === maxPoids ? GREEN : "rgba(34,197,94,0.45)"}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</Paper>
	);
}
// ─── Placeholders temporaires ─────────────────────────────────────────────────

function TableauPerformances({ data }: { data: SuiviAvecDetails[] }) {
	const seances = grouperParSeance(data);

	return (
		<Box>
			<TableContainer
				component={Paper}
				sx={{
					background: CARD_BG,
					border: `1px solid ${BORDER}`,
					borderRadius: 2,
				}}
			>
				<Table size="medium">
					<TableHead>
						<TableRow>
							{[
								"Date",
								"Séance",
								"Poids corporel",
								"Ressenti",
								"Exercices",
							].map((col) => (
								<TableCell
									key={col}
									sx={{
										color: "#7a8fa6",
										fontFamily: "'Barlow Condensed', sans-serif",
										fontSize: "1rem",
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
						{seances.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									sx={{
										textAlign: "center",
										color: "#7a8fa6",
										fontFamily: "'Barlow Condensed', sans-serif",
										py: 4,
										border: "none",
									}}
								>
									Aucune séance enregistrée pour cet élève.
								</TableCell>
							</TableRow>
						) : (
							seances.map((seance) => (
								<TableRow
									key={`${seance.date}_${seance.titre_seance}`}
									sx={{ "&:last-child td": { border: 0 } }}
								>
									<TableCell
										sx={{
											color: GREEN,
											fontFamily: "'Barlow Condensed', sans-serif",
											fontWeight: 700,
											borderBottom: `1px solid ${BORDER}`,
										}}
									>
										{new Date(seance.date).toLocaleDateString("fr-FR", {
											day: "2-digit",
											month: "short",
											year: "numeric",
											timeZone: "Europe/Paris",
										})}
									</TableCell>
									<TableCell
										sx={{
											color: "#fff",
											fontFamily: "'Barlow Condensed', sans-serif",
											borderBottom: `1px solid ${BORDER}`,
										}}
									>
										{seance.titre_seance}
									</TableCell>
									<TableCell
										sx={{
											color: "#fff",
											fontFamily: "'Barlow Condensed', sans-serif",
											borderBottom: `1px solid ${BORDER}`,
										}}
									>
										{seance.POIDS_CORPOREL
											? `${seance.POIDS_CORPOREL} kg`
											: "—"}
									</TableCell>
									<TableCell sx={{ borderBottom: `1px solid ${BORDER}` }}>
										<Chip
											label={seance.RESSENTI ?? "-"}
											size="small"
											sx={{
												bgcolor: `${getRessentiColor(seance.RESSENTI ?? "-")}20`,
												color: getRessentiColor(seance.RESSENTI ?? "-"),
												fontWeight: 600,
												fontFamily: "'Barlow Condensed', sans-serif",
											}}
										/>
									</TableCell>
									<TableCell
										sx={{
											color: "#fff",
											fontFamily: "'Barlow Condensed', sans-serif",
											borderBottom: `1px solid ${BORDER}`,
										}}
									>
										{seance.exercices.join(", ")}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}

function CalculIMC() {
	const [taille, setTaille] = useState("170");
	const [poids, setPoids] = useState("65");
	const [imc, setImc] = useState<number | null>(null);

	const calculer = () => {
		const t = Number.parseFloat(taille) / 100;
		const p = Number.parseFloat(poids);
		if (t > 0 && p > 0) setImc(Math.round((p / (t * t)) * 10) / 10);
	};

	const getImcLabel = (val: number) => {
		if (val < 18.5)
			return { label: "Insuffisance pondérale", color: "#60a5fa" };
		if (val < 25) return { label: "Poids normal", color: GREEN };
		if (val < 30) return { label: "Surpoids", color: "#facc15" };
		return { label: "Obésité", color: "#ef4444" };
	};

	return (
		<Paper
			sx={{
				background: CARD_BG,
				border: `1px solid ${BORDER}`,
				borderRadius: 2,
				p: 2,
				width: 220,
			}}
		>
			<Typography
				sx={{
					color: GREEN,
					fontFamily: "'Barlow Condensed', sans-serif",
					fontWeight: 700,
					fontSize: "0.9rem",
					letterSpacing: "0.06em",
					mb: 2,
					textAlign: "center",
				}}
			>
				Calcul de l'IMC
			</Typography>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
				{[
					{ label: "Taille (cm)", value: taille, set: setTaille },
					{ label: "Poids (kg)", value: poids, set: setPoids },
				].map(({ label, value, set }) => (
					<Box
						key={label}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 1,
						}}
					>
						<Typography
							sx={{
								color: "#fff",
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: "0.88rem",
							}}
						>
							{label}
						</Typography>
						<TextField
							value={value}
							onChange={(e) => set(e.target.value)}
							size="small"
							sx={{
								width: 80,
								"& .MuiInputBase-input": {
									color: "#fff",
									fontFamily: "'Barlow Condensed', sans-serif",
									textAlign: "right",
									fontSize: "0.88rem",
								},
								"& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER },
								"&:hover .MuiOutlinedInput-notchedOutline": {
									borderColor: GREEN,
								},
							}}
						/>
					</Box>
				))}
				<Button
					onClick={calculer}
					fullWidth
					sx={{
						background: GREEN,
						color: "#0b1520",
						fontFamily: "'Barlow Condensed', sans-serif",
						fontWeight: 700,
						fontSize: "0.85rem",
						borderRadius: 1,
						mt: 0.5,
						"&:hover": { background: "#16a34a" },
					}}
				>
					Calculer
				</Button>
				{imc !== null && (
					<Box sx={{ textAlign: "center", mt: 1 }}>
						<Typography
							sx={{
								color: getImcLabel(imc).color,
								fontFamily: "'Barlow Condensed', sans-serif",
								fontWeight: 700,
								fontSize: "1.4rem",
							}}
						>
							{imc}
						</Typography>
						<Typography
							sx={{
								color: getImcLabel(imc).color,
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: "0.8rem",
							}}
						>
							{getImcLabel(imc).label}
						</Typography>
					</Box>
				)}
			</Box>
		</Paper>
	);
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
