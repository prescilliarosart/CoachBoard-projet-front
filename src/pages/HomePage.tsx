import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { StatItem } from "./StatItem";
import "./HomePage.css";

const statsData = [
	{ id: 1, target: 40, suffix: "+", label: "Élèves suivis" },
	{ id: 2, target: 100, suffix: "%", label: "Programmes sur mesure" },
	{ id: 3, target: 360, suffix: "°", label: "Suivi en temps réel" },
];

const heroWords = ["ENTRAÎNE-TOI", "MIEUX.", "PROGRESSE", "PLUS", "VITE."];

const features = [
	{
		id: 1,
		icon: "🎯",
		title: "Atteignez vos objectifs",
		desc: "Fixez des objectifs clairs et suivez votre progression vers chaque palier.",
	},
	{
		id: 2,
		icon: "📈",
		title: "Suivez votre progression",
		desc: "Visualisez vos performances séance après séance grâce à des graphiques clairs.",
	},
	{
		id: 3,
		icon: "📋",
		title: "Enregistrez vos programmes",
		desc: "Créez et sauvegardez vos programmes d'entraînement sur mesure, accessibles partout.",
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

const testimonials = [
	{
		id: 1,
		name: "Sophie M.",
		role: "Athlète amateur",
		comment:
			"CoachBoard a transformé ma façon de m'entraîner. Je progresse bien plus vite qu'avant !",
	},
	{
		id: 2,
		name: "Thomas K.",
		role: "Coach sportif",
		comment:
			"Un outil indispensable pour gérer mes élèves et leurs programmes d'entraînement.",
	},
	{
		id: 3,
		name: "Laura D.",
		role: "Sportive débutante",
		comment:
			"Interface intuitive, résultats concrets. Tout est centralisé au même endroit.",
	},
];

export default function HomePage() {
	const navigate = useNavigate();
	const [scrolled, setScrolled] = useState(false);
	const [titleVisible, setTitleVisible] = useState(false);
	const titleRef = useRef<HTMLHeadingElement>(null);

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
					<span className="home__nav-link">Programmes</span>
					<span className="home__nav-link">Progression</span>
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
						<span className="home__hero-hint">
							Inscription gratuite · Aucune carte requise
						</span>
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
					Une app pensée pour la performance, pas pour la paperasse.
				</p>
				<div className="home__features-grid">
					{features.map((f, i) => (
						<div
							className="home__feature-card reveal"
							key={f.id}
							style={{ transitionDelay: `${i * 0.1}s` }}
						>
							<div className="home__feature-icon">{f.icon}</div>
							<h3 className="home__feature-title">{f.title}</h3>
							<p className="home__feature-desc">{f.desc}</p>
							<div className="home__feature-img">
								<span>image de l'appli</span>
							</div>
						</div>
					))}
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

			<section className="home__testimonials">
				<h2 className="home__section-title reveal">ILS NOUS FONT CONFIANCE</h2>
				<div className="home__testimonials-grid">
					{testimonials.map((t, i) => (
						<div
							className="home__testimonial-card reveal"
							key={t.id}
							style={{ transitionDelay: `${i * 0.12}s` }}
						>
							<div className="home__testimonial-stars">★★★★★</div>
							<p className="home__testimonial-comment">"{t.comment}"</p>
							<div className="home__testimonial-author">
								<span className="home__testimonial-name">{t.name}</span>
								<span className="home__testimonial-role">{t.role}</span>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="home__cta reveal">
				<h2 className="home__cta-title">
					PRÊT À PASSER AU
					<br />
					<span>NIVEAU SUPÉRIEUR ?</span>
				</h2>
				<p className="home__cta-sub">
					Rejoins des centaines d'élèves qui progressent avec CoachBoard.
				</p>
				<button
					type="button"
					className="home__btn-primary home__btn-large"
					onClick={() => navigate("/login/eleve")}
				>
					Rejoindre CoachBoard
				</button>
			</section>
		</div>
	);
}
