import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Paper,
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
import FormProgramme from "../components/FormProgramme";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { apiFetch } from "../services/api";
import type {
	ProgrammeAvecEleve,
	Seance,
	SeanceExerciceDetail,
} from "../types";

export default function Programmes() {
	const [programmes, setProgrammes] = useState<ProgrammeAvecEleve[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");
	const [statutFilter, setStatutFilter] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [selectedProgramme, setSelectedProgramme] =
		useState<ProgrammeAvecEleve | null>(null);
	const [seances, setSeances] = useState<Seance[]>([]);
	const [exercices, setExercices] = useState<SeanceExerciceDetail[]>([]);
	const [loading, setLoading] = useState(true);

	const formatDuree = (jours: number) => {
		if (jours < 7) return `${jours} jour${jours > 1 ? "s" : ""}`;
		const semaines = Math.floor(jours / 7);
		return `${semaines} semaine${semaines > 1 ? "s" : ""}`;
	};

	useEffect(() => {
		const fetchProgrammes = async () => {
			try {
				const data = await apiFetch<ProgrammeAvecEleve[]>("/api/programmes");
				setProgrammes(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des programmes :", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProgrammes();
	}, []);

	useEffect(() => {
		const fetchSeances = async () => {
			if (selectedProgramme) {
				try {
					const data = await apiFetch<Seance[]>(
						`/api/seances/programme/${selectedProgramme.ID_PROGRAMME}`,
					);
					setSeances(data);
				} catch (error) {
					console.error("Erreur lors de la récupération des séances :", error);
				}
			}
		};
		fetchSeances();
	}, [selectedProgramme]);

	useEffect(() => {
		const fetchExercices = async () => {
			if (seances.length > 0) {
				try {
					const results = await Promise.all(
						seances.map((seance) =>
							apiFetch<SeanceExerciceDetail[]>(
								`/api/seances_exercices/seance/${seance.ID_SEANCE}`,
							),
						),
					);
					setExercices(results.flat());
				} catch (error) {
					console.error(
						"Erreur lors de la récupération des exercices :",
						error,
					);
				}
			}
		};
		fetchExercices();
	}, [seances]);

	const handleOpenModal = (programme: ProgrammeAvecEleve) => {
		setSelectedProgramme(programme);
		setIsOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedProgramme(null);
		setIsOpen(false);
	};

	const handleDelete = async (idProgramme: number) => {
		try {
			await apiFetch(`/api/programmes/${idProgramme}`, { method: "DELETE" });
			setProgrammes((prev) =>
				prev.filter((p) => p.ID_PROGRAMME !== idProgramme),
			);
		} catch (error) {
			console.error("Erreur lors de la suppression du programme :", error);
		}
	};
	const filteredProgrammes = useMemo(
		() =>
			programmes.filter(
				(p) =>
					(p.nom_programme.toLowerCase().includes(search.toLowerCase()) ||
						p.nom_eleve.toLowerCase().includes(search.toLowerCase()) ||
						p.prenom_eleve.toLowerCase().includes(search.toLowerCase())) &&
					(statutFilter === "" || p.STATUT === statutFilter),
			),
		[search, statutFilter, programmes],
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
					Programmes personnalisés
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
					{showForm ? "Annuler" : "Créer un programme"}
				</Button>
			</Box>
			<Box sx={{ margin: "40px 36px" }}>
				{showForm && (
					<Box
						sx={{
							background: "#1E293B", // vert seulement pour le formulaire ouvert
							borderRadius: "12px",
							padding: "24px",
							marginBottom: "24px",
						}}
					>
						<FormProgramme onSuccess={() => setShowForm(false)} />
					</Box>
				)}

				{/* Barre de recherche */}
				<Box sx={{ display: "flex", gap: "16px", alignItems: "center", mb: 2 }}>
					<TextField
						placeholder="Rechercher un programme ou un élève"
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
							Statut
						</InputLabel>
						<Select
							value={statutFilter}
							label="Statut"
							onChange={(e) => setStatutFilter(e.target.value)}
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
							<MenuItem value="Actif">Actif</MenuItem>
							<MenuItem value="Terminé">Terminé</MenuItem>
							<MenuItem value="En pause">En cours</MenuItem>
						</Select>
					</FormControl>
				</Box>

				{/* Table des programmes */}
				<Box
					sx={{
						background: "#111e2c", // fond neutre pour la table
						borderRadius: "12px",
						padding: "24px",
						overflowX: "auto",
					}}
				>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ color: "#fff" }}>Date de début</TableCell>
								<TableCell sx={{ color: "#fff" }}>Date de fin</TableCell>
								<TableCell sx={{ color: "#fff" }}>Programme</TableCell>
								<TableCell sx={{ color: "#fff" }}>Statut</TableCell>
								<TableCell sx={{ color: "#fff" }}>Elève concerné</TableCell>
								<TableCell sx={{ color: "#fff" }}></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell
										colSpan={6}
										sx={{ textAlign: "center", py: 6, border: "none" }}
									>
										<CircularProgress sx={{ color: "#22c55e" }} />
									</TableCell>
								</TableRow>
							) : filteredProgrammes.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										sx={{
											textAlign: "center",
											py: 6,
											color: "#7a8fa6",
											fontFamily: "'Barlow',sans-serif",
											border: "none",
										}}
									>
										Aucun programme pour l'instant.
									</TableCell>
								</TableRow>
							) : (
								filteredProgrammes.map((programme) => {
									const dateFin = new Date(programme.DATE_DEBUT ?? "");
									dateFin.setDate(
										dateFin.getDate() + (programme.duree_programme ?? 0),
									);
									return (
										<TableRow
											key={programme.ID_PROGRAMME}
											sx={{ cursor: "pointer" }}
										>
											<TableCell
												sx={{ color: "#fff" }}
												onClick={() => handleOpenModal(programme)}
											>
												{new Date(
													programme.DATE_DEBUT ?? "",
												).toLocaleDateString("fr-FR")}
											</TableCell>
											<TableCell
												sx={{ color: "#fff" }}
												onClick={() => handleOpenModal(programme)}
											>
												{dateFin.toLocaleDateString("fr-FR")}
											</TableCell>
											<TableCell
												sx={{ color: "#fff" }}
												onClick={() => handleOpenModal(programme)}
											>
												{programme.nom_programme}
											</TableCell>
											<TableCell
												sx={{ color: "#fff" }}
												onClick={() => handleOpenModal(programme)}
											>
												{programme.STATUT}
											</TableCell>
											<TableCell
												sx={{ color: "#fff" }}
												onClick={() => handleOpenModal(programme)}
											>
												{programme.nom_eleve} {programme.prenom_eleve}
											</TableCell>
											<TableCell>
												<DeleteIcon
													onClick={() => handleDelete(programme.ID_PROGRAMME)}
													sx={{
														color: "#7a8fa6",
														cursor: "pointer",
														fontSize: "24px",
														"&:hover": { color: "#22c55e" },
													}}
												/>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</Box>
			</Box>
			<Dialog
				open={isOpen}
				onClose={handleCloseModal}
				maxWidth="sm"
				fullWidth
				slotProps={{
					paper: {
						sx: {
							backgroundColor: "#0f1b27",
							borderRadius: "16px",
							border: "1px solid rgba(34,197,94,0.15)",
							overflow: "hidden",
						},
					},
				}}
			>
				<DialogTitle sx={{ p: 0 }}>
					<Box
						sx={{
							backgroundColor: "#0b1520",
							px: 4,
							py: 3,
							borderBottom: "1px solid rgba(34,197,94,0.15)",
						}}
					>
						<Typography
							sx={{
								color: "#22c55e",
								fontSize: "0.7rem",
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.1em",
								mb: 0.5,
							}}
						>
							Programme
						</Typography>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 800,
								fontFamily: "'Barlow Condensed'",
								fontStyle: "italic",
								textTransform: "uppercase",
								color: "#fff",
								lineHeight: 1.2,
							}}
						>
							{selectedProgramme?.nom_programme}
						</Typography>
						<Box
							sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}
						>
							<Typography
								sx={{ color: "rgba(226,232,240,0.6)", fontSize: "0.85rem" }}
							>
								{selectedProgramme?.prenom_eleve} {selectedProgramme?.nom_eleve}
							</Typography>
							{selectedProgramme?.duree_programme && (
								<Chip
									label={`${selectedProgramme.duree_programme} semaines`}
									size="small"
									sx={{
										bgcolor: "rgba(34,197,94,0.1)",
										color: "#22c55e",
										fontWeight: 600,
										fontSize: "0.7rem",
										border: "1px solid rgba(34,197,94,0.3)",
									}}
								/>
							)}
						</Box>
					</Box>
				</DialogTitle>

				<DialogContent sx={{ p: 0, "&.MuiDialogContent-root": { pt: 0 } }}>
					<Box
						sx={{
							px: 4,
							py: 3,
							display: "flex",
							flexDirection: "column",
							gap: 2,
						}}
					>
						<Typography variant="body2" sx={{ color: "#7a8fa6" }}>
							Durée : {formatDuree(selectedProgramme?.duree_programme ?? 0)} ·
							Du{" "}
							{new Date(selectedProgramme?.DATE_DEBUT ?? "").toLocaleDateString(
								"fr-FR",
							)}{" "}
							au {(() => {
								const fin = new Date(selectedProgramme?.DATE_DEBUT ?? "");
								fin.setDate(
									fin.getDate() + (selectedProgramme?.duree_programme ?? 0),
								);
								return fin.toLocaleDateString("fr-FR");
							})()}
						</Typography>

						{seances.map((seance, index) => (
							<Paper
								key={seance.ID_SEANCE}
								sx={{
									backgroundColor: "#0b1520",
									borderRadius: "12px",
									border: "1px solid rgba(255,255,255,0.05)",
									overflow: "hidden",
								}}
							>
								<Box
									sx={{
										px: 3,
										py: 1.5,
										borderBottom: "1px solid rgba(255,255,255,0.05)",
										display: "flex",
										alignItems: "center",
										gap: 1.5,
									}}
								>
									<Box
										sx={{
											width: 24,
											height: 24,
											borderRadius: "50%",
											backgroundColor: "rgba(34,197,94,0.15)",
											border: "1px solid rgba(34,197,94,0.4)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
										}}
									>
										<Typography
											sx={{
												color: "#22c55e",
												fontSize: "0.65rem",
												fontWeight: 700,
											}}
										>
											{index + 1}
										</Typography>
									</Box>
									<Box>
										<Typography
											sx={{
												color: "#22c55e",
												fontSize: "0.65rem",
												fontWeight: 700,
												textTransform: "uppercase",
												letterSpacing: "0.08em",
												lineHeight: 1,
												mb: 0.3,
											}}
										>
											{seance.JOUR ? `Séance · ${seance.JOUR}` : "Séance"}
										</Typography>
										<Typography
											sx={{
												color: "#fff",
												fontWeight: 700,
												fontSize: "0.95rem",
											}}
										>
											{seance.TITRE}
										</Typography>
									</Box>
								</Box>

								<Box
									sx={{
										px: 3,
										py: 1.5,
										display: "flex",
										flexDirection: "column",
										gap: 1,
									}}
								>
									{exercices
										.filter((ex) => ex.ID_SEANCE === seance.ID_SEANCE)
										.map((ex) => (
											<Box
												key={ex.ID_SEANCES_EXERCICES ?? ex.ID_EXERCICE}
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													py: 0.75,
													borderBottom: "1px solid rgba(255,255,255,0.04)",
													"&:last-child": { borderBottom: "none" },
												}}
											>
												<Typography
													sx={{
														color: "rgba(226,232,240,0.85)",
														fontSize: "0.875rem",
													}}
												>
													{ex.NOM_EXERCICE}
												</Typography>
												<Typography
													sx={{ color: "#7a8fa6", fontSize: "0.8rem", ml: 2 }}
												>
													{ex.SERIES}x{ex.REPS}
													{ex.CHARGE != null ? ` · ${ex.CHARGE}kg` : ""}
													{ex.REPOS != null ? ` · repos ${ex.REPOS}s` : ""}
												</Typography>
											</Box>
										))}
								</Box>
							</Paper>
						))}
					</Box>
				</DialogContent>

				<DialogActions
					sx={{
						px: 4,
						py: 2.5,
						borderTop: "1px solid rgba(255,255,255,0.05)",
						backgroundColor: "#0b1520",
					}}
				>
					<Button
						onClick={handleCloseModal}
						sx={{
							color: "#22c55e",
							backgroundColor: "rgba(34,197,94,0.08)",
							border: "1px solid rgba(34,197,94,0.25)",
							borderRadius: "10px",
							px: 3,
							fontWeight: 600,
							"&:hover": {
								backgroundColor: "rgba(34,197,94,0.15)",
							},
						}}
					>
						Fermer
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
