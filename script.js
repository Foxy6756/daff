let isOpen = false;
let isSoundOn = false;

const bouquet = document.getElementById('bouquetElement');
const toggleBtn = document.getElementById('toggleBouquetBtn');
const btnText = document.getElementById('btnText');
const flowerIconBtn = document.getElementById('flowerIconBtn');
const dedicationCard = document.getElementById('dedicationCard');
const cardMessage = document.getElementById('cardMessage');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundLabel = document.getElementById('soundLabel');
const soundIconOn = document.getElementById('soundIconOn');
const soundIconOff = document.getElementById('soundIconOff');
const audioElement = document.getElementById('bgMusic');
const photoLightbox = document.getElementById('photoLightbox');
const photoTitle = document.getElementById('lightboxTitle');
const photoText = document.getElementById('lightboxText');
const photoImage = document.getElementById('lightboxImage');
const photoStarsLayer = document.getElementById('photoStars');
const photoCloseBtn = document.querySelector('.photo-close');

const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const maxParticles = 65;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Petal {
  constructor(isInitialBurst = false) {
    this.reset(isInitialBurst);
  }

  reset(isInitialBurst = false) {
    this.type = Math.random() < 0.28 ? 'miniFlower' : 'petal';
    this.x = Math.random() * canvas.width;
    this.y = isInitialBurst ? Math.random() * canvas.height * 0.75 : -40 - Math.random() * 50;
    this.size = this.type === 'miniFlower' ? 9 + Math.random() * 8 : 11 + Math.random() * 12;
    this.speedY = 1.2 + Math.random() * 2.2;
    this.speedX = (Math.random() - 0.42) * 1.6;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.04;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.02 + Math.random() * 0.035;
    this.opacity = 0.65 + Math.random() * 0.35;
    this.colorHue = 42 + Math.random() * 12;
  }

  update() {
    this.y += this.speedY;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 1.25 + this.speedX;
    this.rotation += this.rotationSpeed;

    if (this.y > canvas.height + 40) {
      if (isOpen) {
        this.reset(false);
      } else {
        this.opacity -= 0.015;
      }
    }
  }

  draw() {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.opacity);

    if (this.type === 'miniFlower') {
      ctx.fillStyle = `hsl(${this.colorHue}, 98%, 56%)`;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(0, -this.size * 0.55, this.size * 0.35, this.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate((Math.PI * 2) / 5);
      }
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = '#5d4037';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.3, this.size * 0.4, this.size);
      ctx.quadraticCurveTo(0, this.size * 1.2, -this.size * 0.4, this.size);
      ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.3, 0, -this.size);

      const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
      grad.addColorStop(0, `hsl(${this.colorHue + 6}, 100%, 75%)`);
      grad.addColorStop(0.6, `hsl(${this.colorHue}, 96%, 52%)`);
      grad.addColorStop(1, `hsl(${this.colorHue - 10}, 90%, 42%)`);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.8);
      ctx.lineTo(0, this.size * 0.7);
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (particles.length > 0) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (!isOpen && p.opacity <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

function startPetalRain() {
  particles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Petal(true));
  }
}

function updateSoundButton() {
  isSoundOn = true;
  soundIconOn.classList.remove('hidden');
  soundIconOff.classList.add('hidden');
  soundLabel.textContent = 'Melodía: Sonando';
}

function stopSong() {
  isSoundOn = false;
  soundIconOn.classList.add('hidden');
  soundIconOff.classList.remove('hidden');
  soundLabel.textContent = 'Melodía: Desactivada';
  audioElement.pause();
}

function playSong() {
  audioElement.play()
    .then(updateSoundButton)
    .catch(() => {
      console.log('La reproducción tiene que iniciarse con una interacción del usuario.');
    });
}

soundToggleBtn.addEventListener('click', () => {
  if (isSoundOn) {
    stopSong();
  } else {
    playSong();
  }
});

function openBouquet() {
  isOpen = true;
  bouquet.classList.remove('bouquet-closed');
  bouquet.classList.add('bouquet-open');

  btnText.textContent = 'Cerrar Ramo';
  flowerIconBtn.style.transform = 'rotate(180deg)';
  startPetalRain();

  dedicationCard.classList.remove('hidden');
  setTimeout(() => {
    dedicationCard.classList.remove('opacity-0', 'translate-y-6', 'scale-95', 'pointer-events-none');
    dedicationCard.classList.add('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
  }, 400);

  playSong();
}

function closeBouquet() {
  isOpen = false;
  bouquet.classList.remove('bouquet-open');
  bouquet.classList.add('bouquet-closed');

  btnText.textContent = 'Abrir Ramo & Florecer';
  flowerIconBtn.style.transform = 'rotate(0deg)';

  dedicationCard.classList.add('opacity-0', 'translate-y-6', 'scale-95', 'pointer-events-none');
  dedicationCard.classList.remove('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
  setTimeout(() => {
    if (!isOpen) dedicationCard.classList.add('hidden');
  }, 700);

  audioElement.pause();
  audioElement.currentTime = 0;
  stopSong();
}

toggleBtn.addEventListener('click', () => {
  if (!isOpen) {
    openBouquet();
  } else {
    closeBouquet();
  }
});

function createStarRain() {
  photoStarsLayer.innerHTML = '';

  for (let i = 0; i < 50; i++) {
    const star = document.createElement('span');
    star.className = 'star-particle';
    const left = Math.random() * 100;
    const delay = Math.random() * 1.5;
    const duration = 1.2 + Math.random() * 2.4;
    const drift = (Math.random() * 120 - 60).toFixed(2);

    star.style.left = `${left}%`;
    star.style.animationDelay = `${delay}s`;
    star.style.animationDuration = `${duration}s`;
    star.style.setProperty('--drift', `${drift}px`);
    star.style.width = `${2 + Math.random() * 5}px`;
    star.style.height = star.style.width;
    photoStarsLayer.appendChild(star);
  }
}

function openPhotoLightbox(imageSrc, title, text) {
  photoImage.src = imageSrc;
  photoTitle.textContent = title;
  photoText.textContent = text;
  createStarRain();
  photoLightbox.classList.add('active');
  photoLightbox.setAttribute('aria-hidden', 'false');
}

function closePhotoLightbox() {
  photoLightbox.classList.remove('active');
  photoLightbox.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.gallery-card').forEach((card) => {
  card.addEventListener('click', () => {
    openPhotoLightbox(card.dataset.image, card.dataset.title, card.dataset.text);
  });
});

photoCloseBtn.addEventListener('click', closePhotoLightbox);
photoLightbox.addEventListener('click', (event) => {
  if (event.target.matches('.photo-overlay') || event.target === photoLightbox) {
    closePhotoLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && photoLightbox.classList.contains('active')) {
    closePhotoLightbox();
  }
});
