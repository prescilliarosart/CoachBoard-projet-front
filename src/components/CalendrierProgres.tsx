import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import React, { useState } from "react";

const GREEN = "#22c55e";
const CARD_BG = "#0f1e2e";
const BORDER = "rgba(255, 255, 255, 0.12)";

interface CalendrierProgresProps {
	suivi: any[];
}

const CalendrierProgres = ({ suivi }: CalendrierProgresProps) => {
	const [moisAffiche, setMoisAffiche] = useState(new Date());
	const annee = moisAffiche.getFullYear();
	const mois = moisAffiche.getMonth();

	const nbJours = new Date(annee, mois + 1, 0).getDate();
	const tableauJours = Array.from({ length: nbJours }, (_, i) => i + 1);

	// Gére le décalage de dates

	let premierJourIndex = new Date(annee, mois, 1).getDay();
	premierJourIndex = premierJourIndex === 0 ? 6 : premierJourIndex - 1;
	const casesVides = Array.from({ length: premierJourIndex });

	const moisPrecedent = () => {
		setMoisAffiche(new Date(annee, mois - 1, 1));
	};

	const moisSuivant = () => {
		setMoisAffiche(new Date(annee, mois + 1, 1));
	};

	// Filtre des jours actifs pour le mois en cours
	const joursActifsUniques = [
		...new Set(
			suivi
				.filter((s) => {
					const d = new Date(s.DATE);
					return d.getMonth() === mois && d.getFullYear() === annee;
				})
				.map((s) => new Date(s.DATE).getDate()),
		),
	];

	const calculerSerieConsecutive = (): number => {
		let compteur = 0;
		const aujourdhui = new Date();
		const dateCourante = new Date(aujourdhui);

		while (true) {
			const jourSemaine =
				dateCourante.getDay() === 0 ? 6 : dateCourante.getDay() - 1;
			const debutSemaine = new Date(dateCourante);
			debutSemaine.setDate(dateCourante.getDate() - jourSemaine);
			debutSemaine.setHours(0, 0, 0, 0);

			const finSemaine = new Date(debutSemaine);
			finSemaine.setDate(debutSemaine.getDate() + 6);
			finSemaine.setHours(23, 59, 59, 999);

			const aActivite = suivi.some((s) => {
				const d = new Date(s.DATE);
				return d >= debutSemaine && d <= finSemaine;
			});

			if (!aActivite) break;

			compteur++;
			dateCourante.setDate(dateCourante.getDate() - 7);
		}

		return compteur;
	};

	const nbSemainesConsecutives = calculerSerieConsecutive();

	return (
		<Paper
			sx={{
				background: CARD_BG,
				p: 3,
				borderRadius: 2,
				border: `1px solid ${BORDER}`,
				color: "#fff",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					mb: 3,
					alignItems: "center",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Typography
						variant="h6"
						sx={{
							fontFamily: "Barlow Condensed",
							fontWeight: 700,
							textTransform: "uppercase",
						}}
					>
						{moisAffiche.toLocaleDateString("fr-FR", {
							month: "long",
							year: "numeric",
						})}
					</Typography>
					<Box>
						<IconButton
							size="small"
							onClick={moisPrecedent}
							sx={{ color: "#fff" }}
						>
							<ChevronLeftIcon />
						</IconButton>
						<IconButton
							size="small"
							onClick={moisSuivant}
							sx={{ color: "#fff" }}
						>
							<ChevronRightIcon />
						</IconButton>
					</Box>
				</Box>
				<Box sx={{ display: "flex", gap: 3 }}>
					<Box textAlign="right">
						<Typography
							sx={{
								fontSize: "0.65rem",
								color: "#7a8fa6",
								textTransform: "uppercase",
							}}
						>
							Série
						</Typography>
						<Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
							{nbSemainesConsecutives} Semaine
							{nbSemainesConsecutives > 1 ? "s" : ""}
						</Typography>
					</Box>
					<Box textAlign="right">
						<Typography
							sx={{
								fontSize: "0.65rem",
								color: "#7a8fa6",
								textTransform: "uppercase",
							}}
						>
							Activités
						</Typography>
						<Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
							{joursActifsUniques.length}
						</Typography>
					</Box>
				</Box>
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(8, 1fr)",
					gap: 1.5,
					rowGap: 2,
				}}
			>
				{["L", "M", "M", "J", "V", "S", "D", ""].map((h, i) => (
					<Typography
						key={i}
						sx={{
							textAlign: "center",
							fontSize: "0.75rem",
							color: "#7a8fa6",
							fontWeight: 800,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{h}
					</Typography>
				))}

				{casesVides.map((_, i) => (
					<Box key={`empty-${i}`} />
				))}

				{tableauJours.map((jour, index) => {
					const estActif = joursActifsUniques.includes(jour);
					const positionSemaine = (premierJourIndex + index) % 7;
					const estDimanche = positionSemaine === 6;

					// Regarde les 7 derniers jours qui précèdent
					const finSemaine = jour;
					const debutSemaine = jour - 6 > 0 ? jour - 6 : 1;

					// Verification si un jour de semaine est actif
					const semaineValidee = joursActifsUniques.some(
						(j) => j >= debutSemaine && j <= finSemaine,
					);

					return (
						<React.Fragment key={jour}>
							<Box
								sx={{
									height: 38,
									width: 38,
									margin: "auto",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: "50%",
									bgcolor: estActif ? "#fff" : "transparent",
									color: estActif ? "#000" : "#7a8fa6",
									transition: "transform 0.2s ease-in-out",
									"&:hover": { transform: "scale(1.1)" },
									border: estActif
										? "none"
										: "1px solid rgba(255,255,255,0.05)",
									fontSize: "0.85rem",
									fontWeight: estActif ? 800 : 400,
								}}
							>
								{estActif ? "👟" : jour}
							</Box>

							{estDimanche && (
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										position: "relative",
										height: "100%",
										justifyContent: "center",
									}}
								>
									<Box
										sx={{
											position: "absolute",
											width: 22,
											height: "90%",
											top: "5%",
											bgcolor: semaineValidee
												? "#e65100"
												: "rgba(255,255,255,0.05)",
											borderRadius: "100px",
											zIndex: 0,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											transition:
												"all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275",
										}}
									/>
									<LocalFireDepartmentIcon
										sx={{
											zIndex: 1,
											color: semaineValidee ? "#ff9800" : "#333",
											fontSize: "2rem",
											animation: semaineValidee ? "pulse 2s infinite" : "none",
											"@keyframes pulse": {
												"0%": { transform: "scale(1)" },
												"50%": { transform: "scale(1.1)" },
												"100%": { transform: "scale(1)" },
											},
										}}
									/>

									{semaineValidee && (
										<Typography
											sx={{
												position: "absolute",
												zIndex: 1,
												bottom: "5px",
												fontSize: "0.7rem",
												fontWeight: 900,
												color: "#000000",
												lineHeight: 1,
											}}
										>
											{nbSemainesConsecutives}
										</Typography>
									)}
								</Box>
							)}
						</React.Fragment>
					);
				})}

				{Array.from({
					length: (7 - ((premierJourIndex + nbJours) % 7)) % 7,
				}).map((_, i) => (
					<Box key={`fill-${i}`} />
				))}
				{(premierJourIndex + nbJours) % 7 !== 0 && (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							position: "relative",
						}}
					>
						<Box
							sx={{
								position: "absolute",
								width: 22,
								height: "90%",
								bgcolor: "rgba(255,255,255,0.05)",
								borderRadius: "100px",
							}}
						/>
						<LocalFireDepartmentIcon sx={{ color: "#333", fontSize: "2rem" }} />
					</Box>
				)}
			</Box>
		</Paper>
	);
};

export default CalendrierProgres;
