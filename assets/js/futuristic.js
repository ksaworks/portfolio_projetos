// Futuristic Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body::before');
        const speed = scrolled * 0.5;
        
        // Update background position
        document.body.style.backgroundPosition = `center ${speed}px`;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

    // Typing effect for main title
    const mainTitle = document.querySelector('#banner h1');
    if (mainTitle) {
        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                mainTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 500);
    }

    // Glitch effect on hover for project cards
    const projectCards = document.querySelectorAll('.posts article');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s ease-in-out';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });

    // Dynamic particle background
    createParticles();

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 26, 46, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 212, 255, 0.3)';
        } else {
            header.style.background = 'rgba(26, 26, 46, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Detectar idioma atual para texto de carregamento
    function getCurrentLanguageForLoading() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentPath = window.location.pathname;
        
        // Verificar se é página de blog
        if (currentPath.includes('/blog/')) {
            if (currentPage === 'blog-en.html') return 'en';
            if (currentPage === 'blog-es.html') return 'es';
            if (currentPage === 'blogindex.html') return 'pt-br';
            // Verificar posts do blog
            if (currentPage.includes('-en.html')) return 'en';
            if (currentPage.includes('-es.html')) return 'es';
            return 'pt-br'; // Default para português
        }
        
        // Páginas principais
        if (currentPage === 'index-en.html') return 'en';
        if (currentPage === 'index-es.html') return 'es';
        return 'pt-br'; // Default para português
    }

    // Textos de carregamento multilíngues
    const LOADING_TEXTS = {
        'pt-br': {
            portfolio: 'Carregando Portfólio...',
            blog: 'Carregando Blog...'
        },
        'en': {
            portfolio: 'Loading Portfolio...',
            blog: 'Loading Blog...'
        },
        'es': {
            portfolio: 'Cargando Portafolio...',
            blog: 'Cargando Blog...'
        }
    };

    const currentLang = getCurrentLanguageForLoading();
    const isBlogPage = window.location.pathname.includes('/blog/');
    
    // Só mostrar loading screen se for página de blog
    if (isBlogPage) {
        const loadingText = LOADING_TEXTS[currentLang] 
            ? LOADING_TEXTS[currentLang]['blog']
            : LOADING_TEXTS['pt-br']['blog'];

        // Loading screen
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${loadingText}</p>
            </div>
        `;
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease-out;
        `;
        
        // Adicionar CSS para remover pseudo-elementos
        const style = document.createElement('style');
        style.textContent = `
            #loading-screen *::before,
            #loading-screen *::after {
                content: none !important;
                display: none !important;
                visibility: hidden !important;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loadingScreen);
        
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                    // Remover o estilo também
                    if (style && style.parentNode) {
                        style.parentNode.removeChild(style);
                    }
                }, 500);
            }, 1000);
        });
    }
});

// Particle system
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: #00d4ff;
        border-radius: 50%;
        opacity: 0.7;
        animation: float ${Math.random() * 10 + 5}s linear infinite;
    `;
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(particle);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(0, 212, 255, 0.3);
        border-top: 3px solid #00d4ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-content {
        text-align: center;
        color: #00d4ff;
        font-family: 'Orbitron', monospace;
    }
`;
document.head.appendChild(style);

