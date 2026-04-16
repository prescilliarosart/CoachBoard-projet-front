import {
	Box,
	Button,
	Chip,
	Paper,
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
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

const GREEN = "#22c55e";
const BG = "#0b1520";
const CARD_BG = "#0f1e2e";
const BORDER = "rgba(34,197,94,0.13)";

const navLinks = [
	{ label: "Programmes", path: "/mon-programme" },
	{ label: "Suivi", path: "/mon-suivi" },
];

function CourbeProgression({ suiviData = [] }: { suiviData?: any[] }) {
	const dataMap = new Map();
	suiviData.forEach((item) => {
		if (item.POIDS_CORPOREL && item.POIDS_CORPOREL > 0) {
			dataMap.set(item.DATE, parseFloat(item.POIDS_CORPOREL));
		}
	});

	const chartData = Array.from(dataMap.entries())
		.map(([date, poids]) => ({
			affichageDate: new Date(date).toLocaleDateString("fr-FR", {
				month: "short",
				day: "2-digit",
				timeZone: "Europe/Paris",
			}),
			poids: poids,
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

	console.log(chartData);

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

function grouperParSeance(data: any[]) {
	const map = new Map<string, any>();
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
		map.get(key).exercices.push(row.nom_exercice);
	}
	return Array.from(map.values()).sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
}

function getRessentiColor(ressenti: string) {
	switch (ressenti) {
		case "Facile":
			return "#6ffa60";
		case "Moyen":
			return "#fa7c15";
		case "Difficile":
			return "#fa151d";
	}
}

function TableauPerformances({ data }: { data: any[] }) {
	const seances = grouperParSeance(data);

	return (
		<Box>
			<Typography
				sx={{
					color: "#fff",
					fontFamily: "'Barlow Condensed', sans-serif",
					fontWeight: 600,
					fontSize: "1.2rem",
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
						{seances.map((seance) => (
							<TableRow
								key={`${seance.DATE}_${seance.titre_seance}`}
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
									{seance.POIDS_CORPOREL ? `${seance.POIDS_CORPOREL} kg` : "—"}
								</TableCell>
								<TableCell
									sx={{
										borderBottom: `1px solid ${BORDER}`,
									}}
								>
									<Chip
										label={seance.RESSENTI ?? "-"}
										size="small"
										sx={{
											bgcolor: `${getRessentiColor(seance.RESSENTI)}20`,
											color: getRessentiColor(seance.RESSENTI),
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
						))}
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
				minWidth: 220,
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

export default function MonSuivi() {
	const { user } = useAuth();
	const [suivi, setSuivi] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id) return;

			setLoading(true);
			try {
				const data = await apiFetch<any[]>(`/api/suivi/eleve/${user.id}`);
				setSuivi(data);
			} catch (err) {
				console.error("Erreur lors de la récupération :", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [user]);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: BG,
				fontFamily: "'Barlow Condensed', sans-serif",
			}}
		>
			<Navbar links={navLinks} profilLabel="Mon profil - élève" />
			<Toolbar />
			<Box sx={{ px: { xs: 2, md: 4 }, py: 3, maxWidth: 1600, mx: "auto" }}>
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
					Mon suivi 🏅
				</Typography>

				{loading ? (
					<Typography sx={{ color: GREEN, textAlign: "center", mt: 5 }}>
						Chargement de vos performances...
					</Typography>
				) : (
					<>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
								gap: 3,
								mb: 3,
							}}
						>
							<CourbeProgression suiviData={suivi} />
							<CalendrierProgres suivi={suivi} />
						</Box>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
								gap: 3,
								alignItems: "start",
							}}
						>
							<TableauPerformances data={suivi} />
							<CalculIMC />
						</Box>
					</>
				)}
			</Box>
		</Box>
	);
}
