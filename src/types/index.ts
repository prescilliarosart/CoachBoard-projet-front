export interface Coach {
	ID_COACH: number;
	PRENOM: string;
	NOM: string;
	EMAIL: string;
	// MOT_DE_PASSE exclu volontairement (ne doit pas transiter côté front)
}

export interface Eleve {
	ID_ELEVE: number;
	PRENOM: string;
	NOM: string;
	EMAIL: string;
	// MOT_DE_PASSE exclu volontairement
	AGE: number | null;
	POIDS_INITIAL: number | null;
	TAILLE: number | null;
	OBJECTIF: string | null;
	NIVEAU: string | null;
	IMAGE_URL: string | null;
}

export type User = {
	id: number;
	email: string;
	role: "coach" | "eleve";
	prenom: string;
	nom: string;
};

export interface Programme {
	ID_PROGRAMME: number;
	NOM: string;
	OBJECTIF: string | null;
	DUREE: number | null;
	ID_COACH: number;
}

export interface Seance {
	ID_SEANCE: number;
	TITRE: string;
	JOUR: string | null;
	ORDRE: number | null;
	ID_PROGRAMME: number;
}

export interface Exercice {
	ID_EXERCICE: number;
	NOM: string;
	DESCRIPTION: string | null;
	GROUPE_MUSCULAIRE: string | null;
	TYPE: string | null;
	IMAGE_URL: string | null;
	ID_COACH: number;
}

export interface EleveProgramme {
	ID_ELEVE_PROGRAMME: number;
	DATE_DEBUT: string | null; // DATE → string ISO côté JS
	STATUT: string | null;
	DATE_FIN: string | null;
	ID_PROGRAMME: number;
	ID_ELEVE: number;
}

export interface SeanceExercice {
	ID_SEANCES_EXERCICES: number;
	ID_SEANCE: number;
	ID_EXERCICE: number;
	SERIES: number | null;
	REPS: number | null;
	CHARGE: number | null;
	REPOS: number | null;
	ORDRE: number | null;
}

export interface Suivi {
	ID_SUIVI: number;
	CHARGE_SOULEVEE: number | null;
	REPS_REELLE: number | null;
	POIDS_CORPOREL: number | null;
	RESSENTI: string | null;
	COMMENTAIRES: string | null;
	DATE: string; // DATE → string ISO côté JS
	STATUT: string | null;
	ID_SEANCE: number;
	ID_SEANCES_EXERCICES: number;
	ID_ELEVE_PROGRAMME: number;
}

export interface SeanceAvecProgramme extends Seance {
	nom_programme: string;
}

export interface EleveProgrammeActif {
	id_eleve_programme: number;
	id_programme: number;
	statut: string | null;
}

export interface SeanceJour {
	ID_SEANCE: number;
	TITRE: string;
	JOUR: string | null;
}

export interface ExerciceRaw {
	ID_EXERCICE: number;
	NOM: string;
	TYPE: string | null;
	GROUPE_MUSCULAIRE: string | null;
	IMAGE_URL: string | null;
	ID_COACH: number;
}
