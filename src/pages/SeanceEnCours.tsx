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
import { apiFetch } from "../services/api";
import type { EleveProgrammeActif, SeanceJour } from "../types";

type Exercice = {
	ID_SEANCES_EXERCICES: number;
	NOM_EXERCICE: string;
	SERIES: number;
	REPS: number;
	CHARGE: number;
	REPOS: number;
	ORDRE: number;
	GROUPE_MUSCULAIRE: string;
	DESCRIPTION: string | null;
	IMAGE_URL: string | null;
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

export default function SeanceEnCours() {
	const { user } = useAuth();
	const navigate = useNavigate();

	const JOURS = [
		"Dimanche",
		"Lundi",
		"Mardi",
		"Mercredi",
		"Jeudi",
		"Vendredi",
		"Samedi",
	];
	const aujourdhui = JOURS[new Date().getDay()];

	const [exercices, setExercices] = useState<Exercice[]>([]);
	const [gifs, setGifs] = useState<GifData[]>([]);
	const [titreSeance, setTitreSeance] = useState("");
	const [idSeance, setIdSeance] = useState<number | null>(null);
	const [idEleveProgramme, setIdEleveProgramme] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [erreur, setErreur] = useState("");
	const [dejaRealisee, setDejaRealisee] = useState(false);
	const [current, setCurrent] = useState(0);
	const [currentSerie, setCurrentSerie] = useState(1);
	const [restTimer, setRestTimer] = useState<number | null>(null);
	const [done, setDone] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const [ressenti, setRessenti] = useState<
		"Facile" | "Moyen" | "Difficile" | ""
	>("");
	const [commentaires, setCommentaires] = useState("");
	const [poidsCorporel, setPoidsCorporel] = useState("");

	useEffect(() => {
		if (!user) return;
		const fetchData = async () => {
			try {
				const progs = await apiFetch<EleveProgrammeActif[]>(
					`/api/eleves-programmes/eleve/${user.id}`,
				);
				const actif = progs.filter((p) => p.statut === "En cours").at(-1);
				if (!actif) {
					setErreur("Aucun programme actif pour le moment.");
					setLoading(false);
					return;
				}
				setIdEleveProgramme(actif.id_eleve_programme);

				const seances = await apiFetch<SeanceJour[]>(
					`/api/seances/programme/${actif.id_programme}`,
				);
				const seanceDuJour = seances.find(
					(s) => s.JOUR?.toLowerCase() === aujourdhui.toLowerCase(),
				);
				if (!seanceDuJour) {
					setErreur(`Aucune séance prévue aujourd'hui (${aujourdhui}).`);
					setLoading(false);
					return;
				}

				setTitreSeance(seanceDuJour.TITRE);
				setIdSeance(seanceDuJour.ID_SEANCE);

				const today = new Date().toISOString().split("T")[0];
				const check = await apiFetch<{ dejaRealisee: boolean }>(
					`/api/suivi/check/${seanceDuJour.ID_SEANCE}/${today}/${actif.id_eleve_programme}`,
				);
				if (check.dejaRealisee) {
					setDejaRealisee(true);
					setLoading(false);
					return;
				}

				const exos = await apiFetch<Exercice[]>(
					`/api/seances_exercices/seance/${seanceDuJour.ID_SEANCE}`,
				);
				setExercices(exos);
			} catch {
				setErreur("Erreur lors du chargement de la séance.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
		apiFetch<GifData[]>("/api/gifs").then(setGifs).catch(console.error);
	}, [user]);
	// Countdown timer
	useEffect(() => {
		if (restTimer === null) return;
		if (restTimer === 0) {
			handleSkipRest();
			return;
		}
		const t = setTimeout(() => setRestTimer((r) => (r ?? 1) - 1), 1000);
		return () => clearTimeout(t);
	}, [restTimer]);

	useEffect(() => {
		if (restTimer !== null && restTimer > 0) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [restTimer]);

	const handleSkipRest = () => {
		setRestTimer(null);
		const isLastSerie = currentSerie >= exercices[current].SERIES;
		const isLastExercice = current + 1 >= exercices.length;

		if (!isLastSerie) {
			setCurrentSerie((s) => s + 1);
		} else if (isLastExercice) {
			setDone(true);
		} else {
			setCurrent((c) => c + 1);
			setCurrentSerie(1);
		}
	};

	const handleNext = () => {
		const scrollY = window.scrollY;
		const repos = exercices[current].REPOS;
		const isLastSerie = currentSerie >= exercices[current].SERIES;
		const isLastExercice = current + 1 >= exercices.length;

		if (!isLastSerie) {
			if (repos > 0) {
				setRestTimer(repos);
				requestAnimationFrame(() => window.scrollTo(0, scrollY));
				return;
			}
			setCurrentSerie((s) => s + 1);
			return;
		}
		if (isLastExercice) {
			setDone(true);
		} else {
			setCurrent((c) => c + 1);
			setCurrentSerie(1);
		}
	};
	const handleSubmit = async () => {
		if (!ressenti || !idSeance || !idEleveProgramme) return;
		try {
			await Promise.all(
				exercices.map((ex) =>
					apiFetch("/api/suivi", {
						method: "POST",
						body: JSON.stringify({
							charge_soulevee: ex.CHARGE,
							reps_reelle: ex.REPS,
							poids_corporel: poidsCorporel ? parseFloat(poidsCorporel) : null,
							ressenti,
							commentaires,
							date: new Date().toISOString().split("T")[0],
							statut: "terminé",
							id_seance: idSeance,
							id_seances_exercices: ex.ID_SEANCES_EXERCICES,
							id_eleve_programme: idEleveProgramme,
						}),
					}),
				),
			);
			setSubmitted(true);
		} catch (err) {
			console.error(err);
		}
	};

	if (loading) {
		return (
			<>
				<Navbar links={elevLinks} />
				<Box sx={{ mt: 14, textAlign: "center" }}>
					<Typography
						sx={{ color: "#7a8fa6", fontFamily: "'Barlow',sans-serif" }}
					>
						Chargement de ta séance...
					</Typography>
				</Box>
			</>
		);
	}

	if (erreur) {
		return (
			<>
				<Navbar links={elevLinks} />
				<Box
					sx={{
						mt: 14,
						textAlign: "center",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 3,
					}}
				>
					<Typography
						sx={{ color: "#7a8fa6", fontFamily: "'Barlow',sans-serif" }}
					>
						{erreur}
					</Typography>
					<Button
						onClick={() => navigate("/dashboard-eleves")}
						sx={{
							background: "#22c55e",
							color: "#0b1520",
							fontFamily: "'Barlow Condensed',sans-serif",
							fontStyle: "italic",
							fontWeight: 700,
							textTransform: "uppercase",
							px: 3,
							borderRadius: "4px",
						}}
					>
						Retour
					</Button>
				</Box>
			</>
		);
	}

	if (dejaRealisee) {
		return (
			<>
				<Navbar links={elevLinks} />
				<Box
					sx={{
						mt: 14,
						textAlign: "center",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 3,
					}}
				>
					<Typography
						sx={{
							fontFamily: "'Barlow Condensed',sans-serif",
							fontStyle: "italic",
							fontWeight: 700,
							fontSize: "1.6rem",
							color: "#22c55e",
							textTransform: "uppercase",
						}}
					>
						Séance déjà réalisée aujourd'hui ! 💪
					</Typography>
					<Typography
						sx={{ color: "#7a8fa6", fontFamily: "'Barlow',sans-serif" }}
					>
						Revenez demain pour continuer votre programme.
					</Typography>
					<Button
						onClick={() => navigate("/dashboard-eleves")}
						sx={{
							background: "#22c55e",
							color: "#0b1520",
							fontFamily: "'Barlow Condensed',sans-serif",
							fontStyle: "italic",
							fontWeight: 700,
							textTransform: "uppercase",
							px: 3,
							borderRadius: "4px",
						}}
					>
						Retour au dashboard
					</Button>
				</Box>
			</>
		);
	}
	if (submitted) {
		return (
			<>
				<Navbar links={elevLinks} />
				<Box
					sx={{
						mt: 14,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 3,
					}}
				>
					<Typography
						sx={{
							fontFamily: "'Barlow Condensed',sans-serif",
							fontStyle: "italic",
							fontWeight: 700,
							fontSize: "2rem",
							color: "#22c55e",
							textTransform: "uppercase",
						}}
					>
						Séance terminée 🎉
					</Typography>
					<Typography
						sx={{ color: "#7a8fa6", fontFamily: "'Barlow',sans-serif" }}
					>
						Ton suivi a bien été enregistré.
					</Typography>
					<Button
						onClick={() => navigate("/dashboard-eleves")}
						sx={{
							background: "#22c55e",
							color: "#0b1520",
							fontFamily: "'Barlow Condensed',sans-serif",
							fontStyle: "italic",
							fontWeight: 700,
							textTransform: "uppercase",
							px: 3,
							borderRadius: "4px",
						}}
					>
						Retour au dashboard
					</Button>
				</Box>
			</>
		);
	}
	if (done) {
		return (
			<>
				<Navbar links={elevLinks} />
				<Box
					sx={{
						mt: 12,
						maxWidth: 480,
						mx: "auto",
						p: 3,
						display: "flex",
						flexDirection: "column",
						gap: 3,
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
						Comment s'est passée la séance ?
					</Typography>

					<Box>
						<Typography
							sx={{
								color: "#7a8fa6",
								fontSize: "0.78rem",
								fontFamily: "'Barlow',sans-serif",
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								mb: 1,
							}}
						>
							Ressenti
						</Typography>
						<Box sx={{ display: "flex", gap: 2 }}>
							{(["Facile", "Moyen", "Difficile"] as const).map((r) => (
								<Box
									key={r}
									onClick={() => setRessenti(r)}
									sx={{
										flex: 1,
										py: 1.5,
										borderRadius: "6px",
										cursor: "pointer",
										textAlign: "center",
										border:
											ressenti === r
												? "1px solid #22c55e"
												: "1px solid rgba(34,197,94,0.2)",
										background:
											ressenti === r
												? "rgba(34,197,94,0.15)"
												: "rgba(255,255,255,0.03)",
										transition: "all 0.18s",
									}}
								>
									<Typography
										sx={{
											color: ressenti === r ? "#22c55e" : "#7a8fa6",
											fontFamily: "'Barlow',sans-serif",
											fontSize: "0.88rem",
										}}
									>
										{r}
									</Typography>
								</Box>
							))}
						</Box>
					</Box>

					<TextField
						label="Poids corporel (kg)"
						value={poidsCorporel}
						onChange={(e) => setPoidsCorporel(e.target.value)}
						type="number"
						sx={SX_IN}
					/>
					<TextField
						label="Commentaire"
						value={commentaires}
						onChange={(e) => setCommentaires(e.target.value)}
						multiline
						rows={3}
						sx={SX_IN}
					/>

					<Button
						onClick={handleSubmit}
						disabled={!ressenti}
						sx={{
							background: ressenti ? "#22c55e" : "rgba(34,197,94,0.2)",
							color: "#0b1520",
							fontFamily: "'Barlow Condensed',sans-serif",
							fontStyle: "italic",
							fontWeight: 700,
							textTransform: "uppercase",
							py: 1.5,
							borderRadius: "4px",
						}}
					>
						Enregistrer mon suivi
					</Button>
				</Box>
			</>
		);
	}
	const ex = exercices[current];
	if (!ex) return null;
	const gifUrl = ex.IMAGE_URL ?? getGif(ex, gifs);
	return (
		<>
			<Navbar links={elevLinks} />
			<Box
				sx={{
					mt: 10,
					maxWidth: 600,
					mx: "auto",
					p: 3,
					display: "flex",
					flexDirection: "column",
					gap: 3,
				}}
			>
				{/* Header séance */}
				<Typography
					sx={{
						color: "#7a8fa6",
						fontFamily: "'Barlow',sans-serif",
						fontSize: "0.85rem",
						textTransform: "uppercase",
						letterSpacing: "0.08em",
					}}
				>
					{aujourdhui} — {titreSeance}
				</Typography>

				{/* Progression */}
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Typography
						sx={{
							color: "#7a8fa6",
							fontFamily: "'Barlow',sans-serif",
							fontSize: "0.85rem",
							whiteSpace: "nowrap",
						}}
					>
						{current + 1} / {exercices.length}
					</Typography>
					<LinearProgress
						variant="determinate"
						value={(current / exercices.length) * 100}
						sx={{
							flex: 1,
							borderRadius: 2,
							background: "rgba(34,197,94,0.1)",
							"& .MuiLinearProgress-bar": { background: "#22c55e" },
						}}
					/>
				</Box>

				{/* Nom exercice */}
				<Typography
					sx={{
						fontFamily: "'Barlow Condensed',sans-serif",
						fontStyle: "italic",
						fontWeight: 700,
						fontSize: "1.8rem",
						color: "#e2e8f0",
						textTransform: "uppercase",
					}}
				>
					{ex.NOM_EXERCICE}
				</Typography>

				<Typography
					sx={{
						color: "#22c55e",
						fontFamily: "'Barlow',sans-serif",
						fontSize: "1rem",
					}}
				>
					Série {currentSerie} / {ex.SERIES}
				</Typography>

				{/* GIF */}
				<Box
					sx={{
						width: "100%",
						aspectRatio: "16/10",
						background: "linear-gradient(135deg, #1a2a35 0%, #0b1520 100%)",
						borderRadius: "10px",
						border: "1px solid rgba(34,197,94,0.13)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						overflow: "hidden",
					}}
				>
					{gifUrl ? (
						<img
							src={`${import.meta.env.VITE_API_URL}${gifUrl}`}
							alt={ex.NOM_EXERCICE}
							style={{ width: "100%", height: "100%", objectFit: "contain" }}
						/>
					) : (
						<Typography sx={{ color: "#3a5060", fontSize: "0.75rem" }}>
							Aucun GIF
						</Typography>
					)}
				</Box>

				{/* Détails */}
				<Box sx={{ display: "flex", gap: 2 }}>
					{[
						{ label: "Séries", value: ex.SERIES },
						{ label: "Reps", value: ex.REPS },
						{ label: "Charge", value: `${ex.CHARGE}kg` },
						{ label: "Repos", value: `${ex.REPOS}s` },
					].map((d) => (
						<Box
							key={d.label}
							sx={{
								flex: 1,
								p: 2,
								background: "#0f1b27",
								border: "1px solid rgba(34,197,94,0.13)",
								borderRadius: "8px",
								textAlign: "center",
							}}
						>
							<Typography
								sx={{
									color: "#22c55e",
									fontFamily: "'Barlow Condensed',sans-serif",
									fontWeight: 700,
									fontSize: "1.4rem",
								}}
							>
								{d.value}
							</Typography>
							<Typography
								sx={{
									color: "#7a8fa6",
									fontFamily: "'Barlow',sans-serif",
									fontSize: "0.72rem",
									textTransform: "uppercase",
								}}
							>
								{d.label}
							</Typography>
						</Box>
					))}
				</Box>
				{ex.DESCRIPTION && (
					<Box
						sx={{
							p: 2,
							background: "#0f1b27",
							border: "1px solid rgba(34,197,94,0.13)",
							borderRadius: "8px",
						}}
					>
						<Typography
							sx={{
								color: "#7a8fa6",
								fontFamily: "'Barlow',sans-serif",
								fontSize: "0.85rem",
								lineHeight: 1.6,
							}}
						>
							{ex.DESCRIPTION}
						</Typography>
					</Box>
				)}
				{restTimer !== null && restTimer > 0 && (
					<Box
						sx={{
							position: "fixed",
							inset: 0,
							background: "rgba(11,21,32,0.85)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 1300,
						}}
					>
						<Box
							sx={{
								background: "#0f1b27",
								border: "1px solid rgba(34,197,94,0.2)",
								borderRadius: "12px",
								p: 4,
								textAlign: "center",
								minWidth: 260,
							}}
						>
							<Typography
								sx={{
									color: "#7a8fa6",
									fontFamily: "'Barlow',sans-serif",
									fontSize: "0.85rem",
									mb: 1,
								}}
							>
								Temps de repos
							</Typography>
							<Typography
								sx={{
									color: "#22c55e",
									fontFamily: "'Barlow Condensed',sans-serif",
									fontStyle: "italic",
									fontWeight: 700,
									fontSize: "4rem",
								}}
							>
								{restTimer}s
							</Typography>
							<Button
								onClick={handleSkipRest}
								sx={{
									color: "#7a8fa6",
									fontFamily: "'Barlow',sans-serif",
									fontSize: "0.75rem",
									textTransform: "uppercase",
									mt: 2,
								}}
							>
								Passer
							</Button>
						</Box>
					</Box>
				)}

				{/* Bouton principal */}

				<Button
					onClick={handleNext}
					sx={{
						visibility: restTimer === null ? "visible" : "hidden",
						background: "#22c55e",
						color: "#0b1520",
						fontFamily: "'Barlow Condensed',sans-serif",
						fontStyle: "italic",
						fontWeight: 700,
						fontSize: "0.95rem",
						textTransform: "uppercase",
						py: 1.5,
						borderRadius: "4px",
						"&:hover": { background: "#16a34a" },
					}}
				>
					{currentSerie < ex.SERIES
						? "Série terminée"
						: current + 1 >= exercices.length
							? "Terminer la séance"
							: "Exercice terminé"}
				</Button>
			</Box>
		</>
	);
}
