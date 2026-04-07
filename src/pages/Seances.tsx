import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useEffect, useMemo, useState } from "react";
import FormSeance from "../components/FormSeances";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

export default function Seances() {
	const { token } = useAuth();
	const [seances, setSeances] = useState<any[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");

	useEffect(() => {
		fetch("http://localhost:3310/api/seances", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Séances reçues :", data);
				setSeances(data);
			})
			.catch((err) => console.error("Erreur chargement séances :", err));
	}, []);

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(`http://localhost:3310/api/seances/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!response.ok) throw new Error("Erreur lors de la suppression");

			setSeances(seances.filter((s) => s.ID_SEANCE !== id));
		} catch (err) {
			console.error("Erreur suppression séance :", err);
		}
	};
	const filteredSeances = useMemo(
		() =>
			seances.filter(
				(s) =>
					s.TITRE.toLowerCase().includes(search.toLowerCase()) ||
					s.nom_programme.toLowerCase().includes(search.toLowerCase()) ||
					s.JOUR.toLowerCase().includes(search.toLowerCase()),
			),
		[search, seances],
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
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					minHeight: "200px",
					margin: "80px 0 0",
					paddingTop: "60px",
					padding: "0 36px",
					paddingBottom: "45px",
					position: "relative",
					zIndex: 2,
					borderBottom: "1px solid rgba(34, 197, 94, 0.5)",
				}}
			>
				<Box
					component="section"
					sx={{
						color: "#fff",
						padding: "24px 36px",
						position: "relative",
						zIndex: 2,
					}}
				>
					<Typography
						variant="h1"
						sx={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: "3.5rem",
							fontStyle: "italic",
							fontWeight: 700,
						}}
					>
						Séances personnalisées
					</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						gap: 2,
						alignSelf: "flex-end",
						marginRight: "200px",
						position: "relative",
						zIndex: 2,
					}}
				></Box>
				<Button
					variant="contained"
					sx={{
						backgroundColor: "#22c55e",
						"&:hover": { backgroundColor: "#16a34a" },
					}}
					onClick={() => setShowForm(!showForm)}
				>
					{showForm ? "Annuler" : "Créer une séance"}
				</Button>
			</Box>

			<Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
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
						{filteredSeances.map((seance) => (
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
						))}
					</TableBody>
				</Table>
			</Box>
		</div>
	);
}
