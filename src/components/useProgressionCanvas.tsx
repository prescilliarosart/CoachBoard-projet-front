import { useEffect } from "react";

export function useProgressionCanvas() {
	useEffect(() => {
		const canvas = document.getElementById(
			"progression-canvas",
		) as HTMLCanvasElement | null;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener("resize", resize);

		const getPoints = (w: number, h: number) => [
			{ x: 0, y: h * 0.9 },
			{ x: w * 0.08, y: h * 0.85 },
			{ x: w * 0.15, y: h * 0.8 },
			{ x: w * 0.22, y: h * 0.68 },
			{ x: w * 0.28, y: h * 0.72 },
			{ x: w * 0.35, y: h * 0.6 },
			{ x: w * 0.42, y: h * 0.52 },
			{ x: w * 0.48, y: h * 0.56 },
			{ x: w * 0.55, y: h * 0.44 },
			{ x: w * 0.62, y: h * 0.36 },
			{ x: w * 0.68, y: h * 0.4 },
			{ x: w * 0.76, y: h * 0.26 },
			{ x: w * 0.84, y: h * 0.18 },
			{ x: w * 0.92, y: h * 0.12 },
			{ x: w, y: h * 0.06 },
		];

		let progress = 0;
		let animId: number;
		const SPEED = 0.0025;

		const draw = () => {
			const w = canvas.width;
			const h = canvas.height;
			ctx.clearRect(0, 0, w, h);

			const cycleAlpha =
				progress < 0.12
					? progress / 0.12
					: progress > 0.82
						? Math.max(0, (1 - progress) / 0.18)
						: 1;
			ctx.globalAlpha = cycleAlpha;

			const points = getPoints(w, h);
			const total = points.length - 1;
			const drawn = progress * total;
			const fullIdx = Math.floor(drawn);
			const frac = drawn - fullIdx;

			const visiblePoints = points.slice(0, fullIdx + 1);
			if (fullIdx < total) {
				const curr = points[fullIdx];
				const next = points[fullIdx + 1];
				visiblePoints.push({
					x: curr.x + (next.x - curr.x) * frac,
					y: curr.y + (next.y - curr.y) * frac,
				});
			}

			if (visiblePoints.length < 2) {
				progress += SPEED;
				if (progress >= 1) progress = 0;
				animId = requestAnimationFrame(draw);
				return;
			}

			const lastPt = visiblePoints[visiblePoints.length - 1];

			ctx.save();
			ctx.beginPath();
			ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);
			for (let i = 1; i < visiblePoints.length; i++) {
				ctx.lineTo(visiblePoints[i].x, visiblePoints[i].y);
			}
			ctx.lineTo(lastPt.x, h);
			ctx.lineTo(0, h);
			ctx.closePath();
			const fillGrad = ctx.createLinearGradient(0, 0, w, 0);
			fillGrad.addColorStop(0, "rgba(34,197,94,0.00)");
			fillGrad.addColorStop(0.15, "rgba(34,197,94,0.08)");
			fillGrad.addColorStop(0.75, "rgba(34,197,94,0.08)");
			fillGrad.addColorStop(1, "rgba(34,197,94,0.00)");
			ctx.fillStyle = fillGrad;
			ctx.fill();
			ctx.restore();

			ctx.save();
			for (let i = 1; i < visiblePoints.length; i++) {
				const p0 = visiblePoints[i - 1];
				const p1 = visiblePoints[i];
				const relY = 1 - (p0.y + p1.y) / 2 / h;
				const relX = (p0.x + p1.x) / 2 / w;
				let alphaX = 1;
				if (relX < 0.12) alphaX = relX / 0.12;
				if (relX > 0.82) alphaX = (1 - relX) / 0.18;
				const alphaY = relY < 0.3 ? 1 : Math.max(0, 1 - (relY - 0.3) / 0.7);
				const alpha = Math.max(0, Math.min(1, alphaX * alphaY * 0.9));
				ctx.beginPath();
				ctx.moveTo(p0.x, p0.y);
				ctx.lineTo(p1.x, p1.y);
				ctx.strokeStyle = `rgba(34,197,94,${alpha})`;
				ctx.lineWidth = 2;
				ctx.shadowColor = "rgba(34,197,94,0.4)";
				ctx.shadowBlur = 10;
				ctx.stroke();
			}
			ctx.restore();

			ctx.save();
			for (let i = 1; i < visiblePoints.length - 1; i++) {
				const pt = visiblePoints[i];
				const relX = pt.x / w;
				const relY = 1 - pt.y / h;
				let alpha = 0.7;
				if (relX < 0.15) alpha *= relX / 0.15;
				if (relX > 0.8) alpha *= (1 - relX) / 0.2;
				if (relY > 0.3) alpha *= Math.max(0, 1 - (relY - 0.3) / 0.7);
				ctx.beginPath();
				ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(34,197,94,${alpha})`;
				ctx.shadowColor = "rgba(34,197,94,0.8)";
				ctx.shadowBlur = 8;
				ctx.fill();
			}
			ctx.restore();

			const dotRelX = lastPt.x / w;
			const dotRelY = 1 - lastPt.y / h;
			if (dotRelX > 0.05 && dotRelX < 0.82 && dotRelY < 0.65) {
				const dotAlpha =
					dotRelX < 0.15
						? dotRelX / 0.15
						: dotRelX > 0.75
							? (0.82 - dotRelX) / 0.07
							: 1;
				ctx.save();
				ctx.globalAlpha = dotAlpha * cycleAlpha;
				ctx.beginPath();
				ctx.arc(lastPt.x, lastPt.y, 5, 0, Math.PI * 2);
				ctx.fillStyle = "#22c55e";
				ctx.shadowColor = "#22c55e";
				ctx.shadowBlur = 20;
				ctx.fill();
				ctx.beginPath();
				ctx.arc(lastPt.x, lastPt.y, 10, 0, Math.PI * 2);
				ctx.fillStyle = "rgba(34,197,94,0.2)";
				ctx.fill();
				ctx.restore();
			}

			progress += SPEED;
			if (progress >= 1) progress = 0;
			animId = requestAnimationFrame(draw);
		};

		draw();
		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener("resize", resize);
		};
	}, []);
}
export function ProgressionCanvas() {
	useProgressionCanvas();
	return (
		<canvas
			id="progression-canvas"
			className="home__sticky-canvas"
			aria-hidden="true"
		/>
	);
}
