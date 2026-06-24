import { useEffect, useRef } from "react";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

export default function AudioVisualizer({ className = "h-16 w-full" }) {
  const canvasRef = useRef(null);
  const { playing, getAnalyser } = useAudioPlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    let raf;

    function draw() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx2d.scale(devicePixelRatio, devicePixelRatio);
      ctx2d.clearRect(0, 0, width, height);

      if (!playing) return;

      const analyser = getAnalyser();
      const data = new Uint8Array(analyser.frequencyBinCount);

      function render() {
        analyser.getByteFrequencyData(data);
        ctx2d.clearRect(0, 0, width, height);
        const barCount = 32;
        const barWidth = width / barCount;
        for (let i = 0; i < barCount; i++) {
          const value = data[i] || 0;
          const barHeight = Math.max(2, (value / 255) * height);
          ctx2d.fillStyle = `rgba(129, 140, 248, ${0.4 + (value / 255) * 0.6})`;
          ctx2d.fillRect(i * barWidth + 1, height - barHeight, barWidth - 2, barHeight);
        }
        raf = requestAnimationFrame(render);
      }
      render();
    }

    draw();
    return () => raf && cancelAnimationFrame(raf);
  }, [playing, getAnalyser]);

  return <canvas ref={canvasRef} className={className} />;
}
