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
import { useToast } from "../context/ToastContext";
import { apiFetch } from "../services/api";

interface FormData {
	titre: string;
	jour: string;
	ordre: number | "";
	id_programme: number | "";
}

interface Programme {
	ID_PROGRAMME: number;
	NOM: string;
}

interface Props {
	/** Passé depuis le stepper : verrouille et pré-remplit le champ programme */
	programmeId?: number;
	onSuccess: (seanceId: number) => void;
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

export default function FormSeance({ programmeId, onSuccess }: Props) {
	const [programmes, setProgrammes] = useState<Programme[]>([]);
	const [loading, setLoading] = useState(false);
	const { showToast } = useToast();

	const [form, setForm] = useState<FormData>({
		titre: "",
		jour: "",
		ordre: "",
		// Pré-remplit depuis le stepper si dispo, sinon vide
		id_programme: programmeId ?? "",
	});

	// Sync si programmeId change (ex: retour en arrière dans le stepper)
	useEffect(() => {
		if (programmeId) {
			setForm((f) => ({ ...f, id_programme: programmeId }));
		}
	}, [programmeId]);

	// On charge les programmes seulement si pas de programmeId imposé
	useEffect(() => {
		if (programmeId) return;
		const fetchProgrammes = async () => {
			try {
				const data = await apiFetch<Programme[]>("/api/programmes");
				setProgrammes(data);
			} catch (err) {
				console.error("Erreur chargement programmes :", err);
			}
		};
		fetchProgrammes();
	}, [programmeId]);

	const handleSave = async () => {
		if (!form.titre || !form.jour || !form.ordre || !form.id_programme) {
			showToast("Veuillez remplir tous les champs.", "warning");
			return;
		}

		setLoading(true);
		try {
			const data = await apiFetch<{
				id: number;
				ID_SEANCE: number;
				insertId: number;
			}>("/api/seances", {
				method: "POST",
				body: JSON.stringify({
					titre: form.titre,
					jour: form.jour,
					ordre: form.ordre,
					id_programme: form.id_programme,
				}),
			});

			const seanceId: number = data.id ?? data.ID_SEANCE ?? data.insertId;
			onSuccess(seanceId);
		} catch (err) {
			console.error("Erreur FormSeance :", err);
			showToast("Impossible de créer la séance.", "error");
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
				Informations de la séance
			</Typography>

			<Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
				<TextField
					label="Titre de la séance"
					value={form.titre}
					onChange={(e) => setForm({ ...form, titre: e.target.value })}
					fullWidth
					sx={SX_IN}
				/>

				<FormControl fullWidth sx={SX_IN}>
					<InputLabel>Jour</InputLabel>
					<Select
						value={form.jour}
						onChange={(e) => setForm({ ...form, jour: e.target.value })}
					>
						{[
							"Lundi",
							"Mardi",
							"Mercredi",
							"Jeudi",
							"Vendredi",
							"Samedi",
							"Dimanche",
						].map((j) => (
							<MenuItem key={j} value={j}>
								{j}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					label="Ordre"
					type="number"
					value={form.ordre}
					onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })}
					fullWidth
					sx={SX_IN}
				/>

				{/* Si programmeId imposé depuis le stepper : champ verrouillé */}
				{programmeId ? (
					<TextField
						label="Programme associé"
						value={`Programme #${programmeId}`}
						disabled
						fullWidth
						sx={SX_IN}
					/>
				) : (
					<FormControl fullWidth sx={SX_IN}>
						<InputLabel>Programme associé</InputLabel>
						<Select
							value={form.id_programme}
							onChange={(e) =>
								setForm({ ...form, id_programme: e.target.value as number })
							}
						>
							{programmes.map((p) => (
								<MenuItem key={p.ID_PROGRAMME} value={p.ID_PROGRAMME}>
									{p.NOM}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			</Box>

			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					onClick={handleSave}
					disabled={loading}
					startIcon={<SaveIcon sx={{ fontSize: 15 }} />}
					sx={SX_BTN}
				>
					{loading ? "Création..." : "Créer la séance"}
				</Button>
			</Box>
		</Box>
	);
}
