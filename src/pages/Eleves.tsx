import {
	Box,
	CircularProgress,
	Container,
	Toolbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import EleveCard from "../components/EleveCard";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { apiFetch } from "../services/api";
import type { Eleve } from "../types";

export default function Eleves() {
	const [eleves, setEleves] = useState<Eleve[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEleves = async () => {
			try {
				const data = await apiFetch<Eleve[]>("/api/eleves");
				setEleves(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des élèves :", error);
			} finally {
				setLoading(false);
			}
		};
		fetchEleves();
	}, []);

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
						Mes élèves
					</Typography>
				</Box>
			</Box>
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
							md: "repeat(3, 1fr)",
						},
						gap: 3,
					}}
				>
					{loading ? (
						<Box
							sx={{
								gridColumn: "1/-1",
								display: "flex",
								justifyContent: "center",
								py: 8,
							}}
						>
							<CircularProgress sx={{ color: "#22c55e" }} />
						</Box>
					) : eleves.length === 0 ? (
						<Box sx={{ gridColumn: "1/-1", textAlign: "center", py: 8 }}>
							<Typography
								sx={{
									color: "#7a8fa6",
									fontFamily: "'Barlow',sans-serif",
									fontSize: "1rem",
								}}
							>
								Aucun élève pour l'instant.
							</Typography>
						</Box>
					) : (
						eleves.map((e) => <EleveCard key={e.ID_ELEVE} eleve={e} />)
					)}
				</Box>
			</Container>
		</div>
	);
}
