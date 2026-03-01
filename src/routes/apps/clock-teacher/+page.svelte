<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import WelcomeDialog from '$lib/components/WelcomeDialog.svelte';
  import { t } from '$lib/i18n';
  import { speak } from '$lib/tts';
  import { fade } from 'svelte/transition';

  type Mode = 'learn' | 'quiz';

  let mode = $state<Mode>('learn');
  let hours = $state(12);
  let minutes = $state(0);
  let quizTarget = $state({ h: 0, m: 0 });
  let quizAnswer = $state('');
  let quizFeedback = $state('');
  let score = $state(0);

  function timeText(h: number, m: number): string {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  function speakTime(h: number, m: number) {
    speak(timeText(h, m));
  }

  // Clock hand angles
  function hourAngle(h: number, m: number): number {
    return ((h % 12) + m / 60) * 30;
  }
  function minuteAngle(m: number): number {
    return m * 6;
  }

  function setHour(h: number) {
    hours = ((h % 12) + 12) % 12 || 12;
    speakTime(hours, minutes);
  }

  function setMinute(m: number) {
    minutes = ((m % 60) + 60) % 60;
    speakTime(hours, minutes);
  }

  function newQuiz() {
    quizFeedback = '';
    quizAnswer = '';
    const h = Math.floor(Math.random() * 12) + 1;
    const mOpts = [0, 15, 30, 45];
    const m = mOpts[Math.floor(Math.random() * mOpts.length)];
    quizTarget = { h, m };
    hours = h;
    minutes = m;
  }

  function checkQuiz() {
    const expected = timeText(quizTarget.h, quizTarget.m);
    const alt1 = `${quizTarget.h}:${quizTarget.m.toString().padStart(2, '0')}`;
    if (quizAnswer === expected || quizAnswer === alt1) {
      quizFeedback = '🎉 ' + $t('clock.correct');
      score++;
      speak($t('clock.correct'));
    } else {
      quizFeedback = `${$t('clock.wrong')} ${expected}`;
      speak(`${$t('clock.wrong')} ${expected}`);
    }
  }
</script>

<WelcomeDialog appId="clock-teacher" titleKey="app.clock_teacher" purposeKey="welcome.clockTeacher.purpose" howKey="welcome.clockTeacher.how" goalKey="welcome.clockTeacher.goal" icon="🕐" />

<div class="clock-page">
  <header class="app-header">
    <button class="back-btn" onclick={() => goto(`${base}/`)} aria-label={$t('app.back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <h1>{$t('clock.title')}</h1>
    <div class="mode-toggle">
      <button class="tab" class:active={mode === 'learn'} onclick={() => (mode = 'learn')}>{$t('clock.learn')}</button>
      <button class="tab" class:active={mode === 'quiz'} onclick={() => { mode = 'quiz'; newQuiz(); }}>{$t('clock.quiz')}</button>
    </div>
  </header>

  <div class="content" transition:fade>
    <!-- SVG Clock -->
    <svg class="clock-face" viewBox="0 0 200 200" width="240" height="240">
      <circle cx="100" cy="100" r="95" fill="var(--bg-card)" stroke="var(--border)" stroke-width="3"/>
      {#each Array(12) as _, i}
        {@const angle = (i + 1) * 30 * Math.PI / 180}
        <text x={100 + 78 * Math.sin(angle)} y={100 - 78 * Math.cos(angle) + 6}
          text-anchor="middle" font-size="16" font-weight="700" fill="currentColor">{i + 1}</text>
      {/each}
      {#each Array(60) as _, i}
        {@const angle = i * 6 * Math.PI / 180}
        {@const len = i % 5 === 0 ? 8 : 4}
        <line x1={100 + (90 - len) * Math.sin(angle)} y1={100 - (90 - len) * Math.cos(angle)}
              x2={100 + 90 * Math.sin(angle)} y2={100 - 90 * Math.cos(angle)}
              stroke="var(--text-muted)" stroke-width={i % 5 === 0 ? 2 : 1}/>
      {/each}
      <!-- Hour hand -->
      <line x1="100" y1="100"
            x2={100 + 50 * Math.sin(hourAngle(hours, minutes) * Math.PI / 180)}
            y2={100 - 50 * Math.cos(hourAngle(hours, minutes) * Math.PI / 180)}
            stroke="#E74C3C" stroke-width="5" stroke-linecap="round"/>
      <!-- Minute hand -->
      <line x1="100" y1="100"
            x2={100 + 70 * Math.sin(minuteAngle(minutes) * Math.PI / 180)}
            y2={100 - 70 * Math.cos(minuteAngle(minutes) * Math.PI / 180)}
            stroke="#3498DB" stroke-width="3" stroke-linecap="round"/>
      <circle cx="100" cy="100" r="5" fill="#333"/>
    </svg>

    <div class="time-display">
      <span class="time-text">{timeText(hours, minutes)}</span>
      <button class="speak-btn" onclick={() => speakTime(hours, minutes)}>🔊</button>
    </div>

    {#if mode === 'learn'}
      <div class="controls">
        <div class="ctrl-group">
          <span class="ctrl-label" style="color: #E74C3C">{$t('clock.hours')}</span>
          <button class="adj-btn" onclick={() => setHour(hours - 1)}>−</button>
          <button class="adj-btn" onclick={() => setHour(hours + 1)}>+</button>
        </div>
        <div class="ctrl-group">
          <span class="ctrl-label" style="color: #3498DB">{$t('clock.minutes')}</span>
          <button class="adj-btn" onclick={() => setMinute(minutes - 5)}>−5</button>
          <button class="adj-btn" onclick={() => setMinute(minutes + 5)}>+5</button>
        </div>
      </div>
    {:else}
      <div class="quiz-area">
        <p>{$t('clock.what_time')}</p>
        <input type="text" bind:value={quizAnswer} placeholder="HH:MM"
          onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') checkQuiz(); }}>
        <button class="check-btn" onclick={checkQuiz}>{$t('clock.check')}</button>
        {#if quizFeedback}<p class="feedback">{quizFeedback}</p>{/if}
        <button class="next-btn" onclick={newQuiz}>{$t('clock.next')} ➡️</button>
        <p class="score">{$t('clock.score')}: {score}</p>
      </div>
    {/if}
  </div>

  <footer class="credit">{$t('clock.credit')}</footer>
</div>

<style>
  .clock-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .app-header { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 10; }
  .back-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
  .app-header h1 { font-size: 1.2em; font-weight: 700; flex: 1; }
  .mode-toggle { display: flex; gap: 4px; }
  .tab { padding: 6px 14px; border-radius: 100px; border: 1px solid var(--border); font-weight: 600; font-size: 0.8em; background: none; min-height: 36px; }
  .tab.active { background: #3498DB; color: white; border-color: #3498DB; }

  .content { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .clock-face { display: block; }
  .time-display { display: flex; align-items: center; gap: 12px; }
  .time-text { font-size: 2.5em; font-weight: 800; font-variant-numeric: tabular-nums; }
  .speak-btn { font-size: 1.5em; background: none; border: none; min-width: 48px; min-height: 48px; }

  .controls { display: flex; gap: 24px; }
  .ctrl-group { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .ctrl-label { font-weight: 700; font-size: 0.85em; }
  .adj-btn { width: 56px; height: 48px; border-radius: 12px; border: 2px solid var(--border); font-weight: 800; font-size: 1.1em; background: var(--bg-card); }

  .quiz-area { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .quiz-area input { padding: 12px; border: 2px solid var(--border); border-radius: 12px; font-size: 1.5em; text-align: center; width: 120px; font-weight: 700; }
  .check-btn { padding: 12px 28px; background: #27AE60; color: white; border: none; border-radius: 100px; font-weight: 700; min-height: 48px; }
  .next-btn { padding: 10px 24px; border: 1px solid var(--border); border-radius: 100px; font-weight: 600; background: var(--bg-card); min-height: 48px; }
  .feedback { font-weight: 700; font-size: 1.1em; }
  .score { color: var(--text-muted); font-weight: 600; }
  .credit { text-align: center; padding: 12px; font-size: 0.7em; color: var(--text-muted); }
</style>
