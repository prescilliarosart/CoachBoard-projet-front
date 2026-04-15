import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

type Exercice = {
	ID_SEANCES_EXERCICES: number;
	ID_EXERCICE: number;
	NOM_EXERCICE: string;
	SERIES: number;
	REPS: number;
	CHARGE: number;
	REPOS: number;
	ORDRE: number;
};

type Seance = {
	ID_SEANCE: number;
	TITRE: string;
	JOUR: string;
	ORDRE: number;
	exercices: Exercice[];
};

type EleveProgramme = {
	id_eleve_programme: number;
	nom: string;
	objectif: string;
	duree: number;
	date_debut: string;
	date_fin: string;
	statut: string;
	id_programme: number;
	seances: Seance[];
};

const elevLinks = [
	{ label: "Mon Suivi", path: "/mon-suivi" },
	{ label: "Programmes", path: "/mon-programme" },
];

export default function MonProgramme() {
	const { user } = useAuth();
	const [programmes, setProgrammes] = useState<EleveProgramme[]>([]);
	const [loading, setLoading] = useState(true);

	const formatDuree = (jours: number) => {
		if (jours < 7) return `${jours} jour${jours > 1 ? "s" : ""}`;
		const semaines = Math.floor(jours / 7);
		return `${semaines} semaine${semaines > 1 ? "s" : ""}`;
	};

	useEffect(() => {
		if (!user) return;

		const fetchData = async () => {
			try {
				const progs = await apiFetch<EleveProgramme[]>(
					`/api/eleves-programmes/eleve/${user.id}`,
				);
				const progsAvecSeances = await Promise.all(
					progs.map(async (p: EleveProgramme) => {
						const seances = await apiFetch<Seance[]>(
							`/api/seances/programme/${p.id_programme}`,
						);
						const seancesAvecExercices = await Promise.all(
							seances.map(async (s: Seance) => {
								const exercices = await apiFetch<Exercice[]>(
									`/api/seances_exercices/seance/${s.ID_SEANCE}`,
								);
								return { ...s, exercices };
							}),
						);
						return { ...p, seances: seancesAvecExercices };
					}),
				);
				setProgrammes(progsAvecSeances);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [user]);

	return (
		<>
			<Navbar links={elevLinks} />
			<Box sx={{ mt: 10, p: 4 }}>
				<Typography variant="h5" sx={{ fontWeight: 700, color: "#fff", mb: 3 }}>
					Mes Programmes
				</Typography>

				{programmes.length === 0 ? (
					<Typography sx={{ color: "#7a8fa6" }}>
						Aucun programme attribué pour le moment.
					</Typography>
				) : (
					programmes.map((p) => (
						<Box
							key={p.id_eleve_programme}
							sx={{
								mb: 4,
								p: 3,
								border: "1px solid rgba(34,197,94,0.2)",
								borderRadius: 2,
								background: "rgba(11,21,32,0.6)",
							}}
						>
							{/* Header programme */}
							<Box
								sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
							>
								<Typography
									sx={{ fontWeight: 700, color: "#fff", fontSize: "1.1rem" }}
								>
									{p.nom}
								</Typography>
								<Chip
									label={p.statut}
									size="small"
									sx={{
										background:
											p.statut === "actif"
												? "rgba(34,197,94,0.15)"
												: "rgba(122,143,166,0.15)",
										color: p.statut === "actif" ? "#22c55e" : "#7a8fa6",
										fontWeight: 600,
									}}
								/>
							</Box>
							<Typography sx={{ color: "#7a8fa6", mb: 1 }}>
								{p.objectif}
							</Typography>
							<Typography variant="body2" sx={{ color: "#7a8fa6", mb: 3 }}>
								Durée : {formatDuree(p.duree)} · Du{" "}
								{new Date(p.date_debut).toLocaleDateString("fr-FR")} au{" "}
								{(() => {
									const fin = new Date(p.date_debut);
									fin.setDate(fin.getDate() + p.duree);
									return fin.toLocaleDateString("fr-FR");
								})()}
							</Typography>

							{/* Séances */}
							{p.seances?.map((s) => (
								<Box
									key={s.ID_SEANCE}
									sx={{
										mb: 2,
										p: 2,
										border: "1px solid rgba(34,197,94,0.1)",
										borderRadius: 1,
										background: "rgba(15,27,39,0.6)",
									}}
								>
									<Typography sx={{ color: "#22c55e", fontWeight: 700, mb: 1 }}>
										{s.JOUR} — {s.TITRE}
									</Typography>

									{/* Exercices */}
									{s.exercices?.map((e) => (
										<Box
											key={e.ID_SEANCES_EXERCICES}
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 2,
												py: "6px",
												borderBottom: "1px solid rgba(34,197,94,0.06)",
											}}
										>
											<Typography
												sx={{ color: "#e2e8f0", flex: 1, fontSize: "0.9rem" }}
											>
												{e.NOM_EXERCICE}
											</Typography>
											<Typography sx={{ color: "#7a8fa6", fontSize: "0.8rem" }}>
												{e.SERIES}×{e.REPS} · {e.CHARGE}kg · repos {e.REPOS}s
											</Typography>
										</Box>
									))}
								</Box>
							))}
						</Box>
					))
				)}
			</Box>
		</>
	);
}
