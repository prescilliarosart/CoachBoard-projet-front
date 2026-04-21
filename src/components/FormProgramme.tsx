import SaveIcon from "@mui/icons-material/Save";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiFetch } from "../services/api";
import type { Eleve, User } from "../types";

interface FormData {
	nomProgramme: string;
	objectif: string;
	duree: string;
	dateDebut: string;
	notes: string;
	eleveConcerne: number | "";
}

interface Props {
	onSuccess: (programmeId: number) => void;
}

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

const SX_BTN = {
	background: "#22c55e",
	color: "#0b1520",
	fontFamily: "'Barlow Condensed',sans-serif",
	fontStyle: "italic",
	fontWeight: 700,
	fontSize: "0.85rem",
	textTransform: "uppercase" as const,
	px: "16px",
	py: "7px",
	borderRadius: "4px",
	transition: "all 0.2s",
	"&:hover": {
		background: "#16a34a",
		transform: "translateY(-1px)",
		boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
	},
};

export default function FormProgramme({ onSuccess }: Props) {
	const { user } = useAuth();
	const [eleves, setEleves] = useState<Eleve[]>([]);
	const [loading, setLoading] = useState(false);
	const { showToast } = useToast();

	const [form, setForm] = useState<FormData>({
		nomProgramme: "",
		objectif: "",
		duree: "",
		dateDebut: "",
		notes: "",
		eleveConcerne: "",
	});

	useEffect(() => {
		const fetchEleves = async () => {
			try {
				const data = await apiFetch<Eleve[]>("/api/eleves");
				setEleves(data);
			} catch (err) {
				console.error("Erreur chargement élèves :", err);
			}
		};
		fetchEleves();
	}, []);

	const handleSave = async () => {
		if (!form.nomProgramme || !form.objectif || !form.duree) {
			showToast("Veuillez remplir le nom, l'objectif et la durée.", "warning");
			return;
		}

		setLoading(true);
		try {
			const idCoach = (user as User)?.id ?? 1;

			const { id } = await apiFetch<{ id: number }>("/api/programmes", {
				method: "POST",
				body: JSON.stringify({
					nom: form.nomProgramme,
					objectif: form.objectif,
					duree: parseInt(form.duree, 10),
					id_coach: idCoach,
				}),
			});

			if (form.eleveConcerne) {
				await apiFetch("/api/eleves-programmes", {
					method: "POST",
					body: JSON.stringify({
						id_eleve: form.eleveConcerne,
						id_programme: id,
						date_debut: form.dateDebut,
						statut: "En cours",
						date_fin: null,
					}),
				});
			}

			onSuccess(id);
		} catch (err) {
			console.error("Erreur FormProgramme :", err);
			showToast("Impossible de créer le programme.", "error");
		} finally {
			setLoading(false);
		}
	};
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 3,
				background: "rgba(15,27,39,0.85)",
				border: "1px solid rgba(34,197,94,0.13)",
				borderRadius: "12px",
				p: "32px",
			}}
		>
			<Typography
				sx={{
					fontFamily: "'Barlow Condensed',sans-serif",
					fontStyle: "italic",
					fontWeight: 700,
					fontSize: "1.1rem",
					color: "#7a8fa6",
					textTransform: "uppercase",
				}}
			>
				Informations du programme
			</Typography>

			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", sm: "row" },
					gap: 3,
				}}
			>
				<TextField
					label="Nom du programme"
					value={form.nomProgramme}
					onChange={(e) => setForm({ ...form, nomProgramme: e.target.value })}
					fullWidth
					sx={SX_IN}
				/>
				<FormControl fullWidth sx={SX_IN}>
					<InputLabel>Objectif</InputLabel>
					<Select
						value={form.objectif}
						label="Objectif"
						onChange={(e) => setForm({ ...form, objectif: e.target.value })}
					>
						<MenuItem value="Perte de poids">Perte de poids</MenuItem>
						<MenuItem value="Prise de masse">Prise de masse</MenuItem>
						<MenuItem value="Remise en forme">Remise en forme</MenuItem>
					</Select>
				</FormControl>
				<TextField
					label="Durée (jours)"
					type="number"
					value={form.duree}
					onChange={(e) => setForm({ ...form, duree: e.target.value })}
					fullWidth
					sx={SX_IN}
				/>
				<TextField
					slotProps={{ inputLabel: { shrink: true } }}
					label="Date de début"
					type="date"
					value={form.dateDebut}
					onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
					fullWidth
					sx={SX_IN}
				/>
			</Box>

			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", sm: "row" },
					gap: 3,
				}}
			>
				<TextField
					label="Notes (optionnel)"
					value={form.notes}
					onChange={(e) => setForm({ ...form, notes: e.target.value })}
					fullWidth
					multiline
					rows={3}
					sx={SX_IN}
				/>
				<FormControl fullWidth sx={SX_IN}>
					<InputLabel>Élève concerné</InputLabel>
					<Select
						value={form.eleveConcerne}
						onChange={(e) =>
							setForm({ ...form, eleveConcerne: e.target.value as number })
						}
					>
						{eleves.map((eleve) => (
							<MenuItem key={eleve.ID_ELEVE} value={eleve.ID_ELEVE}>
								{eleve.NOM} {eleve.PRENOM}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					onClick={handleSave}
					disabled={loading}
					startIcon={<SaveIcon sx={{ fontSize: 15 }} />}
					sx={SX_BTN}
				>
					{loading ? "Création..." : "Créer le programme"}
				</Button>
			</Box>
		</Box>
	);
}
