/**
 * Aanchal & Arpit - Wedding Invitation
 * Interactive Script: Intro Video, Scratch Card, Audio Controller, RSVP Modal, Floating Petals & Confetti
 */

document.addEventListener('DOMContentLoaded', () => {
  initVideoIntroSequence();
  initPetalsLayer();
  initScratchCard();
  initAudioController();
  initRsvpModal();
  initCountdown();
  initScrollButtons();
  initSocialShare();
});

/* ===================================================================
   1. INTRO VIDEO SEQUENCE & MUSIC PLAYBACK
   =================================================================== */
function playWeddingMusic() {
  const audio = document.getElementById('weddingAudio');
  const btn = document.getElementById('musicToggleBtn');
  const iconWrapper = btn ? btn.querySelector('.music-icon-wrapper') : null;
  if (!audio) return;

  audio.muted = false;
  audio.volume = 1.0;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      if (iconWrapper) iconWrapper.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }).catch(err => {
      console.log('Audio autoplay policy note:', err);
      // Fallback: unlock on next interaction anywhere
      const unlock = () => {
        audio.play().then(() => {
          if (iconWrapper) iconWrapper.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }).catch(() => {});
        document.removeEventListener('click', unlock);
        document.removeEventListener('touchstart', unlock);
      };
      document.addEventListener('click', unlock, { once: true });
      document.addEventListener('touchstart', unlock, { once: true });
    });
  }
}

function initVideoIntroSequence() {
  const stage = document.getElementById('introEnvelopeStage');
  const videoEnv = document.getElementById('videoEnv');
  const videoIntro = document.getElementById('videoIntro');
  const logoOverlay = document.getElementById('videoLogoOverlay');
  const tapPrompt = document.getElementById('tapToOpenPrompt');
  const tapPill = document.getElementById('tapTextPill');
  const skipBtn = document.getElementById('skipIntroBtn');
  const mainContent = document.getElementById('mainContent');
  const audio = document.getElementById('weddingAudio');

  if (!stage || !videoEnv || !mainContent) return;

  let hasStarted = false;
  let hasTransitioned = false;
  let video2Started = false;

  // Pre-load / warm audio
  if (audio) {
    try {
      audio.load();
    } catch (e) {}
  }

  videoEnv.muted = true;
  videoEnv.defaultMuted = true;
  if (videoIntro) {
    videoIntro.muted = true;
    videoIntro.defaultMuted = true;
  }

  function startExperience() {
    // Start background romantic instrumental audio immediately on user gesture
    playWeddingMusic();

    if (hasStarted) return;
    hasStarted = true;

    if (tapPrompt) tapPrompt.classList.add('hide');
    if (tapPill) tapPill.classList.add('hide');
    if (skipBtn) skipBtn.classList.remove('hidden');

    // Play Envelope Video 1
    videoEnv.currentTime = 0;
    const v1Promise = videoEnv.play();
    if (v1Promise !== undefined) {
      v1Promise.catch(err => {
        console.log('Video 1 play failed:', err);
        playVideo2();
      });
    }
  }

  function playVideo2() {
    if (video2Started) return;
    video2Started = true;

    if (!videoIntro) {
      transitionToMain();
      return;
    }

    // Fade in and play Video 2
    videoIntro.classList.remove('opacity-0');
    videoIntro.classList.add('opacity-100');
    videoIntro.currentTime = 0;
    const v2Promise = videoIntro.play();
    if (v2Promise !== undefined) {
      v2Promise.catch(err => {
        console.log('Video 2 play failed:', err);
        transitionToMain();
      });
    }
  }

  // When Video 1 reaches near end (or ends), trigger Video 2
  videoEnv.addEventListener('timeupdate', () => {
    if (videoEnv.duration && (videoEnv.duration - videoEnv.currentTime <= 0.45)) {
      playVideo2();
    }
  });

  videoEnv.addEventListener('ended', () => {
    playVideo2();
  });

  // Video 2 progress: reveal center logo overlay when center space opens up (at 3.2s)
  if (videoIntro) {
    videoIntro.addEventListener('timeupdate', () => {
      if (videoIntro.currentTime >= 3.2 && logoOverlay && !logoOverlay.classList.contains('show')) {
        logoOverlay.classList.add('show');
      }

      if (videoIntro.duration && (videoIntro.duration - videoIntro.currentTime <= 0.5)) {
        transitionToMain();
      }
    });

    videoIntro.addEventListener('ended', () => {
      transitionToMain();
    });
  }

  function transitionToMain() {
    if (hasTransitioned) return;
    hasTransitioned = true;

    // Ensure music is running
    playWeddingMusic();

    stage.classList.add('fade-out');
    mainContent.classList.remove('opacity-0');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      stage.style.display = 'none';
    }, 850);
  }

  // Direct listeners for Tap to Open / Wax Seal
  if (tapPrompt) {
    tapPrompt.addEventListener('pointerdown', startExperience);
    tapPrompt.addEventListener('click', startExperience);
    tapPrompt.addEventListener('touchstart', startExperience, { passive: true });
  }

  if (tapPill) {
    tapPill.addEventListener('pointerdown', startExperience);
    tapPill.addEventListener('click', startExperience);
    tapPill.addEventListener('touchstart', startExperience, { passive: true });
  }

  stage.addEventListener('pointerdown', startExperience);
  stage.addEventListener('touchstart', startExperience, { passive: true });
  stage.addEventListener('click', startExperience);

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playWeddingMusic();
      transitionToMain();
    });
  }
}

