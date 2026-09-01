/* ==========================
   LÓGICA DEL CARRUSEL
========================== */
const carouselState = {};

window.moveCarousel = function(id, direction) {
    const track = document.querySelector(`#${id} .carousel-track`);
    if (!track) return;
    
    const images = track.querySelectorAll('img');
    const totalImages = images.length;

    if (carouselState[id] === undefined) {
        carouselState[id] = 0;
    }

    carouselState[id] += direction;

    if (carouselState[id] < 0) {
        carouselState[id] = totalImages - 1;
    } else if (carouselState[id] >= totalImages) {
        carouselState[id] = 0;
    }

    const translateX = -(carouselState[id] * 100);
    track.style.transform = `translateX(${translateX}%)`;
}

/* ==========================
   LÓGICA DE IDIOMAS
========================== */
const translations = {
    es: {
        nav_games: "[ JUEGOS ]",
        nav_studio: "[ ESTUDIO ]",
        nav_social: "[ REDES ]",
        title_games: "--- SELECCIONA UN JUEGO ---",
        game1_title: "THOSE WHO ARE ABOUT TO SPIN",
        spin_desc1: "Crea tu propia ruleta con criaturas mitológicas para no ser linchado por ser un mal César.",
        spin_desc2: "Haz tu propia \"build\" con las piezas que vende el mercader y consigue la mayor reputación enviando oleadas de enemigos.",
        mask_desc1: "Adéntrate en la locura. Un juego donde las apariencias engañan y cada máscara oculta un nuevo desafío.",
        mask_desc2: "¿Podrás descubrir la verdad antes de que se acabe el tiempo?",
        btn_start: "JUGAR AHORA",
        studio_title: "EQUIPO DE DESARROLLO",
        studio_p1: "SandWish Studio, un estudio de juegos independiente emergente, se compromete a crear experiencias digitales originales y atractivas. Nuestro viaje se centra en combinar narrativas profundas y cautivadoras con mecánicas de juego innovadoras y satisfactorias. Cada proyecto es un paso hacia dejar una huella emocional y creativa duradera en los jugadores.",
        studio_p2: "En nuestro reino, la imaginación no tiene límites y los nuevos mundos cobran vida. Abrazamos la esencia de los juegos independientes clásicos, infundiéndoles ideas únicas, efectos visuales impresionantes y mecánicas imaginativas, todo diseñado para brindar experiencias de jugador inolvidables. Nos dedicamos valientemente a la creatividad pura y a los desafíos que superan los límites del desarrollo de juegos.",
        studio_p3: "En SandWish Studio, nos esforzamos por alcanzar la grandeza en nuestro oficio, reuniendo a un equipo diverso de desarrolladores talentosos impulsados por una vibrante comunidad de jugadores. Da rienda suelta al héroe que llevas dentro y crea un legado duradero, ya sea como un jugador apasionado o como un valioso miembro de nuestro equipo.",
        title_social: "--- NUESTROS PILARES ---",
        ctrl_a: "[A] Confirmar",
        ctrl_b: "[B] Volver",
        ctrl_nav: "[L/R] Navegar",
        footer_copy: "INSERT COIN TO CONTINUE... &copy; 2026"
    },
    en: {
        nav_games: "[ GAMES ]",
        nav_studio: "[ STUDIO ]",
        nav_social: "[ SOCIALS ]",
        title_games: "--- SELECT GAME ---",
        game1_title: "THOSE WHO ARE ABOUT TO SPIN",
        spin_desc1: "Create your own roulette with mythological creatures to avoid being lynched for being a bad Caesar.",
        spin_desc2: "Build your own setup with pieces sold by the merchant and earn the highest reputation by sending waves of enemies.",
        mask_desc1: "Delve into madness. A game where appearances deceive and every mask hides a new challenge.",
        mask_desc2: "Can you discover the truth before time runs out?",
        btn_start: "PLAY NOW",
        studio_title: "DEVELOPMENT TEAM",
        studio_p1: "SandWish Studio, an emerging independent game studio, is committed to crafting original and engaging digital experiences. Our journey is centered on blending deep, compelling narratives with innovative and satisfying gameplay mechanics. Every project is a step towards leaving a lasting emotional and creative mark on the players.",
        studio_p2: "In our realm, imagination knows no bounds, and new worlds come to life. We embrace the essence of classic indie games, infusing them with unique ideas, stunning visuals, and imaginative mechanics, all designed to deliver unforgettable player experiences. We are fearlessly dedicated to pure creativity and challenges that push the boundaries of game development.",
        studio_p3: "At SandWish Studio, we strive for greatness in our craft, bringing together a diverse team of talented developers fueled by a vibrant community of players. Unleash your inner hero and create a lasting legacy, whether as a passionate player or a valued member of our team.",
        title_social: "--- OUR PILLARS ---",
        ctrl_a: "[A] Confirm",
        ctrl_b: "[B] Back",
        ctrl_nav: "[L/R] Navigate",
        footer_copy: "INSERT COIN TO CONTINUE... &copy; 2026"
    }
};

