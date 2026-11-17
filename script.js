/**
 * RODEL PORTFOLIO ENGINE
 * Highly optimized, responsive, user-friendly interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  /* ==========================================================================
     1. AUDIO SYSTEM (Web Audio API Synthesizer - Zero External Assets)
     ========================================================================== */
  let soundEnabled = false; // respectful default: muted until toggled or requested
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playUiTone(frequency = 600, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported
    }
  }

  const soundToggleBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        initAudio();
        soundToggleBtn.classList.add('active');
        soundToggleBtn.setAttribute('title', 'Sound Effects: ON');
        playUiTone(880, 'sine', 0.1, 0.06);
        showToast('UI Sound Effects: Enabled', 'volume-2');
      } else {
        soundToggleBtn.classList.remove('active');
        soundToggleBtn.setAttribute('title', 'Sound Effects: OFF');
        showToast('UI Sound Effects: Muted', 'volume-x');
      }
      if (window.lucide) {
        soundIcon.setAttribute('data-lucide', soundEnabled ? 'volume-2' : 'volume-x');
        lucide.createIcons();
      }
    });
  }

  /* ==========================================================================
     2. THEME & ACCENT COLOR SYSTEM
     ========================================================================== */
  const savedAccent = localStorage.getItem('rodel_accent') || 'cyan';
  document.documentElement.setAttribute('data-accent', savedAccent);

  const accentMenuBtn = document.getElementById('accentMenuBtn');
  const accentDropdown = document.getElementById('accentDropdown');
  const accentDots = document.querySelectorAll('.accent-dot');

  // Update active dot in dropdown
  function updateActiveAccentDot(accentName) {
    accentDots.forEach(dot => {
      if (dot.getAttribute('data-accent-color') === accentName) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  updateActiveAccentDot(savedAccent);

  if (accentMenuBtn && accentDropdown) {
    accentMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      accentDropdown.classList.toggle('show');
      playUiTone(450, 'triangle', 0.06);
    });

    document.addEventListener('click', (e) => {
      if (!accentMenuBtn.contains(e.target) && !accentDropdown.contains(e.target)) {
        accentDropdown.classList.remove('show');
      }
    });
  }

  accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const color = dot.getAttribute('data-accent-color');
      document.documentElement.setAttribute('data-accent', color);
      localStorage.setItem('rodel_accent', color);
      updateActiveAccentDot(color);
      accentDropdown.classList.remove('show');
      playUiTone(680, 'sine', 0.09);
      showToast(`Accent theme updated: ${color.toUpperCase()}`, 'palette');
    });
  });

  /* ==========================================================================
     3. INTERACTIVE BACKGROUND CANVAS (Constellation / Network Particles)
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 70;
    const maxDistance = 130;

    let mousePos = { x: null, y: null, radius: 120 };

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mousePos.x = null;
      mousePos.y = null;
    });

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.4 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mousePos.x !== null) {
          const dx = mousePos.x - this.x;
          const dy = mousePos.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mousePos.radius) {
            const force = (mousePos.radius - dist) / mousePos.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(180, 210, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================================
     4. CURSOR SPOTLIGHT TRACKING
     ========================================================================== */
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');

  if (cursorGlow && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    cursorGlow.style.opacity = '1';
    cursorDot.style.opacity = '1';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function smoothCursor() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      requestAnimationFrame(smoothCursor);
    }
    smoothCursor();
  }

  /* ==========================================================================
     5. NAVBAR & SCROLL-SPY NAVIGATION MENU
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Navbar glass elevation
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        if (link.getAttribute('data-nav') === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });

  // Mobile Drawer Menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-contact-btn');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
    playUiTone(500, 'sine', 0.07);
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('show');
    document.body.style.overflow = '';
    playUiTone(350, 'sine', 0.05);
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  /* ==========================================================================
     6. TYPEWRITER EFFECT
     ========================================================================== */
  const typewriterText = document.getElementById('typewriterText');
  if (typewriterText) {
    const roles = [
      'scalable cloud architectures.',
      'high-throughput distributed APIs.',
      'resilient enterprise systems.',
      'cutting-edge web experiences.',
      'zero-downtime microservices.'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typewriterText.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 35;
      } else {
        typewriterText.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 75;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        typingSpeed = 2200; // Pause when finished word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 400; // Pause before typing new word
      }

      setTimeout(typeLoop, typingSpeed);
    }
    typeLoop();
  }

  /* ==========================================================================
     7. ANIMATED METRICS COUNTERS
     ========================================================================== */
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  function runMetricCounters() {
    metricNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      let count = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          el.textContent = target;
          clearInterval(interval);
        } else {
          el.textContent = count;
        }
      }, 35);
    });
  }

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !metricsAnimated) {
      metricsAnimated = true;
      runMetricCounters();
    }
  }, { threshold: 0.25 });

  const heroMetricsEl = document.querySelector('.hero-metrics');
  if (heroMetricsEl) {
    heroObserver.observe(heroMetricsEl);
  }

  /* ==========================================================================
     8. SKILLS CATEGORY FILTER
     ========================================================================== */
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      playUiTone(550, 'sine', 0.05);

      const category = tab.getAttribute('data-category');

      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* ==========================================================================
     9. PROJECTS FILTER
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playUiTone(600, 'sine', 0.05);

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* ==========================================================================
     10. PROJECT CASE STUDY DETAIL MODAL
     ========================================================================== */
  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const projectModalContent = document.getElementById('projectModalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const viewDetailBtns = document.querySelectorAll('.view-details-btn');

  // Detailed Project Case Studies Data
  const projectsData = {
    "1": {
      title: "CloudMesh OS | Multi-Cloud Observability Engine",
      tag: "Distributed Infrastructure & Microservices",
      overview: "An enterprise telemetry engine designed to consolidate trace, metric, and log data across 10,000+ Kubernetes pods and hybrid cloud providers into a unified sub-second dashboard.",
      challenge: "Processing over 128,000 incoming telemetry events per second caused indexing bottlenecks and expensive query timeouts in conventional document stores.",
      solution: "Engineered an ingestion pipeline in Golang using Apache Kafka buffers and ClickHouse columnar storage, paired with Next.js 15 Server Components and WebSockets for real-time visualization.",
      metrics: [
        { label: "Throughput", val: "128k req/sec" },
        { label: "Query Latency", val: "4.2ms avg" },
        { label: "Cost Reduction", val: "42% AWS save" }
      ],
      techStack: ["Golang", "Kafka", "ClickHouse", "Next.js 15", "Kubernetes", "Prometheus", "TypeScript"]
    },
    "2": {
      title: "Synthex AI | Enterprise Codebase Copilot",
      tag: "AI Architecture & Developer Tooling",
      overview: "Autonomous code comprehension agent that digests proprietary multi-repo codebases, indexes semantic AST vectors, and drafts production-ready pull requests.",
      challenge: "Large legacy repositories with thousands of cross-referenced dependencies exceeded standard LLM context windows and suffered from hallucinations.",
      solution: "Implemented hierarchical chunking and hybrid dense/sparse vector retrieval with Qdrant, accompanied by automated AST verification checks before output generation.",
      metrics: [
        { label: "Review Time", val: "68% faster" },
        { label: "Accuracy", val: "97.4% syntax" },
        { label: "Daily PRs Scanned", val: "450+ PRs" }
      ],
      techStack: ["Python", "FastAPI", "Qdrant Vector DB", "LangChain", "React", "Docker", "Git Hooks"]
    },
    "3": {
      title: "Nexus Pay | Global Payment Ledger & Checkout",
      tag: "Fintech Systems & High-Security Ledger",
      overview: "Fault-tolerant multi-currency transaction engine handling international merchant checkouts, automated reconciliation, and fraud anomaly detection.",
      challenge: "Guaranteeing strict zero double-spending guarantees across globally distributed nodes with unpredictable network latency.",
      solution: "Architected a double-entry ledger backed by PostgreSQL with serializable transaction isolation, combined with distributed Redis locking and cryptographic audit trails.",
      metrics: [
        { label: "Transaction Vol", val: "$2.8M+ / day" },
        { label: "Fraud Catch Rate", val: "99.8%" },
        { label: "Ledger Uptime", val: "99.999%" }
      ],
      techStack: ["Node.js", "TypeScript", "PostgreSQL", "Redis Locks", "Stripe API", "AWS KMS", "Docker"]
    },
    "4": {
      title: "VoxelSpace | Interactive Spatial 3D Editor",
      tag: "WebGL, Shaders & Creative Computing",
      overview: "In-browser 3D digital scene builder, shader playground, and architectural prototype studio running directly on WebGL 2.0 with zero plugin overhead.",
      challenge: "Maintaining a continuous 60 FPS frame rate on low-power mobile devices while rendering dynamic shadows and thousands of textured geometry instances.",
      solution: "Built custom instanced mesh renderers in Three.js and custom GLSL vertex shaders, offloading transform calculations to the GPU.",
      metrics: [
        { label: "Render Frame Rate", val: "60 FPS solid" },
        { label: "Bundle Size", val: "< 180kb gzip" },
        { label: "Mobile Stability", val: "100% crash-free" }
      ],
      techStack: ["Three.js", "GLSL Shaders", "WebAudio API", "Tailwind CSS", "Vite", "Canvas API"]
    },
    "5": {
      title: "DevPulse | Multiplayer Infinite Canvas",
      tag: "Realtime Collaboration & State Sync",
      overview: "Distributed whiteboard diagramming canvas where thousands of users can simultaneously draft architecture schemas with live presence cursors.",
      challenge: "Eliminating conflicting user edits during concurrent updates without losing data or causing visual flicker.",
      solution: "Utilized Yjs CRDTs (Conflict-free Replicated Data Types) synchronized over fault-tolerant WebSocket clusters with automatic reconnect fallback.",
      metrics: [
        { label: "Sync Latency", val: "< 25ms global" },
        { label: "Concurrent Users", val: "500 per board" },
        { label: "Conflict Rate", val: "0.00% errors" }
      ],
      techStack: ["React", "Yjs / CRDTs", "WebSockets", "Node.js", "HTML5 Canvas", "Tailwind"]
    },
    "6": {
      title: "Aether CLI | Edge Infrastructure Automator",
      tag: "CLI Tools & DevOps Automation",
      overview: "Lightweight command-line utility for provisioning multi-region cloud infrastructures, generating preview environments, and managing secrets.",
      challenge: "Complex multi-step Terraform scripts often failed due to inconsistent local environment dependencies and mismatched CLI versions.",
      solution: "Packaged self-contained Golang and Rust binaries that bundle cloud provider APIs, automatic schema linting, and 1-click rollback mechanisms.",
      metrics: [
        { label: "Deploy Speed", val: "840ms edge" },
        { label: "Binary Footprint", val: "12MB native" },
        { label: "Global Installs", val: "15k+ devs" }
      ],
      techStack: ["Golang", "Rust", "Terraform", "Docker", "GitHub Actions", "Cobra CLI"]
    }
  };

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    projectModalContent.innerHTML = `
      <div class="modal-header-section">
        <span class="modal-tag-pill">${data.tag}</span>
        <h2 class="modal-project-title">${data.title}</h2>
        <p class="modal-body-p">${data.overview}</p>
      </div>

      <div class="modal-metrics-grid">
        ${data.metrics.map(m => `
          <div class="modal-metric-box">
            <strong>${m.val}</strong>
            <span>${m.label}</span>
          </div>
        `).join('')}
      </div>

      <h3 class="modal-section-h"><i data-lucide="alert-triangle"></i> The Technical Challenge</h3>
      <p class="modal-body-p">${data.challenge}</p>

      <h3 class="modal-section-h"><i data-lucide="check-circle-2"></i> The Engineering Solution</h3>
      <p class="modal-body-p">${data.solution}</p>

      <h3 class="modal-section-h"><i data-lucide="layers"></i> Technologies Leveraged</h3>
      <div class="project-tags">
        ${data.techStack.map(t => `<span>${t}</span>`).join('')}
      </div>

      <div class="modal-action-footer">
        <a href="#contact" class="btn btn-primary btn-sm modal-discuss-btn">
          <i data-lucide="message-square"></i> Inquire About Similar Solutions
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <i data-lucide="github"></i> View Architecture On GitHub
        </a>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }

    projectModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    playUiTone(620, 'sine', 0.08);

    const discussBtn = projectModalContent.querySelector('.modal-discuss-btn');
    if (discussBtn) {
      discussBtn.addEventListener('click', () => {
        closeProjectModal();
      });
    }
  }

  function closeProjectModal() {
    projectModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    playUiTone(380, 'sine', 0.06);
  }

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project-id');
      openProjectModal(id);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', (e) => {
      if (e.target === projectModalBackdrop) {
        closeProjectModal();
      }
    });
  }

  // Live Demo Preview Button Toast
  const demoPreviewBtns = document.querySelectorAll('.demo-preview-btn');
  demoPreviewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projName = btn.getAttribute('data-project-name');
      showToast(`Launching ${projName} live sandbox environment...`, 'external-link');
      playUiTone(750, 'sine', 0.08);
    });
  });

  /* ==========================================================================
     11. COMMAND PALETTE (Ctrl + K / Search Modal)
     ========================================================================== */
  const cmdTriggerBtn = document.getElementById('cmdTriggerBtn');
  const cmdPaletteBackdrop = document.getElementById('cmdPaletteBackdrop');
  const cmdPaletteInput = document.getElementById('cmdPaletteInput');
  const cmdPaletteResults = document.getElementById('cmdPaletteResults');
  const cmdItems = document.querySelectorAll('.cmd-item');

  function openCommandPalette() {
    cmdPaletteBackdrop.classList.add('open');
    cmdPaletteInput.value = '';
    filterCommandItems('');
    setTimeout(() => cmdPaletteInput.focus(), 60);
    playUiTone(700, 'triangle', 0.07);
  }

  function closeCommandPalette() {
    cmdPaletteBackdrop.classList.remove('open');
    playUiTone(360, 'sine', 0.05);
  }

  if (cmdTriggerBtn) {
    cmdTriggerBtn.addEventListener('click', openCommandPalette);
  }

  if (cmdPaletteBackdrop) {
    cmdPaletteBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdPaletteBackdrop) {
        closeCommandPalette();
      }
    });
  }

  // Keyboard shortcut Ctrl+K or Cmd+K & Escape
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPaletteBackdrop.classList.contains('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === 'Escape') {
      if (cmdPaletteBackdrop.classList.contains('open')) {
        closeCommandPalette();
      }
      if (projectModalBackdrop.classList.contains('open')) {
        closeProjectModal();
      }
    }
  });

  function filterCommandItems(query) {
    const q = query.toLowerCase().trim();
    cmdItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (cmdPaletteInput) {
    cmdPaletteInput.addEventListener('input', (e) => {
      filterCommandItems(e.target.value);
    });
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closeCommandPalette();

      if (action === 'nav') {
        const target = item.getAttribute('data-target');
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (action === 'copy-email') {
        copyToClipboard('rodel.engineer@gmail.com', 'Email copied to clipboard!');
      } else if (action === 'download-cv') {
        triggerResumeDownload();
      } else if (action === 'toggle-sound') {
        soundToggleBtn.click();
      } else if (action === 'theme') {
        const theme = item.getAttribute('data-theme-val');
        document.documentElement.setAttribute('data-accent', theme);
        localStorage.setItem('rodel_accent', theme);
        updateActiveAccentDot(theme);
        showToast(`Accent theme updated: ${theme.toUpperCase()}`, 'palette');
      }
    });
  });

  /* ==========================================================================
     12. INTERACTIVE TERMINAL EMULATOR
     ========================================================================== */
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const termSendBtn = document.getElementById('termSendBtn');
  const termClearBtn = document.getElementById('termClearBtn');
  const termHelpBtn = document.getElementById('termHelpBtn');
  const quickCmdChips = document.querySelectorAll('.quick-cmd-chip');

  const termCommands = {
    help: () => `
      <div class="output-system">
        <span class="t-cyan font-bold">AVAILABLE COMMANDS:</span><br>
        &nbsp;&nbsp;<strong>help</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Show this command catalog<br>
        &nbsp;&nbsp;<strong>skills</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Output core technical competencies<br>
        &nbsp;&nbsp;<strong>projects</strong> &nbsp;&nbsp;&nbsp;&nbsp;- List flagship production systems<br>
        &nbsp;&nbsp;<strong>experience</strong> &nbsp;&nbsp;- Output career leadership history<br>
        &nbsp;&nbsp;<strong>contact</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Display contact channels & availability<br>
        &nbsp;&nbsp;<strong>theme &lt;name&gt;</strong> &nbsp;- Change theme (cyan, purple, emerald, amber, rose)<br>
        &nbsp;&nbsp;<strong>clear</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear screen buffer<br>
        &nbsp;&nbsp;<strong>whoami</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Current visitor credentials<br>
        &nbsp;&nbsp;<strong>uptime</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Show system uptime & health<br>
        &nbsp;&nbsp;<strong>sudo hire</strong> &nbsp;&nbsp;&nbsp;- Instant offer protocol trigger<br>
      </div>
    `,
    skills: () => `
      <div class="output-system">
        <span class="t-green">✔ FRONTEND:</span> React, Next.js 15, TypeScript, Tailwind CSS, Vue.js, Three.js<br>
        <span class="t-green">✔ BACKEND:</span> Node.js, Golang, Python, FastAPI, Express, GraphQL, gRPC<br>
        <span class="t-green">✔ DATA:</span> PostgreSQL, Redis, ClickHouse, MongoDB, Prisma<br>
        <span class="t-green">✔ CLOUD/OPS:</span> AWS, Docker, Kubernetes, CI/CD, Kafka, Terraform
      </div>
    `,
    projects: () => `
      <div class="output-system">
        <span class="t-cyan font-bold">RECENT PRODUCTION SYSTEMS:</span><br>
        1. <strong>CloudMesh OS</strong> - Multi-cloud observability engine (128k req/s)<br>
        2. <strong>Synthex AI</strong> - Enterprise vector code review copilot<br>
        3. <strong>Nexus Pay</strong> - Fault-tolerant international payment ledger<br>
        4. <strong>VoxelSpace</strong> - 60 FPS in-browser 3D WebGL scene builder<br>
        5. <strong>DevPulse</strong> - Multiplayer CRDT collaborative canvas<br>
        6. <strong>Aether CLI</strong> - Instant edge infrastructure deployment tool
      </div>
    `,
    experience: () => `
      <div class="output-system">
        <strong>Lead Software Architect</strong> @ Aura Systems (2023 - Present)<br>
        <strong>Senior Full-Stack Engineer</strong> @ Quantix Labs (2021 - 2023)<br>
        <strong>Software Engineer</strong> @ Vortex Innovations (2019 - 2021)
      </div>
    `,
    contact: () => `
      <div class="output-system">
        <span class="t-green">● STATUS:</span> AVAILABLE FOR ENGAGEMENTS<br>
        <span class="t-cyan">● EMAIL:</span> <a href="mailto:rodel.engineer@gmail.com" style="color:var(--accent);">rodel.engineer@gmail.com</a><br>
        <span class="t-cyan">● GITHUB:</span> https://github.com<br>
        <span class="t-cyan">● LINKEDIN:</span> https://linkedin.com
      </div>
    `,
    whoami: () => `
      <div class="output-system">
        guest@rodel-portfolio [Permissions: READ_ONLY | INVITATION_TO_COLLABORATE: GRANTED]
      </div>
    `,
    uptime: () => `
      <div class="output-system">
        rodel-os up 6 years, 142 days, 100% test coverage, 0 fatal crashes.
      </div>
    `,
    'sudo hire': () => `
      <div class="output-system" style="color: var(--accent);">
        🚀 [PERMISSION GRANTED]: Initiating priority hiring channel...<br>
        Redirecting you to the contact terminal. Let's build something phenomenal together!
      </div>
    `
  };

  function executeTerminalCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    playUiTone(620, 'sine', 0.04);

    // Print User Line
    const userLine = document.createElement('div');
    userLine.className = 'term-line output-user';
    userLine.innerHTML = `<span class="term-prompt">rodel@os:~$</span> ${escapeHtml(cmd)}`;
    terminalOutput.appendChild(userLine);

    const lowerCmd = cmd.toLowerCase();

    // Check clear
    if (lowerCmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    // Check theme command: e.g. "theme purple"
    if (lowerCmd.startsWith('theme ')) {
      const color = lowerCmd.split(' ')[1];
      const valid = ['cyan', 'purple', 'emerald', 'amber', 'rose'];
      if (valid.includes(color)) {
        document.documentElement.setAttribute('data-accent', color);
        localStorage.setItem('rodel_accent', color);
        updateActiveAccentDot(color);
        printTermOutput(`<span class="t-green">✔ Theme successfully switched to ${color.toUpperCase()}.</span>`);
        showToast(`Terminal updated theme: ${color.toUpperCase()}`, 'palette');
      } else {
        printTermOutput(`<span class="output-error">Theme "${color}" unknown. Valid choices: ${valid.join(', ')}</span>`);
      }
      scrollTerminal();
      return;
    }

    // Check predefined commands
    if (termCommands[lowerCmd]) {
      printTermOutput(termCommands[lowerCmd]());
      if (lowerCmd === 'sudo hire') {
        setTimeout(() => {
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, 1200);
      }
    } else {
      printTermOutput(`<span class="output-error">zsh: command not found: ${escapeHtml(cmd)}. Type 'help' for valid commands.</span>`);
    }

    scrollTerminal();
  }

  function printTermOutput(html) {
    const responseLine = document.createElement('div');
    responseLine.className = 'term-line';
    responseLine.innerHTML = html;
    terminalOutput.appendChild(responseLine);
  }

  function scrollTerminal() {
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeTerminalCommand(terminalInput.value);
        terminalInput.value = '';
      }
    });
  }

  if (termSendBtn) {
    termSendBtn.addEventListener('click', () => {
      executeTerminalCommand(terminalInput.value);
      terminalInput.value = '';
    });
  }

  if (termClearBtn) {
    termClearBtn.addEventListener('click', () => {
      terminalOutput.innerHTML = '';
      playUiTone(400, 'sine', 0.05);
    });
  }

  if (termHelpBtn) {
    termHelpBtn.addEventListener('click', () => {
      executeTerminalCommand('help');
    });
  }

  quickCmdChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeTerminalCommand(cmd);
    });
  });

  /* ==========================================================================
     13. CONTACT FORM VALIDATION & TRANSMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formName = document.getElementById('formName');
  const formEmail = document.getElementById('formEmail');
  const formMessage = document.getElementById('formMessage');
  const submitFormBtn = document.getElementById('submitFormBtn');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';

      if (!formName.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      if (!formEmail.value.trim()) {
        emailError.textContent = 'Please provide an email address.';
        isValid = false;
      } else if (!validateEmail(formEmail.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!formMessage.value.trim()) {
        messageError.textContent = 'Please write a brief description of your message.';
        isValid = false;
      } else if (formMessage.value.trim().length < 10) {
        messageError.textContent = 'Message should be at least 10 characters.';
        isValid = false;
      }

      if (!isValid) {
        playUiTone(280, 'sawtooth', 0.1, 0.07);
        return;
      }

      // Transmission simulation
      playUiTone(880, 'sine', 0.1);
      submitFormBtn.disabled = true;
      submitFormBtn.innerHTML = `
        <span class="btn-text">Transmitting Securely...</span>
        <i data-lucide="loader-2" class="spin"></i>
      `;
      if (window.lucide) lucide.createIcons();

      setTimeout(() => {
        submitFormBtn.disabled = false;
        submitFormBtn.innerHTML = `
          <span class="btn-text">Message Transmitted</span>
          <i data-lucide="check"></i>
        `;
        if (window.lucide) lucide.createIcons();

        showToast('Thank you! Your message was transmitted. Rodel will reply shortly.', 'check-circle-2');
        contactForm.reset();
        playUiTone(1050, 'sine', 0.15);

        setTimeout(() => {
          submitFormBtn.innerHTML = `
            <span class="btn-text">Transmit Message</span>
            <i data-lucide="send" class="btn-icon"></i>
          `;
          if (window.lucide) lucide.createIcons();
        }, 3500);
      }, 1400);
    });
  }

  /* ==========================================================================
     14. CLIPBOARD & RESUME UTILITIES
     ========================================================================== */
  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg, 'copy');
        playUiTone(800, 'sine', 0.08);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(successMsg, 'copy');
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email');
      copyToClipboard(email, 'Email address copied to clipboard!');
    });
  }

  function triggerResumeDownload() {
    showToast('Preparing Rodel_Senior_Engineer_CV.pdf...', 'download');
    playUiTone(720, 'sine', 0.09);
    setTimeout(() => {
      // Create simulated PDF download
      const blob = new Blob([
        `RODEL - SENIOR FULL-STACK SOFTWARE ARCHITECT\n` +
        `Email: rodel.engineer@gmail.com\n` +
        `Status: Open to Full-Time & High-Impact Contracts\n\n` +
        `CORE COMPETENCIES:\n` +
        `- Frontend: React, Next.js 15, TypeScript, Tailwind CSS, Vue.js\n` +
        `- Backend: Golang, Node.js, Python, FastAPI, Microservices, gRPC, REST\n` +
        `- Cloud & Ops: AWS, Kubernetes, Docker, CI/CD, Kafka, Redis, PostgreSQL\n\n` +
        `EXPERIENCE HIGHLIGHTS:\n` +
        `1. Aura Systems Inc. - Lead Software Architect (2023 - Present)\n` +
        `2. Quantix Digital Labs - Senior Full-Stack Engineer (2021 - 2023)\n` +
        `3. Vortex Innovations - Software Engineer (2019 - 2021)\n\n` +
        `Full Portfolio & Live Demos available at: index.html\n`
      ], { type: 'text/plain;charset=utf-8' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Rodel_Software_Engineer_CV.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CV downloaded successfully!', 'check');
    }, 600);
  }

  const downloadResumeBtn = document.getElementById('downloadResumeBtn');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', triggerResumeDownload);
  }

  /* ==========================================================================
     15. LIVE LOCAL CLOCK & FOOTER YEAR
     ========================================================================== */
  const liveLocalClock = document.getElementById('liveLocalClock');
  function updateClock() {
    if (liveLocalClock) {
      const now = new Date();
      liveLocalClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (Your Time)';
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     16. TOAST NOTIFICATION HELPER
     ========================================================================== */
  function showToast(message, iconName = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="${iconName}" class="toast-icon"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    if (window.lucide) {
      lucide.createIcons();
    }

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 3800);
  }

  window.showToast = showToast;
});
