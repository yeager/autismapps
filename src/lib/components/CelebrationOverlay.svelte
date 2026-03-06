<script>
  import { fade, scale } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';

  let { children } = $props();

  let particles = $state([]);
  let animFrame;

  onMount(() => {
    // Create confetti particles
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e91e63', '#ff9800'];
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
      });
    }
    particles = newParticles;

    function animate() {
      particles = particles.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        rotation: p.rotation + p.rotSpeed,
        vy: p.vy + 0.05,
      })).filter(p => p.y < 120);

      if (particles.length > 0) {
        animFrame = requestAnimationFrame(animate);
      }
    }
    animFrame = requestAnimationFrame(animate);

    // Play celebration sound via Web Audio
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'triangle';
        gain.gain.value = 0.2;
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15 * (i + 1) + 0.3);
        osc.start(ctx.currentTime + 0.15 * i);
        osc.stop(ctx.currentTime + 0.15 * (i + 1) + 0.3);
      });
    } catch {}
  });

  onDestroy(() => {
    if (animFrame) cancelAnimationFrame(animFrame);
  });
</script>

<div class="celebration" transition:fade={{ duration: 300 }}>
  <div class="confetti-layer">
    {#each particles as p (p.id)}
      <div
        class="confetti"
        style="left:{p.x}%;top:{p.y}%;width:{p.size}px;height:{p.size}px;background:{p.color};transform:rotate({p.rotation}deg)"
      ></div>
    {/each}
  </div>
  <div class="content" in:scale={{ duration: 400, delay: 200 }}>
    {@render children()}
  </div>
</div>

<style>
  .celebration {
    position: fixed; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.4);
    z-index: 100;
  }
  .confetti-layer {
    position: absolute; inset: 0;
    pointer-events: none; overflow: hidden;
  }
  .confetti {
    position: absolute;
    border-radius: 2px;
  }
  .content {
    background: white;
    border-radius: 24px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 1;
  }
</style>
