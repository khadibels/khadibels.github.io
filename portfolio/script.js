document.addEventListener('DOMContentLoaded', () => {
    /* =========================
       Preloader
    ========================== */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    });

    /* =========================
       Custom Cursor
    ========================== */
    const cursorDot = document.querySelector("#cursor-dot");
    const cursorOutline = document.querySelector("#cursor-outline");
    window.addEventListener("mousemove", (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards" });
    });
    document.querySelectorAll('.interactive').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
    let cursorVisible = false;
    document.body.addEventListener('mouseenter', () => {
        if (!cursorVisible) {
            cursorDot.style.opacity = 1;
            cursorOutline.style.opacity = 1;
            document.body.style.cursor = 'none';
            cursorVisible = true;
        }
    });
    document.body.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = 0;
        cursorOutline.style.opacity = 0;
        document.body.style.cursor = 'auto';
        cursorVisible = false;
    });

    /* =========================
       Theme Toggle
    ========================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    function applyTheme(theme) {
        html.classList.remove('light', 'dark');
        html.classList.add(theme);
        localStorage.setItem('theme', theme);

        const sunIcon = themeToggleBtn.querySelector('.fa-sun');
        const moonIcon = themeToggleBtn.querySelector('.fa-moon');

        if (theme === 'dark') {
            document.body.style.setProperty('--bg-color-rgb', '35, 41, 70');
            document.body.style.setProperty('--border-color-rgb', '62, 69, 102');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            document.body.style.setProperty('--bg-color-rgb', '248, 250, 252');
            document.body.style.setProperty('--border-color-rgb', '35, 41, 70');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    /* =========================
       Mobile Menu
    ========================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuToggle.querySelector('i');
    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            mobileMenu.classList.remove('open');
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = '';
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        } else {
            mobileMenu.classList.add('open');
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
            document.querySelectorAll('#mobile-menu a').forEach((link, index) => {
                link.style.transitionDelay = `${index * 100}ms`;
            });
        }
    };
    menuToggle.addEventListener('click', toggleMenu);
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* =========================
       Typing Effect (Hero)
    ========================== */
    const typingContainer = document.querySelector('.typing-container span');
    let typeInterval;
    let isTypingActive = false;
    const phrases = [
        "an aspiring Full-Stack Developer",
        "an IT enthusiast",
        "an aspiring Software Engineer"
    ];
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false;

    function type() {
        if (!isTypingActive) return;
        const currentPhrase = phrases[phraseIndex];
        let typeSpeed = isDeleting ? 70 : 120;
        if (isDeleting) {
            typingContainer.textContent = currentPhrase.substring(0, charIndex--);
        } else {
            typingContainer.textContent = currentPhrase.substring(0, charIndex++);
        }
        if (!isDeleting && charIndex === currentPhrase.length + 1) {
            isDeleting = true; typeSpeed = 1500;
        } else if (isDeleting && charIndex === -1) {
            isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        typeInterval = setTimeout(type, typeSpeed);
    }

    const heroSection = document.getElementById('home');
    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isTypingActive) {
                    isTypingActive = true;
                    type();
                }
            } else {
                isTypingActive = false;
                clearTimeout(typeInterval);
            }
        });
    }, { threshold: 0.1 });
    typingObserver.observe(heroSection);

    /* =========================
       Reveal Animations
    ========================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    /* =========================
       Active Nav on Scroll
    ========================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a.nav-link');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(section => sectionObserver.observe(section));

    /* =========================
       Parallax Shapes
    ========================== */
    const shapes = document.querySelectorAll('.shape');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        shapes.forEach((shape, i) => {
            const speed = (i % 2 === 0) ? 0.1 : 0.05;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    /* =========================
       Back to Top
    ========================== */
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
    });

    /* =========================
       Modals
    ========================== */
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalOverlay = button.closest('.modal-overlay');
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* =========================
       Chatbot (Persona-tuned)
    ========================== */
    const BOT = {
        name: "Nicole’s portfolio bot",
        nicknames: ["bestie", "friend"],
        persona: {
            fullName: "Nicole Malitao",
            pronouns: "she/her",
            vibes: ["playful", "sweet"],
            codeSwitch: false, // pure English
            jokesEnabled: true, // corny + wholesome
            catchphrases: [
                "We got this 💪",
                "let’s build it for real",
                "love that energy!",
                "sending good vibes ✨"
            ],
            funFacts: [
                "Sings and plays guitar",
                "Night owl who loves poems and songwriting",
                "Loves laughing and loves music so much",
                "A truly lovely human"
            ],
            highlights: {
                // Front and center
                skills: ["PHP", "MySQL", "Bootstrap", "JavaScript", "Chart.js", "GitHub Actions"],
                // Currently learning
                learning: ["Flutter", "React", "Node.js", "MongoDB"],
                contacts: {
                    emails: ["nicmalitao@gmail.com", "bbkhadi25@gmail.com"],
                    github: "khadibels"
                }
            },
            projects: [
                {
                    name: "WishFund",
                    oneLiner: "A sweet, minimalist gifting & wishlist web app with a clean, standard UI."
                },
                {
                    name: "TNVS Logistics",
                    oneLiner: "A multi-module logistics platform (Smart Warehousing, Procurement, Asset Lifecycle, Document Tracking, Project Logistics Tracker)."
                },
                {
                    name: "Figma Designer",
                    oneLiner: "Enjoys crafting UI concepts in Figma—still learning, but excited to design & iterate."
                }
            ]
        }
    };

    const SITE_SECTIONS = {
        projectsHref: "#works",
        skillsHref: "#skills",
        aboutHref: "#about",
        contactHref: "#contact"
    };

    // Elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    let lastBotQuestion = null;

    // Helpers
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const nowGreeting = () => {
        const h = new Date().getHours();
        if (h < 6) return "Late night vibes!";
        if (h < 12) return "Good morning!";
        if (h < 18) return "Good afternoon!";
        return "Good evening!";
    };
    const escapeHTML = (str) =>
        str.replaceAll('&', '&amp;')

    const addMessage = (message, sender, { html = false } = {}) => {
        const el = document.createElement('div');
        el.classList.add('chat-message', `${sender}-message`);
        if (html) el.innerHTML = message; else el.textContent = message;
        chatbotMessages.appendChild(el);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const typingOn = () => {
        addMessage(`<div class="typing-indicator"><span></span><span></span><span></span></div>`, 'bot', { html: true });
    };
    const typingOff = () => {
        const tip = chatbotMessages.querySelector('.typing-indicator');
        if (tip) tip.parentElement.remove();
    };

    const hasAny = (hay, needles) => {
        const s = hay.toLowerCase();
        return needles.some(n => s.includes(n));
    };

    // Intents
    const INTENTS = {
        greet() {
            const greet = `${nowGreeting()} I’m ${BOT.name} 👋`;
            lastBotQuestion = 'explore_projects';
            return `${greet} Would you like to explore Nicole’s projects?`;
        },
        projects() {
            lastBotQuestion = 'explore_projects';
            const lines = BOT.persona.projects
                .map(p => `• ${p.name} — ${p.oneLiner}`)
                .join('\n');
            const jump = SITE_SECTIONS.projectsHref ? `\n\nJump to Works: ${SITE_SECTIONS.projectsHref}` : '';
            return `Here are Nicole’s top highlights:\n${lines}${jump}`;
        },
        projects_yes() {
            lastBotQuestion = null;
            return SITE_SECTIONS.projectsHref
                ? `Awesome! Let’s go — ${SITE_SECTIONS.projectsHref}`
                : `Awesome! You can scroll to the Works section to see projects and details.`;
        },
        experience() {
            return `Hands-on with ${BOT.persona.highlights.skills.join(', ')}. Currently learning ${BOT.persona.highlights.learning.join(', ')}. She loves building and iterating with a playful, sweet energy.`;
        },
        about() {
            const cf = pick(BOT.persona.catchphrases);
            const ff = pick(BOT.persona.funFacts);
            return `Nicole is a 4th-year IT student aspiring to be a software engineer. ${cf} Fun tidbit: ${ff}.`;
        },
        skills() {
            const top = `Skills: ${BOT.persona.highlights.skills.join(', ')}`;
            const learn = `Learning: ${BOT.persona.highlights.learning.join(', ')}`;
            const jump = SITE_SECTIONS.skillsHref ? `\nSee more: ${SITE_SECTIONS.skillsHref}` : '';
            return `${top}\n${learn}${jump}`;
        },
        contact() {
            const c = BOT.persona.highlights.contacts;
            const emails = c.emails.join(' • ');
            const href = SITE_SECTIONS.contactHref ? ` or use the contact form ${SITE_SECTIONS.contactHref}` : '';
            return `You can reach Nicole at ${emails}${href}. GitHub: ${c.github}`;
        },
        joke() {
            if (!BOT.persona.jokesEnabled) return "I’ll keep it serious for now!";
            const corny = [
                "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
                "I told my computer I needed a break, and it said 'No problem—I'll go to sleep.'",
                "Why was the JavaScript developer sad? Because they didn’t Node how to Express themselves."
            ];
            const wholesome = [
                "You’re doing great. Tiny steps still count. 🌱",
                "Remember to drink water and breathe. You matter. 🤍",
                "The best code is the code you ship today. You got this!"
            ];
            return `${pick(corny)}\n${pick(wholesome)}`;
        },
        music() {
            return "When she’s not coding, she sings, plays guitar, writes poems and songs, and loves music so much.";
        },
        personality() {
            return "Playful and sweet. She laughs a lot, cares deeply, and is a lovely human. Sometimes a night owl who can’t sleep!";
        },
        commission() {
            const form = SITE_SECTIONS.contactHref ? ` via the contact form ${SITE_SECTIONS.contactHref}` : '';
            return `She’d love to hear your idea! Please send scope, timeline, and references${form} or email her.`;
        },
        easter() {
            return "You found a little easter egg. Thanks for being here. 🌟";
        },
        hire() {
            const c = BOT.persona.highlights.contacts;
            return (
                `Thank you for your interest in Nicole.

For opportunities, please email:
• ${c.emails[0]}
• ${c.emails[1]}
GitHub: ${c.github}

If you’d like, share the role, responsibilities, tech stack, timeline, and next steps. Nicole will respond promptly with her résumé, availability, and any additional materials you require.`).trim();
        },
        fallback() {
            return "I’m not sure about that yet bestie. Try asking about ‘projects’, ‘skills’, ‘about’, ‘experience’, ‘contact’, ‘joke’, or ‘hire’.";
        }
    };

    function routeIntent(raw) {
        const lower = raw.toLowerCase();

        // follow-up branch
        if (lastBotQuestion === 'explore_projects') {
            const yes = ['yes', 'sure', 'ok', 'okay', 'yup', 'yeah', 'details', 'go', 'please'];
            lastBotQuestion = null;
            return hasAny(lower, yes) ? INTENTS.projects_yes() : "Anything else I can help you with, bestie? Ask me questions about Nicole =)";
        }

        if (hasAny(lower, ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon'])) return INTENTS.greet();
        if (hasAny(lower, ['project', 'works', 'portfolio', 'wishfund', 'tnvs'])) return INTENTS.projects();
        if (hasAny(lower, ['experience', 'ojt', 'intern', 'work history'])) return INTENTS.experience();
        if (hasAny(lower, ['about', 'who is nicole', 'who are you'])) return INTENTS.about();
        if (hasAny(lower, ['skill', 'stack', 'tech', 'tools'])) return INTENTS.skills();
        if (hasAny(lower, ['contact', 'email', 'reach', 'github'])) return INTENTS.contact();
        if (hasAny(lower, ['joke', 'humor', 'funny'])) return INTENTS.joke();
        if (hasAny(lower, ['sing', 'guitar', 'music', 'poem', 'poems', 'song', 'songs'])) return INTENTS.music();
        if (hasAny(lower, ['personality', 'vibe'])) return INTENTS.personality();
        if (hasAny(lower, ['commission', 'freelance', 'rate', 'price'])) return INTENTS.commission();
        if (hasAny(lower, ['secret', 'surprise', 'easter'])) return INTENTS.easter();
        if (hasAny(lower, ['hire', 'job', 'role', 'openings', 'opportunity'])) return INTENTS.hire();

        return INTENTS.fallback();
    }

    // kindness nudge for stressed messages
    const NEG = ['tired', 'stressed', 'scared', 'anxious', 'can’t sleep', 'cant sleep', 'i’m stuck', 'i am stuck', 'confused', 'cry', 'overwhelmed'];
    const sentimentNudge = (raw) => {
        if (hasAny(raw.toLowerCase(), NEG)) {
            const msg = "You’re doing great. Breathe and take it one tiny step at a time. If you want, I can show Nicole’s projects or skills to inspire you. 💫";
            addMessage(msg, 'bot');
            return true;
        }
        return false;
    };

    // Wire up
    chatbotToggle?.addEventListener('click', () => {
        chatbotToggle.classList.toggle('open');
        chatbotWindow.classList.toggle('open');
    });

    const handleSend = () => {
        const message = chatbotInput.value.trim();
        if (message === '') return;

        addMessage(escapeHTML(message), 'user');
        chatbotInput.value = '';

        if (sentimentNudge(message)) return;

        typingOn();
        setTimeout(() => {
            typingOff();
            const botResponse = routeIntent(message);
            addMessage(botResponse, 'bot');
        }, 900 + Math.random() * 700);
    };

    chatbotSend?.addEventListener('click', handleSend);
    chatbotInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // initial greet
    setTimeout(() => {
        typingOn();
        setTimeout(() => {
            typingOff();
            addMessage(`${nowGreeting()} I’m ${BOT.name} 👋. Would you like to explore Nicole’s projects?`, 'bot');
            lastBotQuestion = 'explore_projects';
        }, 1100);
    }, 1200);

    /* =========================
       Card Tilt & Skill Float
    ========================== */
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -15;
            const rotateY = (x / width - 0.5) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    document.querySelectorAll('.skill-card').forEach((card, index) => {
        const delay = index * 100;
        const duration = 4000 + Math.random() * 2000;
        card.style.animationDelay = `${delay}ms`;
        card.style.animationDuration = `${duration}ms`;
    });
});
