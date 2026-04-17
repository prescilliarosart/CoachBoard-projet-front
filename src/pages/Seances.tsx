import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Toolbar,
	Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useMemo, useState } from "react";
import FormSeance from "../components/FormSeances";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { apiFetch } from "../services/api";
import type { SeanceAvecProgramme } from "../types";

export default function Seances() {
	const [seances, setSeances] = useState<SeanceAvecProgramme[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");
	const [jourFilter, setJourFilter] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSeances = async () => {
			try {
				const data = await apiFetch<[]>("/api/seances");
				setSeances(data);
			} catch (err) {
				console.error("Erreur chargement séances :", err);
			} finally {
				setLoading(false);
			}
		};
		fetchSeances();
	}, []);

	const handleDelete = async (id: number) => {
		try {
			await apiFetch(`/api/seances/${id}`, { method: "DELETE" });
			setSeances(seances.filter((s) => s.ID_SEANCE !== id));
		} catch (err) {
			console.error("Erreur suppression séance :", err);
		}
	};
	const filteredSeances = useMemo(
		() =>
			seances.filter(
				(s) =>
					(s.TITRE.toLowerCase().includes(search.toLowerCase()) ||
						s.nom_programme.toLowerCase().includes(search.toLowerCase()) ||
						(s.JOUR ?? "").toLowerCase().includes(search.toLowerCase())) &&
					(jourFilter === "" || s.JOUR === jourFilter),
			),
		[search, jourFilter, seances],
	);
	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Seances", path: "/seances" },
					{ label: "Exercices", path: "/exercices" },
				]}
				profilLabel="Profil"
			/>
			<Toolbar />
			<Box
				sx={{
					px: "36px",
					py: "18px",
					borderBottom: "1px solid rgba(34,197,94,0.18)",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					position: "relative",
					zIndex: 2,
				}}
			>
				<Typography
					sx={{
						fontFamily: "'Barlow Condensed',sans-serif",
						fontStyle: "italic",
						fontWeight: 700,
						fontSize: "1.6rem",
						color: "#e2e8f0",
						textTransform: "uppercase",
					}}
				>
					Séances personnalisées
				</Typography>
				<Button
					onClick={() => setShowForm(!showForm)}
					startIcon={<AddIcon sx={{ fontSize: 15 }} />}
					sx={{
						background: "#22c55e",
						color: "#0b1520",
						fontFamily: "'Barlow Condensed',sans-serif",
						fontStyle: "italic",
						fontWeight: 700,
						fontSize: "0.85rem",
						textTransform: "uppercase",
						px: "16px",
						py: "7px",
						borderRadius: "4px",
						transition: "all 0.2s",
						"&:hover": {
							background: "#16a34a",
							transform: "translateY(-1px)",
							boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
						},
					}}
				>
					{showForm ? "Annuler" : "Créer une séance"}
				</Button>
			</Box>

			<Box
				sx={{
					display: "flex",
					gap: "16px",
					alignItems: "center",
					mb: 2,
					px: "36px",
				}}
			>
				<TextField
					placeholder="Rechercher une séance"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					size="small"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon sx={{ color: "#7a8fa6", fontSize: 18 }} />
							</InputAdornment>
						),
					}}
					sx={{
						"& .MuiOutlinedInput-root": {
							background: "#111e2c",
							borderRadius: "6px",
							fontFamily: "'Barlow',sans-serif",
							fontSize: "0.88rem",
							color: "#e2e8f0",
							height: "40px",
							"& fieldset": { borderColor: "rgba(34,197,94,0.18)" },
							"&:hover fieldset": { borderColor: "rgba(34,197,94,0.4)" },
							"&.Mui-focused fieldset": { borderColor: "#22c55e" },
						},
						"& input::placeholder": { color: "#7a8fa6" },
					}}
				/>
				<FormControl size="small">
					<InputLabel
						sx={{
							color: "#7a8fa6",
							fontSize: "0.82rem",
							"&.Mui-focused": { color: "#22c55e" },
						}}
					>
						Jour
					</InputLabel>
					<Select
						value={jourFilter}
						label="Jour"
						onChange={(e) => setJourFilter(e.target.value)}
						sx={{
							background: "#111e2c",
							color: "#e2e8f0",
							fontFamily: "'Barlow',sans-serif",
							fontSize: "0.88rem",
							borderRadius: "6px",
							minWidth: 160,
							height: "40px",
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(34,197,94,0.18)",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(34,197,94,0.4)",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "#22c55e",
							},
							"& .MuiSvgIcon-root": { color: "#7a8fa6" },
						}}
						MenuProps={{
							PaperProps: {
								sx: {
									background: "#0f1b27",
									border: "1px solid rgba(34,197,94,0.18)",
									"& .MuiMenuItem-root": {
										fontFamily: "'Barlow',sans-serif",
										fontSize: "0.88rem",
										color: "#e2e8f0",
										"&:hover": { background: "rgba(34,197,94,0.08)" },
										"&.Mui-selected": {
											background: "rgba(34,197,94,0.12)",
											color: "#22c55e",
										},
									},
								},
							},
						}}
					>
						<MenuItem value="">
							<em style={{ color: "#7a8fa6" }}>Tous</em>
						</MenuItem>
						<MenuItem value="Lundi">Lundi</MenuItem>
						<MenuItem value="Mardi">Mardi</MenuItem>
						<MenuItem value="Mercredi">Mercredi</MenuItem>
						<MenuItem value="Jeudi">Jeudi</MenuItem>
						<MenuItem value="Vendredi">Vendredi</MenuItem>
						<MenuItem value="Samedi">Samedi</MenuItem>
						<MenuItem value="Dimanche">Dimanche</MenuItem>
					</Select>
				</FormControl>
			</Box>

			<Box
				sx={{
					background: "#1E293B",
					borderRadius: "12px",
					padding: "24px",
					margin: "40px 36px",
				}}
			>
				{showForm && (
					<FormSeance
						onSuccess={() => {
							setShowForm(false);
						}}
					/>
				)}
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: "#fff" }}>Titre</TableCell>
							<TableCell sx={{ color: "#fff" }}>Jour</TableCell>
							<TableCell sx={{ color: "#fff" }}>Ordre</TableCell>
							<TableCell sx={{ color: "#fff" }}>Programme associé</TableCell>
							<TableCell sx={{ color: "#fff" }}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell
									colSpan={5}
									sx={{ textAlign: "center", py: 6, border: "none" }}
								>
									<CircularProgress sx={{ color: "#22c55e" }} />
								</TableCell>
							</TableRow>
						) : filteredSeances.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									sx={{
										textAlign: "center",
										py: 6,
										color: "#7a8fa6",
										fontFamily: "'Barlow',sans-serif",
										border: "none",
									}}
								>
									Aucune séance pour l'instant.
								</TableCell>
							</TableRow>
						) : (
							filteredSeances.map((seance) => (
								<TableRow key={seance.ID_SEANCE}>
									<TableCell sx={{ color: "#fff" }}>{seance.TITRE}</TableCell>
									<TableCell sx={{ color: "#fff" }}>{seance.JOUR}</TableCell>
									<TableCell sx={{ color: "#fff" }}>{seance.ORDRE}</TableCell>
									<TableCell sx={{ color: "#fff" }}>
										{seance.nom_programme}
									</TableCell>
									<TableCell sx={{ color: "#fff" }}>
										<DeleteIcon
											onClick={() => handleDelete(seance.ID_SEANCE)}
											sx={{
												color: "#7a8fa6",
												cursor: "pointer",
												fontSize: "24px",
												"&:hover": { color: "#22c55e" },
											}}
										/>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Box>
		</div>
	);
}
