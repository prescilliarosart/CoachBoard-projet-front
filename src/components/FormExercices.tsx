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

type TypeExercice = "Cardio" | "Muscu" | "Mobilité" | "HIIT" | "Stretching";
const TYPES: TypeExercice[] = [
	"Cardio",
	"Muscu",
	"Mobilité",
	"HIIT",
	"Stretching",
];
const MUSCLES = [
	"Épaule",
	"Dos",
	"Pectoraux",
	"Triceps",
	"Biceps",
	"Abdos",
	"Lombaires",
	"Fessiers",
] as const;
type Muscle = (typeof MUSCLES)[number];

interface GifData {
	id: number;
	nom: string;
	categorie: string;
	gif_url: string;
	muscles: string[];
}

interface FormData {
	nom: string;
	description: string;
	muscles: Muscle[];
	type: TypeExercice | "";
	gif_url: string | null;
}

interface Props {
	onSuccess: (id: number) => void;
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

const SX_LB = {
	fontFamily: "'Barlow',sans-serif",
	fontSize: "0.78rem",
	fontWeight: 600,
	color: "#7a8fa6",
	textTransform: "uppercase" as const,
	letterSpacing: "0.08em",
	mb: "10px",
};

const SX_SEL = {
	background: "#111e2c",
	color: "#e2e8f0",
	fontFamily: "'Barlow',sans-serif",
	fontSize: "0.88rem",
	borderRadius: "6px",
	"& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(34,197,94,0.18)" },
	"&:hover .MuiOutlinedInput-notchedOutline": {
		borderColor: "rgba(34,197,94,0.4)",
	},
	"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22c55e" },
	"& .MuiSvgIcon-root": { color: "#7a8fa6" },
};

