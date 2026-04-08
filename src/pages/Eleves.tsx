import { Box, Container, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EleveCard from "../components/EleveCard";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

export default function Eleves() {
	const { token } = useAuth();
	const [eleves, setEleves] = useState<any[]>([]);

	useEffect(() => {
		console.log("Token :", token);
		fetch("http://localhost:3310/api/eleves", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Data reçue:", data);
				setEleves(data);
			})
			.catch((err) =>
				console.error("Erreur lors de la récupération des élèves :", err),
			);
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
					{eleves.map((e) => (
						<EleveCard key={e.ID_ELEVE} eleve={e} />
					))}
				</Box>
			</Container>
		</div>
	);
}