/* ===================================================================
   2. FLOATING PETALS LAYER
   =================================================================== */
function initPetalsLayer() {
  const container = document.getElementById('petalsOverlay');
  if (!container) return;

  const petalImages = [
    'assets/falling-daisy-DWyrh5i3.png',
    'assets/falling-rose-petal-CzrX2ZBd.png'
  ];

  const totalPetals = 7; // Gentle, subtle petal fall as requested

  for (let i = 0; i < totalPetals; i++) {
    const el = document.createElement('div');
    el.className = 'floating-petal';

    const imgSrc = petalImages[i % 2];
    const size = Math.floor(Math.random() * 14) + 12;
    const left = Math.random() * 92 + 4;
    const duration = Math.random() * 9 + 9;
    const delay = Math.random() * 7;

    el.innerHTML = `<img src="${imgSrc}" style="width: ${size}px; height: auto; opacity: 0.65;" />`;
    el.style.left = `${left}%`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;

    container.appendChild(el);
  }
}

/* ===================================================================
   3. INTERACTIVE SCRATCH CARD (HEART - SCREENSHOT 2)
   =================================================================== */
function initScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  const container = document.getElementById('scratchCardContainer');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let isRevealed = false;
  let scratchPointsCount = 0;

  let width = container.clientWidth || 340;
  let height = container.clientHeight || 340;
  canvas.width = width;
  canvas.height = height;

  const heartImg = new Image();
  heartImg.src = 'assets/pink-heart.png';

  heartImg.onload = () => {
    width = container.clientWidth || 340;
    height = container.clientHeight || 340;
    canvas.width = width;
    canvas.height = height;
    drawHeartCover();
  };

  heartImg.onerror = () => {
    drawFallbackHeart();
  };

  function drawHeartCover() {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(heartImg, 0, 0, width, height);
  }

  function drawFallbackHeart() {
    ctx.clearRect(0, 0, width, height);
    const scale = width / 240;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.moveTo(120, 65);
    ctx.bezierCurveTo(120, 15, 30, 15, 30, 90);
    ctx.bezierCurveTo(30, 140, 90, 175, 120, 215);
    ctx.bezierCurveTo(150, 175, 210, 140, 210, 90);
    ctx.bezierCurveTo(210, 15, 120, 15, 120, 65);
    ctx.fillStyle = '#f7a8b8';
    ctx.fill();
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#84651d';
    ctx.font = 'bold 20px "Great Vibes", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here', 120, 120);
    ctx.restore();
  }

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function revealCard() {
    if (isRevealed) return;
    isRevealed = true;

    const revealedCard = document.getElementById('revealedDateCard');
    if (revealedCard) {
      revealedCard.classList.remove('opacity-0');
      revealedCard.classList.add('opacity-100');
    }

    // Fade out scratch cover smoothly
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.style.pointerEvents = 'none';
      canvas.style.display = 'none';
    }, 600);

    // Reveal Countdown Timer with smooth animation
    const countdownWrapper = document.getElementById('heartCountdownWrapper');
    if (countdownWrapper) {
      countdownWrapper.classList.remove('countdown-hidden');
      countdownWrapper.classList.add('countdown-revealed');
      countdownWrapper.style.display = 'block';
    }

    // Celebration Confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 }
      });
    }
    showToast('Dates Revealed! 🌸 11 & 12 December 2026');
  }

  function scratch(pos) {
    const revealedCard = document.getElementById('revealedDateCard');
    if (revealedCard && revealedCard.classList.contains('opacity-0')) {
      revealedCard.classList.remove('opacity-0');
      revealedCard.classList.add('opacity-100');
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2, false);
    ctx.fill();

    scratchPointsCount++;
    if (scratchPointsCount >= 6) {
      revealCard();
      return;
    }

    checkScratchPercent();
  }

  function checkScratchPercent() {
    if (isRevealed) return;
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      let clearPixels = 0;
      const totalPixels = data.length / 4;

      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) clearPixels += 4;
      }

      if (clearPixels / totalPixels > 0.15) {
        revealCard();
      }
    } catch (e) {
      if (scratchPointsCount >= 4) {
        revealCard();
      }
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    scratch(getPosition(e));
  });

  window.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    scratch(getPosition(e));
  });

  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    scratch(getPosition(e));
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    isDrawing = false;
    if (scratchPointsCount >= 3) {
      revealCard();
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    scratch(getPosition(e));
  }, { passive: true });

  canvas.addEventListener('click', () => {
    scratchPointsCount += 3;
    if (scratchPointsCount >= 3) {
      revealCard();
    }
  });
}

