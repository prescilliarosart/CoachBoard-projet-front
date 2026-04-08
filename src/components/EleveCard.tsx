import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Box, Button, Typography } from "@mui/material";

export default function EleveCard({ eleve }: { eleve: any }) {
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
				}}
			>
				<Avatar
					src={eleve.IMAGE_URL}
					alt={`${eleve.PRENOM} ${eleve.NOM}`}
					variant="square"
					sx={{
						width: "100%",
						height: "100%",
						bgcolor: "#0b1520",
						"& img": { objectFit: "cover" },
					}}
				>
					<PersonIcon
						sx={{ fontSize: "4rem", opacity: 0.3, color: "#22c55e" }}
					/>
				</Avatar>
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
						{eleve.NOM} {eleve.PRENOM}
					</Typography>
					<Button
						onClick={() => console.log("Détails de l'élève :", eleve)}
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
						Voir détails
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