const MENU = {
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

export default function FormExercice({ onSuccess }: Props) {
	const { token, user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [gifs, setGifs] = useState<GifData[]>([]);
	const [gifSearch, setGifSearch] = useState("");
	const { showToast } = useToast();

	const [form, setForm] = useState<FormData>({
		nom: "",
		description: "",
		muscles: [],
		type: "",
		gif_url: null, // ← ajoute ça
	});

	const toggle = (m: Muscle) =>
		setForm((f) => ({
			...f,
			muscles: f.muscles.includes(m)
				? f.muscles.filter((x) => x !== m)
				: [...f.muscles, m],
		}));

	useEffect(() => {
		apiFetch<GifData[]>("/api/gifs").then(setGifs).catch(console.error);
	}, []);

	const handleSave = async () => {
		if (!form.nom || !form.type) {
			showToast("Veuillez remplir le nom et le type.", "warning");
			return;
		}

		setLoading(true);
		try {
			const idCoach =
				(user as { ID_COACH?: number; id?: number })?.ID_COACH ||
				(user as { ID_COACH?: number; id?: number })?.id ||
				1;
			const response = await fetch("/api/exercices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					nom: form.nom,
					description: form.description,
					groupe_musculaire: form.muscles.join(", "),
					type: form.type,
					id_coach: idCoach,
					image_url: form.gif_url,
				}),
			});

			if (!response.ok) throw new Error("Erreur création exercice");
			const data = await response.json();
			onSuccess(data.id);
		} catch (err) {
			console.error("Erreur FormExercice :", err);
			showToast("Impossible de créer l'exercice.", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				background: "rgba(15,27,39,0.85)",
				border: "1px solid rgba(34,197,94,0.13)",
				borderRadius: "12px",
				p: "32px",
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "40px",
			}}
		>
			<Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
					Informations de l'exercice
				</Typography>

				<TextField
					label="Nom de l'exercice"
					value={form.nom}
					onChange={(e) => setForm({ ...form, nom: e.target.value })}
					fullWidth
					sx={SX_IN}
				/>
				<TextField
					label="Description de l'exercice"
					value={form.description}
					onChange={(e) => setForm({ ...form, description: e.target.value })}
					multiline
					rows={4}
					fullWidth
					sx={SX_IN}
				/>

				<Box>
					<Typography sx={SX_LB}>Muscles ciblés</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
						{MUSCLES.map((m) => (
							<Box
								key={m}
								onClick={() => toggle(m)}
								sx={{
									px: "12px",
									py: "5px",
									borderRadius: "6px",
									cursor: "pointer",
									border: form.muscles.includes(m)
										? "1px solid #22c55e"
										: "1px solid rgba(34,197,94,0.2)",
									background: form.muscles.includes(m)
										? "rgba(34,197,94,0.15)"
										: "rgba(255,255,255,0.03)",
									transition: "all 0.18s",
									"&:hover": {
										borderColor: "#22c55e",
										background: "rgba(34,197,94,0.08)",
									},
								}}
							>
								<Typography
									sx={{
										fontFamily: "'Barlow',sans-serif",
										fontSize: "0.78rem",
										fontWeight: 500,
										color: form.muscles.includes(m) ? "#22c55e" : "#7a8fa6",
										userSelect: "none",
									}}
								>
									{m}
								</Typography>
							</Box>
						))}
					</Box>
				</Box>

				<Box>
					<Typography sx={SX_LB}>Type d'exercice</Typography>
					<FormControl sx={{ minWidth: 160 }}>
						<InputLabel
							sx={{
								color: "#7a8fa6",
								fontSize: "0.82rem",
								"&.Mui-focused": { color: "#22c55e" },
							}}
						>
							Type
						</InputLabel>
						<Select
							value={form.type}
							label="Type"
							onChange={(e) =>
								setForm({ ...form, type: e.target.value as TypeExercice })
							}
							sx={SX_SEL}
							MenuProps={MENU}
						>
							{TYPES.map((t) => (
								<MenuItem key={t} value={t}>
									{t}
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
						{loading ? "Création..." : "Créer l'exercice"}
					</Button>
				</Box>
			</Box>

			<Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<Typography sx={SX_LB}>Choisir un GIF</Typography>

				<TextField
					placeholder="Rechercher un GIF..."
					value={gifSearch}
					onChange={(e) => setGifSearch(e.target.value)}
					size="small"
					sx={SX_IN}
				/>

				{form.gif_url && (
					<Box sx={{ textAlign: "center" }}>
						<Typography
							sx={{
								color: "#22c55e",
								fontSize: "0.75rem",
								fontFamily: "'Barlow',sans-serif",
								mb: 1,
							}}
						>
							GIF sélectionné ✓
						</Typography>
						<img
							src={`${import.meta.env.VITE_API_URL}${form.gif_url}`}
							alt="gif sélectionné"
							style={{
								width: "100%",
								maxHeight: "180px",
								objectFit: "contain",
								borderRadius: "8px",
							}}
						/>
					</Box>
				)}

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						gap: "8px",
						maxHeight: "340px",
						overflowY: "auto",
						"&::-webkit-scrollbar": { width: "4px" },
						"&::-webkit-scrollbar-thumb": {
							background: "rgba(34,197,94,0.3)",
							borderRadius: "2px",
						},
					}}
				>
					{gifs
						.filter((g) =>
							g.nom.toLowerCase().includes(gifSearch.toLowerCase()),
						)
						.map((g) => (
							<Box
								key={g.id}
								onClick={() => setForm({ ...form, gif_url: g.gif_url })}
								sx={{
									position: "relative",
									paddingTop: "100%",
									borderRadius: "6px",
									overflow: "hidden",
									cursor: "pointer",
									border:
										form.gif_url === g.gif_url
											? "2px solid #22c55e"
											: "2px solid transparent",
									transition: "border 0.18s",
									"&:hover": { border: "2px solid rgba(34,197,94,0.5)" },
								}}
							>
								<img
									src={`${import.meta.env.VITE_API_URL}${g.gif_url}`}
									alt={g.nom}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: "100%",
										objectFit: "cover",
									}}
								/>
								<Typography
									sx={{
										position: "absolute",
										bottom: 0,
										left: 0,
										right: 0,
										fontSize: "0.65rem",
										color: "#7a8fa6",
										fontFamily: "'Barlow',sans-serif",
										p: "4px 6px",
										background: "#0f1b27",
										textAlign: "center",
									}}
								>
									{g.nom}
								</Typography>
							</Box>
						))}
				</Box>
			</Box>
		</Box>
	);
}
