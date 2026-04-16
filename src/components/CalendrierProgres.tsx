import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";

const GREEN = "#22c55e";
const CARD_BG = "#111827";
const BORDER = "rgba(255, 255, 255, 0.12)";

interface CalendrierProgresProps {
	suivi: any[];
}

const CalendrierProgres = ({ suivi }: CalendrierProgresProps) => {
	const now = new Date();
	const joursDuMois = Array.from({ length: 30 }, (_, i) => i + 1);
	const joursActifs = suivi.map((s) => new Date(s.DATE).getDate());

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
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
				<Typography
					variant="h6"
					sx={{
						fontFamily: "Barlow Condensed",
						fontWeight: 700,
						textTransform: "uppercase",
					}}
				>
					avril 2026
				</Typography>
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
							2 Semaines
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
							{joursActifs.length}
						</Typography>
					</Box>
				</Box>
			</Box>

			<Box
				sx={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 1 }}
			>
				{["L", "M", "M", "J", "V", "S", "D", ""].map((h, i) => (
					<Typography
						key={i}
						sx={{
							textAlign: "center",
							fontSize: "0.75rem",
							color: "#7a8fa6",
							fontWeight: 600,
						}}
					>
						{h}
					</Typography>
				))}

				{joursDuMois.map((jour, index) => {
					const estActif = joursActifs.includes(jour);
					const estFinDeSemaine = (index + 1) % 7 === 0;

					return (
						<React.Fragment key={jour}>
							<Box
								sx={{
									height: 35,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: "50%",
									bgcolor: estActif ? "#fff" : "transparent",
									color: estActif ? "#000" : "#7a8fa6",
									border: estActif
										? "none"
										: "1px solid rgba(255,255,255,0.05)",
									fontSize: "0.85rem",
									fontWeight: estActif ? 700 : 400,
								}}
							>
								{estActif ? "👟" : jour}
							</Box>

							{estFinDeSemaine && (
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										position: "relative",
									}}
								>
									<Box
										sx={{
											position: "absolute",
											width: 14,
											height: "120%",
											top: "-10%",
											bgcolor: "#e65100",
											borderRadius: 4,
											opacity: index < 14 ? 1 : 0.2,
											zIndex: 0,
										}}
									/>
									<LocalFireDepartmentIcon
										sx={{
											zIndex: 1,
											color: index < 14 ? "#ff9800" : "#444",
											fontSize: "1.2rem",
										}}
									/>
								</Box>
							)}
						</React.Fragment>
					);
				})}
			</Box>
		</Paper>
	);
};

export default CalendrierProgres;
