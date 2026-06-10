// ============================================================
// RESULTS CHART — Pure Canvas-based WPM graph
// ============================================================

class ResultsChart {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  draw(wpmHistory, rawWpmHistory) {
    const ctx = this.ctx;
    const W = this.canvas.width = this.canvas.offsetWidth;
    const H = this.canvas.height = this.canvas.offsetHeight;

    ctx.clearRect(0, 0, W, H);

    if (!wpmHistory || wpmHistory.length < 2) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Not enough data', W / 2, H / 2);
      return;
    }

    const maxWPM = Math.max(...wpmHistory.map(d => d.wpm), 10) * 1.2;
    const minWPM = 0;
    const padL = 50, padR = 20, padT = 20, padB = 40;
    const gW = W - padL - padR;
    const gH = H - padT - padB;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padT + (gH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + gW, y);
      ctx.stroke();
      const val = Math.round(maxWPM - (maxWPM / gridLines) * i);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '11px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(val, padL - 6, y + 4);
    }

    // X axis labels
    const step = Math.max(1, Math.floor(wpmHistory.length / 6));
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    wpmHistory.forEach((d, i) => {
      if (i % step === 0 || i === wpmHistory.length - 1) {
        const x = padL + (i / (wpmHistory.length - 1)) * gW;
        ctx.fillText(d.time + 's', x, H - padB + 16);
      }
    });

    // Helper to convert data to canvas coords
    const toX = (i) => padL + (i / Math.max(wpmHistory.length - 1, 1)) * gW;
    const toY = (wpm) => padT + gH - ((wpm - minWPM) / (maxWPM - minWPM)) * gH;

    // Draw WPM area fill
    const gradient = ctx.createLinearGradient(0, padT, 0, padT + gH);
    gradient.addColorStop(0, 'rgba(109,40,217,0.5)');
    gradient.addColorStop(1, 'rgba(109,40,217,0.02)');

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(wpmHistory[0].wpm));
    wpmHistory.forEach((d, i) => {
      if (i === 0) return;
      const xc = (toX(i - 1) + toX(i)) / 2;
      const yc = (toY(wpmHistory[i - 1].wpm) + toY(d.wpm)) / 2;
      ctx.quadraticCurveTo(toX(i - 1), toY(wpmHistory[i - 1].wpm), xc, yc);
    });
    ctx.lineTo(toX(wpmHistory.length - 1), toY(wpmHistory[wpmHistory.length - 1].wpm));
    ctx.lineTo(toX(wpmHistory.length - 1), padT + gH);
    ctx.lineTo(toX(0), padT + gH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw WPM line
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#a78bfa';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    wpmHistory.forEach((d, i) => {
      if (i === 0) ctx.moveTo(toX(i), toY(d.wpm));
      else {
        const xc = (toX(i - 1) + toX(i)) / 2;
        const yc = (toY(wpmHistory[i - 1].wpm) + toY(d.wpm)) / 2;
        ctx.quadraticCurveTo(toX(i - 1), toY(wpmHistory[i - 1].wpm), xc, yc);
      }
    });
    ctx.stroke();

    // Dots at each data point
    wpmHistory.forEach((d, i) => {
      ctx.beginPath();
      ctx.arc(toX(i), toY(d.wpm), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#a78bfa';
      ctx.fill();
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Legend
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.rect(padL, padT - 14, 12, 3);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('WPM over time', padL + 16, padT - 8);

    // Axis labels
    ctx.save();
    ctx.translate(12, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('WPM', 0, 0);
    ctx.restore();
  }
}
