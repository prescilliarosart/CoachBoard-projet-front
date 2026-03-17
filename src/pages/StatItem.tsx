import { type CSSProperties, useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1800, start = false) {
	const [count, setCount] = useState(0);
	useEffect(() => {
		if (!start) return;
		let startTime: number | null = null;
		const step = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			const ease = 1 - (1 - progress) ** 3;
			setCount(Math.floor(ease * target));
			if (progress < 1) requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	}, [target, duration, start]);
	return count;
}

const barWidths: Record<number, string> = {
	40: "45%",
	100: "100%",
	360: "80%",
};

export function StatItem({
	target,
	suffix,
	label,
}: {
	target: number;
	suffix: string;
	label: string;
}) {
	const [started, setStarted] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const count = useCountUp(target, 1800, started);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setStarted(true);
			},
			{ threshold: 0.5 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div className="home__stat" ref={ref}>
			<span className="home__stat-value">
				{count}
				{suffix}
			</span>
			<span className="home__stat-label">{label}</span>
			<div
				className={`home__stat-bar${started ? " bar-animate" : ""}`}
				style={{ "--bar-width": barWidths[target] ?? "60%" } as CSSProperties}
			/>
		</div>
	);
}
