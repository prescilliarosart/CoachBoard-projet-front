import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Button,
	Chip,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import FormExercice from "../components/FormExercices";
import Navbar from "../components/Navbar";
import { useProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

type TypeExercice = "Cardio" | "Muscu" | "Mobilité" | "HIIT" | "Stretching";
const TYPES: TypeExercice[] = [
	"Cardio",
	"Muscu",
	"Mobilité",
	"HIIT",
	"Stretching",
];

interface Exercice {
	id: number;
	nom: string;
	muscles: string[];
	type: TypeExercice;
	image_url?: string;
}

interface GifData {
	id: number;
	nom: string;
	categorie: string;
	gif_url: string;
	muscles: string[];
}

const SX_SEL = {
	background: "#111e2c",
	color: "#e2e8f0",
	fontFamily: "'Barlow',sans-serif",
	fontSize: "0.88rem",
	borderRadius: "6px",
	minWidth: 160,
	height: "40px",
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

function ExerciceCard({
	ex,
	gifUrl,
	onDelete,
}: {
	ex: Exercice;
	gifUrl: string | null;
	onDelete: () => void;
}) {
	return (
		<Box
			sx={{
				background: "#0f1b27",
				border: "1px solid rgba(34,197,94,0.13)",
				borderRadius: "10px",
				overflow: "hidden",
				transition: "transform 0.22s, border-color 0.22s, box-shadow 0.22s",
				"&:hover": {
					transform: "translateY(-4px)",
					borderColor: "#22c55e",
					boxShadow: "0 8px 28px rgba(34,197,94,0.15)",
				},
			}}
		>
			<Box
				sx={{
					width: "100%",
					aspectRatio: "16/10",
					background: "linear-gradient(135deg, #1a2a35 0%, #0b1520 100%)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					borderBottom: "1px solid rgba(34,197,94,0.08)",
					overflow: "hidden",
				}}
			>
				{gifUrl ? (
					<img
						src={`http://localhost:3310${gifUrl}`}
						alt={ex.nom}
						style={{ width: "100%", height: "100%", objectFit: "contain" }}
					/>
				) : (
					<Typography sx={{ color: "#3a5060", fontSize: "0.75rem" }}>
						Aucun GIF
					</Typography>
				)}
			</Box>
			<Box
				sx={{
					p: "12px 14px",
					display: "flex",
					flexDirection: "column",
					gap: "8px",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 1,
					}}
				>
					<Typography
						sx={{
							fontFamily: "'Barlow Condensed',sans-serif",
							fontStyle: "italic",
							fontWeight: 700,
							fontSize: "0.95rem",
							color: "#e2e8f0",
							textTransform: "uppercase",
							flex: 1,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{ex.nom}
					</Typography>
					<Chip
						label={ex.type}
						size="small"
						sx={{
							background: "rgba(34,197,94,0.1)",
							color: "#22c55e",
							border: "1px solid rgba(34,197,94,0.25)",
							fontFamily: "'Barlow',sans-serif",
							fontSize: "0.65rem",
							height: "20px",
						}}
					/>
				</Box>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
					{ex.muscles.slice(0, 3).map((m) => (
						<Typography
							key={m}
							sx={{
								fontSize: "0.68rem",
								color: "#7a8fa6",
								background: "rgba(255,255,255,0.04)",
								border: "1px solid rgba(255,255,255,0.07)",
								borderRadius: "4px",
								px: "6px",
								py: "1px",
							}}
						>
							{m}
						</Typography>
					))}
				</Box>
				<Button
					onClick={onDelete}
					size="small"
					sx={{
						color: "#7a8fa6",
						fontFamily: "'Barlow',sans-serif",
						fontSize: "0.72rem",
						textTransform: "uppercase",
						mt: "4px",
						"&:hover": { color: "#ef4444" },
					}}
				>
					Supprimer
				</Button>
			</Box>
		</Box>
	);
}

export default function ExercicesPage() {
	useProgressionCanvas();
	const { token } = useAuth();
	const [exercices, setExercices] = useState<Exercice[]>([]);
	const [gifs, setGifs] = useState<GifData[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<TypeExercice | "">("");

	const fetchExercices = () => {
		fetch("http://localhost:3310/api/exercices", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				const mapped = data.map((ex: any) => ({
					id: ex.ID_EXERCICE,
					nom: ex.NOM,
					type: ex.TYPE as TypeExercice,
					muscles: ex.GROUPE_MUSCULAIRE ? ex.GROUPE_MUSCULAIRE.split(", ") : [],
					image_url: ex.IMAGE_URL ?? null,
				}));
				setExercices(mapped);
			})
			.catch((err) => console.error("Erreur chargement exercices :", err));
	};

	const fetchGifs = () => {
		fetch("http://localhost:3310/api/gifs")
			.then((res) => res.json())
			.then((data) => setGifs(data))
			.catch((err) => console.error("Erreur chargement GIFs :", err));
	};

	const getGifForExercice = (ex: Exercice): string | null => {
		if (ex.image_url) return ex.image_url;

		const nomLower = ex.nom.toLowerCase().trim();

		// 1. Match par nom
		const byNom = gifs.find(
			(g) =>
				g.nom.toLowerCase().includes(nomLower) ||
				nomLower.includes(g.nom.toLowerCase()),
		);
		if (byNom) return byNom.gif_url;

		// 2. Match par muscles
		if (ex.muscles.length > 0) {
			const byMuscle = gifs.find((g) =>
				g.muscles?.some((m) => ex.muscles.includes(m)),
			);
			if (byMuscle) return byMuscle.gif_url;
		}

		return null;
	};

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(
				`http://localhost:3310/api/exercices/${id}`,
				{
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			if (!response.ok) throw new Error("Erreur suppression");
			fetchExercices();
		} catch (err) {
			console.error("Erreur suppression exercice :", err);
		}
	};

	useEffect(() => {
		fetchExercices();
		fetchGifs();
	}, []);

	const filtered = useMemo(
		() =>
			exercices.filter(
				(ex) =>
					ex.nom.toLowerCase().includes(search.toLowerCase()) &&
					(typeFilter === "" || ex.type === typeFilter),
			),
		[search, typeFilter, exercices],
	);

	return (
		<div
			style={{
				position: "relative",
				zIndex: 1,
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			<canvas
				id="progression-canvas"
				className="home__sticky-canvas"
				aria-hidden="true"
			/>
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Seances", path: "/seances" },
					{ label: "Exercices", path: "/exercices" },
				]}
				profilLabel="Mon profil - Coach"
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
					flexShrink: 0,
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
						Bibliothèque d'exercices
					</Typography>
					<FitnessCenterIcon sx={{ color: "#22c55e", fontSize: 22 }} />
				</Box>
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
					{showForm ? "Annuler" : "Ajouter un exercice"}
				</Button>
			</Box>

			<Box
				sx={{
					p: "24px 36px",
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					position: "relative",
					zIndex: 2,
					flex: 1,
					overflowY: "auto",
					"&::-webkit-scrollbar": { width: "4px" },
					"&::-webkit-scrollbar-track": { background: "transparent" },
					"&::-webkit-scrollbar-thumb": {
						background: "rgba(34,197,94,0.3)",
						borderRadius: "2px",
					},
				}}
			>
				{showForm && (
					<FormExercice
						onSuccess={() => {
							setShowForm(false);
							fetchExercices();
						}}
					/>
				)}

				{!showForm && (
					<>
						<Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
							<TextField
								placeholder="Rechercher"
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
									Type d'exercice
								</InputLabel>
								<Select
									value={typeFilter}
									label="Type d'exercice"
									onChange={(e) =>
										setTypeFilter(e.target.value as TypeExercice | "")
									}
									sx={SX_SEL}
									MenuProps={MENU}
								>
									<MenuItem value="">
										<em style={{ color: "#7a8fa6" }}>Tous</em>
									</MenuItem>
									{TYPES.map((t) => (
										<MenuItem key={t} value={t}>
											{t}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>

						{filtered.length === 0 ? (
							<Box sx={{ textAlign: "center", py: "60px" }}>
								<Typography
									sx={{ color: "#7a8fa6", fontFamily: "'Barlow',sans-serif" }}
								>
									Aucun exercice trouvé
								</Typography>
							</Box>
						) : (
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(4, 1fr)",
									gap: "16px",
									"@media (max-width: 1100px)": {
										gridTemplateColumns: "repeat(3, 1fr)",
									},
									"@media (max-width: 750px)": {
										gridTemplateColumns: "repeat(2, 1fr)",
									},
								}}
							>
								{filtered.map((ex) => (
									<ExerciceCard
										key={ex.id}
										ex={ex}
										gifUrl={getGifForExercice(ex)}
										onDelete={() => handleDelete(ex.id)}
									/>
								))}
							</Box>
						)}
					</>
				)}
			</Box>
		</div>
	);
}
