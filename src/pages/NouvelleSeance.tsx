import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SaveIcon from "@mui/icons-material/Save";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

interface FormSeance {
	titre: string;
	jour: string;
	ordre: number | "";
	id_programme: number | "";
}

interface Programme {
	ID_PROGRAMME: number;
	NOM: string;
}

const seances_fictives = [
	{
		id: 1,
		titre: "Push",
		jour: "Lundi",
		ordre: 1,
		programme: "Prise de masse",
	},
	{
		id: 2,
		titre: "Pull",
		jour: "Mardi",
		ordre: 2,
		programme: "Prise de masse",
	},
	{
		id: 3,
		titre: "Legs",
		jour: "Mercredi",
		ordre: 3,
		programme: "Prise de masse",
	},
	{
		id: 4,
		titre: "Full Body",
		jour: "Jeudi",
		ordre: 4,
		programme: "Prise de masse",
	},
	{
		id: 5,
		titre: "Cardio",
		jour: "Vendredi",
		ordre: 5,
		programme: "Prise de masse",
	},
	{
		id: 6,
		titre: "Mobilité",
		jour: "Samedi",
		ordre: 6,
		programme: "Prise de masse",
	},
	{
		id: 7,
		titre: "Repos actif",
		jour: "Dimanche",
		ordre: 7,
		programme: "Prise de masse",
	},

	{
		id: 8,
		titre: "HIIT",
		jour: "Lundi",
		ordre: 1,
		programme: "Perte de poids",
	},
	{
		id: 9,
		titre: "Cardio",
		jour: "Mardi",
		ordre: 2,
		programme: "Perte de poids",
	},
	{
		id: 10,
		titre: "Circuit",
		jour: "Mercredi",
		ordre: 3,
		programme: "Perte de poids",
	},
	{
		id: 11,
		titre: "HIIT 2",
		jour: "Jeudi",
		ordre: 4,
		programme: "Perte de poids",
	},
	{
		id: 12,
		titre: "Renfo",
		jour: "Vendredi",
		ordre: 5,
		programme: "Perte de poids",
	},
	{
		id: 13,
		titre: "Stretching",
		jour: "Samedi",
		ordre: 6,
		programme: "Perte de poids",
	},
	{
		id: 14,
		titre: "Repos actif",
		jour: "Dimanche",
		ordre: 7,
		programme: "Perte de poids",
	},

	{
		id: 15,
		titre: "Full Body",
		jour: "Lundi",
		ordre: 1,
		programme: "Remise en forme",
	},
	{
		id: 16,
		titre: "Cardio",
		jour: "Mardi",
		ordre: 2,
		programme: "Remise en forme",
	},
	{
		id: 17,
		titre: "Renfo",
		jour: "Mercredi",
		ordre: 3,
		programme: "Remise en forme",
	},
	{
		id: 18,
		titre: "Mobilité",
		jour: "Jeudi",
		ordre: 4,
		programme: "Remise en forme",
	},
	{
		id: 19,
		titre: "Cardio 2",
		jour: "Vendredi",
		ordre: 5,
		programme: "Remise en forme",
	},
	{
		id: 20,
		titre: "Stretching",
		jour: "Samedi",
		ordre: 6,
		programme: "Remise en forme",
	},
	{
		id: 21,
		titre: "Repos actif",
		jour: "Dimanche",
		ordre: 7,
		programme: "Remise en forme",
	},
];

const exercices_fictifs = [
	{ id: 1, nom: "Squat", muscles: ["Fessiers", "Biceps"], type: "Muscu" },
	{ id: 2, nom: "Pompes", muscles: ["Pectoraux", "Triceps"], type: "Muscu" },
	{ id: 3, nom: "Gainage", muscles: ["Abdos", "Lombaires"], type: "Cardio" },
	{ id: 4, nom: "Fentes", muscles: ["Fessiers", "Biceps"], type: "Muscu" },
	{ id: 5, nom: "Burpees", muscles: ["Épaule", "Abdos"], type: "HIIT" },
	{ id: 6, nom: "Tractions", muscles: ["Dos", "Biceps"], type: "Muscu" },
	{ id: 7, nom: "Course", muscles: [], type: "Cardio" },
	{ id: 8, nom: "Étirements", muscles: ["Épaule", "Dos"], type: "Stretching" },
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

export default function NouvelleSeance() {
	const navigate = useNavigate();
	const { token } = useAuth();

	const [seances, setSeances] = useState(seances_fictives);
	const [programmes, setProgrammes] = useState<Programme[]>([]);

	const [form, setForm] = useState<FormSeance>({
		titre: "",
		jour: "",
		ordre: "",
		id_programme: "",
	});

	useEffect(() => {
		fetch("http://localhost:3310/api/programmes", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Programmes chargés :", data);
				setProgrammes(data);
			})
			.catch((err) =>
				console.error("Erreur lors du chargement des programmes :", err),
			);
	}, []);

	const handleSave = () => {
		if (!form.titre || !form.jour || !form.ordre || !form.id_programme) return;
		navigate("/seances");
	};

	const handleDelete = (id: number) => {
		setSeances(seances.filter((s) => s.id !== id));
	};

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Elèves", path: "/eleves" },
					{ label: "Progression", path: "/progression" },
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
				<Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
						Nouvelle séance
					</Typography>
					<FitnessCenterIcon sx={{ color: "#22c55e", fontSize: 22 }} />
				</Box>
				<Button
					onClick={handleSave}
					startIcon={<SaveIcon sx={{ fontSize: 15 }} />}
					sx={SX_BTN}
				>
					Enregistrer
				</Button>
			</Box>
			<Box sx={{ p: "32px 36px", position: "relative", zIndex: 2 }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "2fr 1fr",
						gap: "40px",
						alignItems: "start",
					}}
				>
					<Box sx={{ display: "flex", flexDirection: "column", gap: "40px" }}>
						{/* Formulaire de création de séance */}
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
									onChange={(e) =>
										setForm({ ...form, ordre: Number(e.target.value) })
									}
									fullWidth
									sx={SX_IN}
								/>
								<FormControl fullWidth sx={SX_IN}>
									<InputLabel>Programme associé</InputLabel>
									<Select
										value={form.id_programme}
										onChange={(e) =>
											setForm({
												...form,
												id_programme: e.target.value as number,
											})
										}
									>
										{programmes.map((p) => (
											<MenuItem key={p.ID_PROGRAMME} value={p.ID_PROGRAMME}>
												{p.NOM}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</div>
	);
}