/* ===================================================================
   4. FLOATING AUDIO CONTROLLER
   =================================================================== */
function initAudioController() {
  const audio = document.getElementById('weddingAudio');
  const btn = document.getElementById('musicToggleBtn');
  if (!audio || !btn) return;

  const iconWrapper = btn.querySelector('.music-icon-wrapper');

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        if (iconWrapper) iconWrapper.innerHTML = '<i class="fa-solid fa-pause"></i>';
        showToast('Music Playing 🎵');
      }).catch(err => {
        console.log('Audio play blocked:', err);
      });
    } else {
      audio.pause();
      if (iconWrapper) iconWrapper.innerHTML = '<i class="fa-solid fa-play"></i>';
      showToast('Music Paused ⏸️');
    }
  });

  audio.addEventListener('play', () => {
    if (iconWrapper) iconWrapper.innerHTML = '<i class="fa-solid fa-pause"></i>';
  });

  audio.addEventListener('pause', () => {
    if (iconWrapper) iconWrapper.innerHTML = '<i class="fa-solid fa-play"></i>';
  });
}

/* ===================================================================
   5. RSVP MODAL & WHATSAPP GENERATOR
   =================================================================== */
function initRsvpModal() {
  const modal = document.getElementById('rsvpModal');
  const openFloatingBtn = document.getElementById('floatingRsvpBtn');
  const openCardBtn = document.getElementById('cardRsvpTriggerBtn');
  const openSectionBtn = document.getElementById('openRsvpBtn');
  const closeBtn = document.getElementById('closeRsvpModalBtn');
  const form = document.getElementById('rsvpForm');

  function openModal() {
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100', 'pointer-events-auto');
  }

  if (openFloatingBtn) openFloatingBtn.addEventListener('click', openModal);
  if (openCardBtn) openCardBtn.addEventListener('click', openModal);
  if (openSectionBtn) openSectionBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestName = document.getElementById('rsvpGuestName').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Yes, Joyfully!';
      const guestCount = document.getElementById('rsvpGuestCount')?.value || '2';
      
      const eventCheckboxes = document.querySelectorAll('input[name="rsvpEvents"]:checked');
      const selectedEvents = Array.from(eventCheckboxes).map(cb => cb.value).join(', ');

      // Trigger Celebration Confetti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Format WhatsApp Message
      const message = `*Wedding RSVP — Anchal & Arpit*%0A` +
        `━━━━━━━━━━━━━━━━━━%0A` +
        `*Guest Name:* ${encodeURIComponent(guestName)}%0A` +
        `*Status:* ${encodeURIComponent(attendance)}%0A` +
        `*No. of Guests:* ${encodeURIComponent(guestCount)}%0A` +
        `*Events Attending:* ${encodeURIComponent(selectedEvents || 'All Events')}%0A` +
        `━━━━━━━━━━━━━━━━━━%0A` +
        `_Looking forward to celebrating together at Gloria Inn, Bhilwara!_`;

      const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
      
      showToast('Thank you! Redirecting to WhatsApp...');
      closeModal();

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);
    });
  }
}

/* ===================================================================
   6. COUNTDOWN TIMER (TARGET: 11 DEC 2026, 07:00 AM)
   =================================================================== */
function initCountdown() {
  const targetDate = new Date('2026-12-11T07:00:00+05:30').getTime();

  const elDays = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMinutes = document.getElementById('cdMinutes');
  const elSeconds = document.getElementById('cdSeconds');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    elDays.textContent = String(days).padStart(2, '0');
    elHours.textContent = String(hours).padStart(2, '0');
    elMinutes.textContent = String(minutes).padStart(2, '0');
    elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ===================================================================
   7. SCROLL BUTTONS
   =================================================================== */
function initScrollButtons() {
  const btn = document.getElementById('scrollToScratchBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      const section = document.getElementById('scratch-card') || document.getElementById('welcome');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ===================================================================
   8. SOCIAL SHARING & COPY LINK
   =================================================================== */
function initSocialShare() {
  const waBtn = document.getElementById('whatsappShareBtn');
  const copyBtn = document.getElementById('copyInviteLinkBtn');

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const text = `🌸 *Wedding Invitation: Anchal & Arpit* 🌸%0A%0AWe cordially invite you to celebrate with us on 11th & 12th December 2026 at Gloria Inn, Bhilwara.%0A%0AView the invitation card here:%0A${window.location.href}`;
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Invitation link copied to clipboard! 📋');
      }).catch(() => {
        showToast('Link copied!');
      });
    });
  }
}

/* ===================================================================
   TOAST HELPER
   =================================================================== */
function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
