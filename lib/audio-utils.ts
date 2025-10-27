// Audio utility for playing verification feedback sounds
export const playSound = async (type: "success" | "alert" | "processing") => {
  try {
    // Create audio context for generating sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    const now = audioContext.currentTime
    const duration = type === "processing" ? 0.3 : 0.5

    // Create oscillator for tone
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Set frequency based on sound type
    if (type === "success") {
      // Success: ascending tones
      oscillator.frequency.setValueAtTime(523.25, now) // C5
      oscillator.frequency.setValueAtTime(659.25, now + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, now + 0.2) // G5
    } else if (type === "alert") {
      // Alert: warning tone
      oscillator.frequency.setValueAtTime(440, now) // A4
      oscillator.frequency.setValueAtTime(440, now + 0.15)
      oscillator.frequency.setValueAtTime(440, now + 0.3)
    } else {
      // Processing: single tone
      oscillator.frequency.setValueAtTime(440, now) // A4
    }

    // Set volume envelope
    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)

    oscillator.start(now)
    oscillator.stop(now + duration)
  } catch (error) {
    console.error("Audio playback error:", error)
  }
}
