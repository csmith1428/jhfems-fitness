"use client";

/*
  Small sound and buzz cues for the workout timer.
  Phones only allow sound after a tap, so unlockAudio() is called
  from button taps. Everything here fails quietly if the phone says no.
*/

let audio: AudioContext | null = null;

export function unlockAudio() {
  try {
    if (!audio) {
      const Ctor =
        window.AudioContext ??
        (
          window as unknown as {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (Ctor) audio = new Ctor();
    }

    void audio?.resume();
  } catch {
    // No sound available. That's fine.
  }
}

function beep(startAfter: number, frequency: number) {
  if (!audio) return;

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const start = audio.currentTime + startAfter;

  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.2);
}

// Two quick beeps and a buzz when a new timed step starts.
export function playCue() {
  try {
    beep(0, 880);
    beep(0.25, 880);
    navigator.vibrate?.([120, 80, 120]);
  } catch {
    // Ignore.
  }
}
