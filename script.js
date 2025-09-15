document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    });

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

    const typingContainer = document.querySelector('.typing-container span');
    let typeInterval;
    let isTypingActive = false;
    const phrases = ["an aspiring Full-Stack Developer", "an IT enthusiast", "an aspiring Software Engineer"];
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false;

    function type() {
        if (!isTypingActive) return;
        const currentPhrase = phrases[phraseIndex];
        let typeSpeed = isDeleting ? 70 : 120;
        if (isDeleting) { typingContainer.textContent = currentPhrase.substring(0, charIndex--); }
        else { typingContainer.textContent = currentPhrase.substring(0, charIndex++); }
        if (!isDeleting && charIndex === currentPhrase.length + 1) { isDeleting = true; typeSpeed = 1500; }
        else if (isDeleting && charIndex === -1) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
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

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a.nav-link');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(section => sectionObserver.observe(section));

    const shapes = document.querySelectorAll('.shape');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        shapes.forEach((shape, i) => {
            const speed = (i % 2 === 0) ? 0.1 : 0.05;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

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

    // --- Chatbot Logic ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    let lastBotQuestion = null; // This is the bot's "memory"

    chatbotToggle.addEventListener('click', () => {
        chatbotToggle.classList.toggle('open');
        chatbotWindow.classList.toggle('open');
    });

    const addMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const getBotResponse = (userInput) => {
        const lowerInput = userInput.toLowerCase();

        // --- Contextual Responses ---
        if (lastBotQuestion === 'explore_projects') {
            const affirmatives = ['yes', 'sure', 'ok', 'yup', 'yeah', 'details'];
            lastBotQuestion = null; // Clear context after one use
            if (affirmatives.some(word => lowerInput.includes(word))) {
                return "Awesome! You should check out her 'Works' section. Her main project is a full Transport Network Vehicle Service (TNVS) Logistics system. It's super detailed!";
            } else {
                return "Okay, no worries! Is there anything else I can help you with, bestie?";
            }
        }

        // --- Keyword-based General Responses ---

        // Greetings & Small Talk
        const greetings = ['hello', 'hi', 'hey', 'good morning'];
        if (greetings.some(word => lowerInput.includes(word))) {
            lastBotQuestion = 'explore_projects';
            return "Hi! I’m Nicole’s portfolio bot 👋. Want to explore her projects?";
        }

        // Portfolio Navigation
        if (lowerInput.includes('project')) {
            lastBotQuestion = 'explore_projects';
            return "Nicole has built a logistics system and more! Want details?";
        }
        if (lowerInput.includes('experience')) {
            return "She has experience in PHP, MySQL, and full-stack dev—plus she's getting ready for OJT training. Check out the 'Experience' section for the deets!";
        }
        if (lowerInput.includes('about')) {
            return "Nicole is a 4th-year IT student aspiring to be a software engineer. The 'About Me' section has her full story!";
        }
        if (lowerInput.includes('skill')) {
            return "Her toolkit includes PHP, JavaScript, Bootstrap, MySQL, and she's currently learning Flutter and React!";
        }
        if (lowerInput.includes('contact')) {
            return "You can reach Nicole via the contact form on this page or by emailing nicmalitao@gmail.com. Her GitHub is khadibels.";
        }

        // Fun & Personality
        if (lowerInput.includes('joke')) {
            return "Why do programmers prefer dark mode? Because light attracts bugs. 🐛";
        }
        if (lowerInput.includes('sing') || lowerInput.includes('guitar')) {
            return "Nicole loves singing and playing guitar when she’s not coding!";
        }
        if (lowerInput.includes('fact')) {
            return "Fun fact: Her capstone project is a full logistics management system with multiple modules!";
        }
        if (lowerInput.includes('personality')) {
            return "She's very jolly and easy to be with, but her social battery can get low sometimes!";
        }
        if (lowerInput.includes('commission')) {
            return "She'd love to! Just send her a message through the contact form with the details. :DD";
        }

        // Easter Eggs
        if (lowerInput.includes('secret') || lowerInput.includes('surprise')) {
            return "You found the easter egg! Nicole says hi and thanks for visiting.";
        }
        if (lowerInput.includes('hire')) {
            return "Looking to hire? Great choice—Nicole is ready for new challenges and would love to hear from you!";
        }

        // Fallback / Error
        lastBotQuestion = null; // Clear context on unknown input
        return "Hmm, I don’t know that one yet 🤔. Try asking about 'projects', 'skills', or 'contact'.";
    };

    const handleSendMessage = () => {
        const message = chatbotInput.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        chatbotInput.value = '';

        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000);
    };

    chatbotSend.addEventListener('click', handleSendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Initial bot message
    setTimeout(() => {
        addMessage("Hi! I’m Nicole’s portfolio bot 👋. Want to explore her projects?", 'bot');
        lastBotQuestion = 'explore_projects';
    }, 1500);

    // Project Card Tilt Effect
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 1.5) * -15;
            const rotateY = (x / width - -1.5) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Staggered animation for skill cards
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        const delay = index * 100;
        const duration = 4000 + Math.random() * 2000;
        card.style.animationDelay = `${delay}ms`;
        card.style.animationDuration = `${duration}ms`;
    });
});