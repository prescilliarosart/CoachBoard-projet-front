import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { StatItem } from "./StatItem";
import "./HomePage.css";
import { apiFetch } from "../services/api";

const statsData = [
	{ id: 1, target: 40, suffix: "+", label: "Élèves suivis" },
	{ id: 2, target: 100, suffix: "%", label: "Programmes sur mesure" },
	{ id: 3, target: 360, suffix: "°", label: "Suivi en temps réel" },
];

const heroWords = ["ENTRAÎNE-TOI", "MIEUX.", "PROGRESSE", "PLUS", "VITE."];

const features = [
	{
		id: 2,
		icon: "📈",
		title: "Suivez votre progression",
		desc: "Visualisez vos performances séance après séance grâce à des graphiques clairs.",
		imageKey: "progression",
		extra:
			"Analyse tes résultats semaine après semaine et identifie tes points forts.",
	},
	{
		id: 1,
		icon: "🎯",
		title: "Atteignez vos objectifs",
		desc: "Fixez des objectifs clairs et suivez votre progression vers chaque palier.",
		imageKey: "objectifs",
		extra: null,
	},
	{
		id: 3,
		icon: "📋",
		title: "Enregistrez vos programmes",
		desc: "Créez et sauvegardez vos programmes d'entraînement sur mesure, accessibles partout.",
		imageKey: "exercices",
		extra:
			"Retrouve tous tes exercices en un clin d'œil, depuis n'importe quel appareil.",
	},
];

const steps = [
	{
		id: 1,
		icon: "🎯",
		number: "01",
		title: "Le coach crée les programmes",
		desc: "Des programmes personnalisés pour chaque élève selon ses objectifs et son niveau.",
	},
	{
		id: 2,
		icon: "📱",
		number: "02",
		title: "L'élève consulte sa séance",
		desc: "Accède à ta séance du jour directement depuis l'application, n'importe où.",
	},
	{
		id: 3,
		icon: "📈",
		number: "03",
		title: "Les performances sont enregistrées",
		desc: "Poids, répétitions, temps, ressenti — tout est tracé pour mesurer ta progression.",
	},
];

interface AppImage {
	id: number;
	nom: string;
	url: string;
}

export default function HomePage() {
	const navigate = useNavigate();
	const [scrolled, setScrolled] = useState(false);
	const [titleVisible, setTitleVisible] = useState(false);
	const [appImages, setAppImages] = useState<AppImage[]>([]);
	const titleRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		apiFetch<AppImage[]>("/api/gifs/app-images")
			.then((data) => setAppImages(data))
			.catch(console.error);
	}, []);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		const el = titleRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setTitleVisible(true);
			},
			{ threshold: 0.3 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) entry.target.classList.add("visible");
				}
			},
			{ threshold: 0.12 },
		);
		const els = document.querySelectorAll(".reveal");
		for (const el of els) observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div className="home">
			<ProgressionCanvas />

			<nav className={`home__nav${scrolled ? " home__nav--scrolled" : ""}`}>
				<div className="home__nav-left">
					<span className="home__nav-logo">Julien Marchal · Coach Sportif</span>
				</div>
				<button
					type="button"
					className="home__btn-coach"
					onClick={() => navigate("/dashboard-coach")}
				>
					Connexion Coach
				</button>
			</nav>

			<section className="home__hero">
				<div className="home__hero-glow" aria-hidden="true" />
				<div className="home__hero-content">
					<p className="home__hero-eyebrow reveal">
						Julien Marchal · Coach Sportif à Nantes
					</p>
					<h1
						className="home__hero-title"
						data-text="ENTRAÎNE-TOI MIEUX. PROGRESSE PLUS VITE."
						ref={titleRef}
					>
						{heroWords.map((word, i) => (
							<span
								key={word}
								className={`home__hero-word${word === "MIEUX." ? " home__hero-word--green" : ""}${titleVisible ? " word-visible" : ""}`}
								style={{ transitionDelay: `${i * 0.12}s` }}
							>
								{word}{" "}
							</span>
						))}
					</h1>
					<p className="home__hero-subtitle reveal">
						CoachBoard connecte coach et élèves sur une seule plateforme.
						Programmes sur mesure, séances du jour, performances en temps réel.
					</p>
					<div className="home__hero-actions reveal">
						<button
							type="button"
							className="home__btn-primary"
							onClick={() => navigate("/dashboard-eleves")}
						>
							Commencer maintenant
						</button>
					</div>
				</div>
			</section>

			<section className="home__stats">
				{statsData.map((s) => (
					<StatItem
						key={s.id}
						target={s.target}
						suffix={s.suffix}
						label={s.label}
					/>
				))}
			</section>

			<section className="home__features">
				<h2 className="home__section-title reveal">
					TOUT CE DONT TU AS BESOIN
				</h2>
				<p className="home__section-sub reveal">
					Une app pensée et axée sur la performance
				</p>
				<div className="home__features-grid">
					{features.map((f, i) => {
						const img = appImages.find((a) => a.nom === f.imageKey);
						return (
							<div
								className="home__feature-card reveal"
								key={f.id}
								style={{ transitionDelay: `${i * 0.1}s` }}
							>
								<div className="home__feature-icon">{f.icon}</div>
								<h3 className="home__feature-title">{f.title}</h3>
								<p className="home__feature-desc">{f.desc}</p>
								{f.extra && <p className="home__feature-extra">{f.extra}</p>}
								<div className="home__feature-img">
									{img ? (
										<img
											src={`${import.meta.env.VITE_API_URL}${img.url}`}
											alt={f.title}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												borderRadius: "8px",
											}}
										/>
									) : (
										<span>image de l'appli</span>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</section>

			<section className="home__steps">
				<h2 className="home__section-title reveal">COMMENT ÇA MARCHE ?</h2>
				<p className="home__section-sub reveal">Simple, rapide, efficace.</p>
				<div className="home__steps-grid">
					{steps.map((s, i) => (
						<div
							className="home__step reveal"
							key={s.id}
							style={{ transitionDelay: `${i * 0.12}s` }}
						>
							<div className="home__step-icon">{s.icon}</div>
							<span className="home__step-number">{s.number}</span>
							<h3 className="home__step-title">{s.title}</h3>
							<p className="home__step-desc">{s.desc}</p>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
