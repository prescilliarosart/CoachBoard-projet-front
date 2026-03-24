import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Chip, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useProgressionCanvas } from "../components/useProgressionCanvas";

type TypeExercice = "Cardio" | "Muscu" | "Mobilité" | "HIIT" | "Stretching";
const TYPES: TypeExercice[] = ["Cardio", "Muscu", "Mobilité", "HIIT", "Stretching"];
interface Exercice { id: number; nom: string; muscles: string[]; type: TypeExercice; }

const MOCK: Exercice[] = [
	{ id: 1, nom: "Squat", muscles: ["Fessiers", "Biceps"], type: "Muscu" },
	{ id: 2, nom: "Pompes", muscles: ["Pectoraux", "Triceps"], type: "Muscu" },
	{ id: 3, nom: "Gainage", muscles: ["Abdos", "Lombaires"], type: "Cardio" },
	{ id: 4, nom: "Fentes", muscles: ["Fessiers", "Biceps"], type: "Muscu" },
	{ id: 5, nom: "Burpees", muscles: ["Épaule", "Abdos"], type: "HIIT" },
	{ id: 6, nom: "Tractions", muscles: ["Dos", "Biceps"], type: "Muscu" },
	{ id: 7, nom: "Course", muscles: [], type: "Cardio" },
	{ id: 8, nom: "Étirements", muscles: ["Épaule", "Dos"], type: "Stretching" },
];

const SX_SEL = { background: "#111e2c", color: "#e2e8f0", fontFamily: "'Barlow',sans-serif", fontSize: "0.88rem", borderRadius: "6px", minWidth: 160, height: "40px", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(34,197,94,0.18)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(34,197,94,0.4)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22c55e" }, "& .MuiSvgIcon-root": { color: "#7a8fa6" } };
const MENU = { PaperProps: { sx: { background: "#0f1b27", border: "1px solid rgba(34,197,94,0.18)", "& .MuiMenuItem-root": { fontFamily: "'Barlow',sans-serif", fontSize: "0.88rem", color: "#e2e8f0", "&:hover": { background: "rgba(34,197,94,0.08)" }, "&.Mui-selected": { background: "rgba(34,197,94,0.12)", color: "#22c55e" } } } } };

function ExerciceCard({ ex }: { ex: Exercice }) {
	return (
		<Box sx={{ background: "#0f1b27", border: "1px solid rgba(34,197,94,0.13)", borderRadius: "10px", overflow: "hidden", transition: "transform 0.22s, border-color 0.22s, box-shadow 0.22s", "&:hover": { transform: "translateY(-4px)", borderColor: "#22c55e", boxShadow: "0 8px 28px rgba(34,197,94,0.15)" } }}>
			<Box sx={{ width: "100%", aspectRatio: "16/10", background: "linear-gradient(135deg, #1a2a35 0%, #0b1520 100%)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(34,197,94,0.08)" }}>
				<Typography sx={{ color: "#3a5060", fontSize: "0.75rem" }}>Image</Typography>
			</Box>
			<Box sx={{ p: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
					<Typography sx={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 700, fontSize: "0.95rem", color: "#e2e8f0", textTransform: "uppercase", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.nom}</Typography>
					<Chip label={ex.type} size="small" sx={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)", fontFamily: "'Barlow',sans-serif", fontSize: "0.65rem", height: "20px" }} />
				</Box>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
					{ex.muscles.slice(0, 3).map((m) => (
						<Typography key={m} sx={{ fontSize: "0.68rem", color: "#7a8fa6", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px", px: "6px", py: "1px" }}>{m}</Typography>
					))}
				</Box>
			</Box>
		</Box>
	);
}

export default function ExercicesPage() {
	useProgressionCanvas();
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<TypeExercice | "">("");
	const filtered = useMemo(() => MOCK.filter((ex) => ex.nom.toLowerCase().includes(search.toLowerCase()) && (typeFilter === "" || ex.type === typeFilter)), [search, typeFilter]);

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<canvas id="progression-canvas" className="home__sticky-canvas" aria-hidden="true" />
			<Navbar links={[{ label: "Programmes", path: "/programmes" }, { label: "Élèves", path: "/eleves" }, { label: "Progression", path: "/progression" }]} profilLabel="Mon profil - Coach" />
			<Box sx={{ px: "36px", py: "18px", borderBottom: "1px solid rgba(34,197,94,0.18)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<Typography sx={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 700, fontSize: "1.6rem", color: "#e2e8f0", textTransform: "uppercase" }}>Bibliothèque d'exercices</Typography>
					<FitnessCenterIcon sx={{ color: "#22c55e", fontSize: 22 }} />
				</Box>
				<Button onClick={() => navigate("/exercices/nouveau")} startIcon={<AddIcon sx={{ fontSize: 15 }} />} sx={{ background: "#22c55e", color: "#0b1520", fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", px: "16px", py: "7px", borderRadius: "4px", transition: "all 0.2s", "&:hover": { background: "#16a34a", transform: "translateY(-1px)", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" } }}>
					Ajouter un exercice
				</Button>
			</Box>
			<Box sx={{ p: "32px 36px", display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 2 }}>
				<Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
					<TextField placeholder="Rechercher" value={search} onChange={(e) => setSearch(e.target.value)} size="small"
						InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#7a8fa6", fontSize: 18 }} /></InputAdornment> }}
						sx={{ "& .MuiOutlinedInput-root": { background: "#111e2c", borderRadius: "6px", fontFamily: "'Barlow',sans-serif", fontSize: "0.88rem", color: "#e2e8f0", height: "40px", "& fieldset": { borderColor: "rgba(34,197,94,0.18)" }, "&:hover fieldset": { borderColor: "rgba(34,197,94,0.4)" }, "&.Mui-focused fieldset": { borderColor: "#22c55e" } }, "& input::placeholder": { color: "#7a8fa6" } }}
					/>
					<FormControl size="small">
						<InputLabel sx={{ color: "#7a8fa6", fontSize: "0.82rem", "&.Mui-focused": { color: "#22c55e" } }}>Type d'exercice</InputLabel>
						<Select value={typeFilter} label="Type d'exercice" onChange={(e) => setTypeFilter(e.target.value as TypeExercice | "")} sx={SX_SEL} MenuProps={MENU}>
							<MenuItem value=""><em style={{ color: "#7a8fa6" }}>Tous</em></MenuItem>
							{TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
						</Select>
					</FormControl>
				</Box>
				{filtered.length === 0 ? (
					<Box sx={{ textAlign: "center", py: "60px" }}><Typography sx={{ color: "#7a8fa6", fontFamily: "'Barlow',sans-serif" }}>Aucun exercice trouvé</Typography></Box>
				) : (
					<Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", "@media (max-width: 1100px)": { gridTemplateColumns: "repeat(3, 1fr)" }, "@media (max-width: 750px)": { gridTemplateColumns: "repeat(2, 1fr)" } }}>
						{filtered.map((ex) => <ExerciceCard key={ex.id} ex={ex} />)}
					</Box>
				)}
			</Box>
		</div>
	);
}