let scrollTimeout;
let isNavigating = false;

window.changeLanguage = function(lang) {
    // 1. Iniciar la transición de Fade a Negro
    document.body.classList.remove('is-transitioning');
    void document.body.offsetWidth; // Forzar el reinicio de la animación
    document.body.classList.add('is-transitioning');

    // 2. Cambiar textos justo a la mitad de la transición (cuando está en negro, a los 200ms)
    setTimeout(() => {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        const btnEs = document.getElementById('btn-es');
        const btnEn = document.getElementById('btn-en');
        if (btnEs) btnEs.className = 'retro-btn';
        if (btnEn) btnEn.className = 'retro-btn';
        
        const activeBtn = document.getElementById('btn-' + lang);
        if (activeBtn) activeBtn.className = 'retro-btn active';
    }, 200);
    
    // 3. Quitar la clase al finalizar la animación (400ms)
    setTimeout(() => {
        if (!isNavigating) {
            document.body.classList.remove('is-transitioning');
        }
    }, 400);

    try {
        localStorage.setItem('selectedLang', lang);
    } catch (e) {
        console.warn('LocalStorage no disponible.');
    }
}

function initLanguage() {
    let lang = 'en'; 
    try {
        const storedLang = localStorage.getItem('selectedLang');
        if (storedLang) {
            lang = storedLang;
        } else {
            const browserLang = navigator.language || navigator.userLanguage;
            lang = browserLang.startsWith('es') ? 'es' : 'en'; 
        }
    } catch (e) {
        lang = 'en'; 
    }
    
    // Carga inicial sin transición
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    if (btnEs) btnEs.className = 'retro-btn';
    if (btnEn) btnEn.className = 'retro-btn';
    
    const activeBtn = document.getElementById('btn-' + lang);
    if (activeBtn) activeBtn.className = 'retro-btn active';
}

/* ==========================
   EVENTOS ONLOAD Y SCROLL
========================== */
window.onload = function() {
    initLanguage();

    // Fade a negro al navegar por el menú
    const navLinks = document.querySelectorAll('.retro-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            isNavigating = true;
            document.body.classList.remove('is-transitioning');
            void document.body.offsetWidth; // Forzar reinicio de la animación
            document.body.classList.add('is-transitioning');
            
            // Seguridad por si no salta el evento de scroll
            setTimeout(() => {
                if (isNavigating) {
                    document.body.classList.remove('is-transitioning');
                    isNavigating = false;
                }
            }, 800); 
        });
    });
};

// Asegurar que la pantalla se vuelva a iluminar cuando la pantalla deje de hacer scroll
window.addEventListener('scroll', () => {
    if (isNavigating) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-transitioning');
            isNavigating = false;
        }, 150); // 150ms sin moverse = ha terminado el scroll
    }
});