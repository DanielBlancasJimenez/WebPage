/* =====================================================================
   SANDWISH STUDIO — INTERFAZ DE VIDEOJUEGO
   Máquina de estados de pantallas + i18n + carrusel + navegación.
   ===================================================================== */

const SW = (function () {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TRANSITION_OUT = prefersReducedMotion ? 0 : 320;
    const TRANSITION_IN = prefersReducedMotion ? 0 : 450;

    /* -----------------------------------------------------------------
       TRADUCCIONES
       ----------------------------------------------------------------- */
    const translations = {
        es: {
            hud_online: "EN LÍNEA",
            main_tagline: "PULSA UNA OPCIÓN PARA CONTINUAR",
            crumb_main: "MENÚ PRINCIPAL",
            crumb_play: "JUEGOS",
            crumb_studio: "ESTUDIO",
            crumb_network: "REDES",
            nav_games: "JUEGOS",
            nav_studio: "ESTUDIO",
            nav_social: "REDES",
            title_games: "SELECCIONA UN JUEGO",
            game1_title: "THOSE WHO ARE ABOUT TO SPIN",
            spin_desc1: "Crea tu propia ruleta con criaturas mitológicas para no ser linchado por ser un mal César.",
            spin_desc2: "Haz tu propia \"build\" con las piezas que vende el mercader y consigue la mayor reputación enviando oleadas de enemigos.",
            mask_desc1: "Adéntrate en la locura. Un juego donde las apariencias engañan y cada máscara oculta un nuevo desafío.",
            mask_desc2: "¿Podrás descubrir la verdad antes de que se acabe el tiempo?",
            btn_start: "JUGAR AHORA",
            studio_title: "EQUIPO DE DESARROLLO",
            dossier_tag: "FICHA · SANDWISH",
            studio_p1: "SandWish Studio, un estudio de juegos independiente emergente, se compromete a crear experiencias digitales originales y atractivas. Nuestro viaje se centra en combinar narrativas profundas y cautivadoras con mecánicas de juego innovadoras y satisfactorias. Cada proyecto es un paso hacia dejar una huella emocional y creativa duradera en los jugadores.",
            studio_p2: "En nuestro reino, la imaginación no tiene límites y los nuevos mundos cobran vida. Abrazamos la esencia de los juegos independientes clásicos, infundiéndoles ideas únicas, efectos visuales impresionantes y mecánicas imaginativas, todo diseñado para brindar experiencias de jugador inolvidables. Nos dedicamos valientemente a la creatividad pura y a los desafíos que superan los límites del desarrollo de juegos.",
            studio_p3: "En SandWish Studio, nos esforzamos por alcanzar la grandeza en nuestro oficio, reuniendo a un equipo diverso de desarrolladores talentosos impulsados por una vibrante comunidad de jugadores. Da rienda suelta al héroe que llevas dentro y crea un legado duradero, ya sea como un jugador apasionado o como un valioso miembro de nuestro equipo.",
            title_social: "CANALES DE TRANSMISIÓN",
            channel_open: "ABRIR &gt;",
            ctrl_a: "[A] CONFIRMAR",
            ctrl_b: "[B] VOLVER",
            ctrl_nav: "[↑↓] NAVEGAR",
            mobile_hint: "TOCA PARA SELECCIONAR",
            footer_copy: "INSERT COIN TO CONTINUE... &copy; 2026"
        },
        en: {
            hud_online: "ONLINE",
            main_tagline: "PRESS AN OPTION TO CONTINUE",
            crumb_main: "MAIN MENU",
            crumb_play: "GAMES",
            crumb_studio: "STUDIO",
            crumb_network: "SOCIALS",
            nav_games: "GAMES",
            nav_studio: "STUDIO",
            nav_social: "SOCIALS",
            title_games: "SELECT GAME",
            game1_title: "THOSE WHO ARE ABOUT TO SPIN",
            spin_desc1: "Create your own roulette with mythological creatures to avoid being lynched for being a bad Caesar.",
            spin_desc2: "Build your own setup with pieces sold by the merchant and earn the highest reputation by sending waves of enemies.",
            mask_desc1: "Delve into madness. A game where appearances deceive and every mask hides a new challenge.",
            mask_desc2: "Can you discover the truth before time runs out?",
            btn_start: "PLAY NOW",
            studio_title: "DEVELOPMENT TEAM",
            dossier_tag: "FILE · SANDWISH",
            studio_p1: "SandWish Studio, an emerging independent game studio, is committed to crafting original and engaging digital experiences. Our journey is centered on blending deep, compelling narratives with innovative and satisfying gameplay mechanics. Every project is a step towards leaving a lasting emotional and creative mark on the players.",
            studio_p2: "In our realm, imagination knows no bounds, and new worlds come to life. We embrace the essence of classic indie games, infusing them with unique ideas, stunning visuals, and imaginative mechanics, all designed to deliver unforgettable player experiences. We are fearlessly dedicated to pure creativity and challenges that push the boundaries of game development.",
            studio_p3: "At SandWish Studio, we strive for greatness in our craft, bringing together a diverse team of talented developers fueled by a vibrant community of players. Unleash your inner hero and create a lasting legacy, whether as a passionate player or a valued member of our team.",
            title_social: "TRANSMISSION CHANNELS",
            channel_open: "OPEN &gt;",
            ctrl_a: "[A] CONFIRM",
            ctrl_b: "[B] BACK",
            ctrl_nav: "[\u2191\u2193] NAVIGATE",
            mobile_hint: "TAP TO SELECT",
            footer_copy: "INSERT COIN TO CONTINUE... &copy; 2026"
        }
    };

    let currentLang = 'en';
    let currentScreen = 'main';
    let currentGame = 'spin';
    const carouselState = {};

    /* -----------------------------------------------------------------
       i18n
       ----------------------------------------------------------------- */
    function applyTranslations(lang) {
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key] !== undefined) {
                el.innerHTML = translations[lang][key];
            }
        });

        const btnEs = document.getElementById('btn-es');
        const btnEn = document.getElementById('btn-en');
        if (btnEs) btnEs.classList.toggle('active', lang === 'es');
        if (btnEn) btnEn.classList.toggle('active', lang === 'en');

        updateBreadcrumb();
    }

    function setLanguage(lang) {
        if (!translations[lang] || lang === currentLang) return;

        const duration = prefersReducedMotion ? 0 : 500;
        const midpoint = duration / 2;

        document.body.classList.remove('lang-transitioning');
        void document.body.offsetWidth; // reinicia la animación si estaba activa
        document.body.classList.add('lang-transitioning');

        window.setTimeout(() => {
            currentLang = lang;
            applyTranslations(lang);
            try { localStorage.setItem('selectedLang', lang); } catch (e) { /* no-op */ }
        }, midpoint);

        window.setTimeout(() => {
            document.body.classList.remove('lang-transitioning');
        }, duration);
    }

    function detectInitialLanguage() {
        try {
            const stored = localStorage.getItem('selectedLang');
            if (stored && translations[stored]) return stored;
            const browserLang = navigator.language || navigator.userLanguage || 'en';
            return browserLang.startsWith('es') ? 'es' : 'en';
        } catch (e) {
            return 'en';
        }
    }

    /* -----------------------------------------------------------------
       HUD / BREADCRUMB
       ----------------------------------------------------------------- */
    const MOBILE_BREADCRUMB_QUERY = '(max-width: 640px)';

    function screenLabel(id) {
        const t = translations[currentLang];
        if (id === 'play') {
            const isMobile = window.matchMedia(MOBILE_BREADCRUMB_QUERY).matches;
            // En móvil el título completo ("THOSE WHO ARE ABOUT TO SPIN") no
            // cabe en la barra superior y desborda; se usa una sigla corta.
            const gameName = currentGame === 'spin'
                ? (isMobile ? 'TWAATS' : t.game1_title)
                : 'MASKNESS';
            return t.crumb_play + '  /  ' + gameName;
        }
        return t['crumb_' + id] || t.crumb_main;
    }

    function updateBreadcrumb() {
        const crumbText = document.getElementById('hud-breadcrumb-text');
        if (crumbText) crumbText.textContent = screenLabel(currentScreen);

        const backBtn = document.getElementById('hud-back-btn');
        if (backBtn) backBtn.classList.toggle('visible', currentScreen !== 'main');

        const hints = document.getElementById('hud-hints');
        if (hints) {
            const t = translations[currentLang];
            let navHint = t.ctrl_nav;
            if (currentScreen === 'play') {
                navHint = `[\u2190\u2192] ${currentLang === 'es' ? 'CAMBIAR JUEGO' : 'SWITCH GAME'}`;
            } else if (currentScreen === 'network') {
                navHint = `[\u2190\u2192] ${currentLang === 'es' ? 'NAVEGAR' : 'NAVIGATE'}`;
            }
            hints.innerHTML = `<span>${navHint}</span><span>${t.ctrl_a}</span>`;
        }
    }

    /* -----------------------------------------------------------------
       NAVEGACIÓN ENTRE PANTALLAS
       ----------------------------------------------------------------- */
    function goToScreen(targetId) {
        if (targetId === currentScreen) return;
        const current = document.getElementById('screen-' + currentScreen);
        const next = document.getElementById('screen-' + targetId);
        if (!current || !next) return;

        current.classList.add('screen--leaving');

        window.setTimeout(() => {
            current.classList.remove('active', 'screen--leaving');
            next.classList.add('active', 'screen--entering');
            currentScreen = targetId;
            document.body.dataset.screen = targetId;
            updateBreadcrumb();

            const heading = next.querySelector('.screen-title, .main-logo');
            if (heading) heading.setAttribute('tabindex', '-1');

            window.setTimeout(() => next.classList.remove('screen--entering'), TRANSITION_IN);
        }, TRANSITION_OUT);
    }

    /* -----------------------------------------------------------------
       CARRUSELES
       ----------------------------------------------------------------- */
    function buildDots(id) {
        const track = document.querySelector(`#${id} .carousel-track`);
        const dotsHolder = document.querySelector(`[data-dots-for="${id}"]`);
        if (!track || !dotsHolder) return;
        const count = track.querySelectorAll('img').length;
        dotsHolder.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => jumpCarousel(id, i));
            dotsHolder.appendChild(dot);
        }
    }

    function updateDots(id) {
        const dotsHolder = document.querySelector(`[data-dots-for="${id}"]`);
        if (!dotsHolder) return;
        dotsHolder.querySelectorAll('span').forEach((dot, i) => {
            dot.classList.toggle('active', i === (carouselState[id] || 0));
        });
    }

    function renderCarousel(id) {
        const track = document.querySelector(`#${id} .carousel-track`);
        if (!track) return;
        const translateX = -(carouselState[id] * 100);
        track.style.transform = `translateX(${translateX}%)`;
        updateDots(id);
    }

    function moveCarousel(id, direction) {
        const track = document.querySelector(`#${id} .carousel-track`);
        if (!track) return;
        const total = track.querySelectorAll('img').length;
        if (carouselState[id] === undefined) carouselState[id] = 0;

        carouselState[id] += direction;
        if (carouselState[id] < 0) carouselState[id] = total - 1;
        if (carouselState[id] >= total) carouselState[id] = 0;

        renderCarousel(id);
    }

    function jumpCarousel(id, index) {
        carouselState[id] = index;
        renderCarousel(id);
    }

    /* -----------------------------------------------------------------
       GESTOS TÁCTILES (swipe)
       Alternativa accesible a las flechas de teclado en dispositivos
       móviles: deslizar horizontalmente sobre un carrusel avanza o
       retrocede sus imágenes, igual que pulsar los botones < >.
       ----------------------------------------------------------------- */
    function addSwipeSupport(el, onSwipe) {
        if (!el) return;
        let startX = 0;
        let startY = 0;
        let tracking = false;
        const THRESHOLD = 40; // px mínimos para considerarlo un swipe intencional

        el.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            tracking = true;
        }, { passive: true });

        el.addEventListener('touchend', (e) => {
            if (!tracking) return;
            tracking = false;
            const touch = e.changedTouches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            // Solo actuar si el gesto es predominantemente horizontal,
            // para no interferir con el scroll vertical de la pantalla.
            if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
                onSwipe(dx < 0 ? 'left' : 'right');
            }
        }, { passive: true });
    }

    /* -----------------------------------------------------------------
       SELECTOR DE JUEGO
       ----------------------------------------------------------------- */
    function selectGame(gameId) {
        currentGame = gameId;

        document.querySelectorAll('.game-tab').forEach((tab) => {
            const active = tab.dataset.game === gameId;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', String(active));
        });

        document.querySelectorAll('.game-panel').forEach((panel) => {
            panel.classList.toggle('active', panel.dataset.gamePanel === gameId);
        });

        updateBreadcrumb();
    }

    /* -----------------------------------------------------------------
       NAVEGACIÓN POR TECLADO (estilo mando)
       ----------------------------------------------------------------- */
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();

            if ((e.key === 'Escape' || key === 'b') && currentScreen !== 'main') {
                e.preventDefault();
                goToScreen('main');
                return;
            }

            // [A] CONFIRMAR — activa de verdad el control con foco, igual que en un mando.
            if (key === 'a') {
                const focused = document.activeElement;

                // Si el foco está en una pestaña de juego, A debe abrir el juego
                // seleccionado (el botón "JUGAR AHORA" de ese panel), no volver a
                // hacer click en la propia pestaña (que no tiene efecto visible).
                if (focused && focused.classList && focused.classList.contains('game-tab')) {
                    const activePlayBtn = document.querySelector('.game-panel.active .play-btn');
                    if (activePlayBtn) {
                        e.preventDefault();
                        activePlayBtn.click();
                    }
                    return;
                }

                if (focused && focused !== document.body && typeof focused.click === 'function') {
                    e.preventDefault();
                    focused.click();
                }
                return;
            }

            if (currentScreen === 'main') {
                const items = Array.from(document.querySelectorAll('.menu-item'));
                const focusedIndex = items.indexOf(document.activeElement);

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = items[(focusedIndex + 1 + items.length) % items.length] || items[0];
                    next.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = items[(focusedIndex - 1 + items.length) % items.length] || items[0];
                    prev.focus();
                }
            }

            if (currentScreen === 'play') {
                const tabs = Array.from(document.querySelectorAll('.game-tab'));
                const playBtn = document.querySelector('.game-panel.active .play-btn');
                const focusedTabIdx = tabs.indexOf(document.activeElement);

                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    // Si el foco está dentro del panel (ej. el botón de jugar), las flechas
                    // izq/der vuelven a controlar las pestañas de juego.
                    const idx = focusedTabIdx !== -1
                        ? focusedTabIdx
                        : tabs.findIndex((t) => t.dataset.game === currentGame);
                    const nextIdx = e.key === 'ArrowRight'
                        ? (idx + 1) % tabs.length
                        : (idx - 1 + tabs.length) % tabs.length;
                    selectGame(tabs[nextIdx].dataset.game);
                    tabs[nextIdx].focus();
                } else if (e.key === 'ArrowDown' && focusedTabIdx !== -1 && playBtn) {
                    // Baja de la pestaña activa directamente al botón "JUGAR AHORA".
                    e.preventDefault();
                    playBtn.focus();
                } else if (e.key === 'ArrowUp' && document.activeElement === playBtn) {
                    // Sube del botón "JUGAR AHORA" de vuelta a la pestaña activa.
                    e.preventDefault();
                    const activeTab = tabs.find((t) => t.dataset.game === currentGame);
                    if (activeTab) activeTab.focus();
                }
            }

            if (currentScreen === 'network' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                e.preventDefault();
                const tiles = Array.from(document.querySelectorAll('.channel-tile'));
                const idx = tiles.indexOf(document.activeElement);
                const nextIdx = e.key === 'ArrowRight'
                    ? (idx + 1 + tiles.length) % tiles.length
                    : (idx - 1 + tiles.length) % tiles.length;
                tiles[nextIdx].focus();
            }
        });
    }

    /* -----------------------------------------------------------------
       INICIALIZACIÓN
       ----------------------------------------------------------------- */
    function init() {
        currentLang = detectInitialLanguage();
        applyTranslations(currentLang);

        document.querySelectorAll('.menu-item').forEach((btn) => {
            btn.addEventListener('click', () => goToScreen(btn.dataset.target));
        });

        document.querySelectorAll('.game-tab').forEach((tab) => {
            tab.addEventListener('click', () => selectGame(tab.dataset.game));
        });

        const backBtn = document.getElementById('hud-back-btn');
        if (backBtn) backBtn.addEventListener('click', () => goToScreen('main'));

        buildDots('carousel-spin');
        buildDots('carousel-maskness');
        carouselState['carousel-spin'] = 0;
        carouselState['carousel-maskness'] = 0;

        // Deslizar con el dedo funciona como alternativa táctil a los
        // botones < > y a las flechas de teclado.
        addSwipeSupport(document.getElementById('carousel-spin'), (dir) => {
            moveCarousel('carousel-spin', dir === 'left' ? 1 : -1);
        });
        addSwipeSupport(document.getElementById('carousel-maskness'), (dir) => {
            moveCarousel('carousel-maskness', dir === 'left' ? 1 : -1);
        });

        initKeyboardNav();
        document.body.classList.add('booted');

        // Si el ancho cruza el umbral móvil (p. ej. al rotar el dispositivo),
        // recalcula el breadcrumb para usar la sigla corta o el título completo.
        const breadcrumbMedia = window.matchMedia(MOBILE_BREADCRUMB_QUERY);
        const handleBreadcrumbBreakpoint = () => {
            if (currentScreen === 'play') updateBreadcrumb();
        };
        if (typeof breadcrumbMedia.addEventListener === 'function') {
            breadcrumbMedia.addEventListener('change', handleBreadcrumbBreakpoint);
        } else if (typeof breadcrumbMedia.addListener === 'function') {
            // Compatibilidad con navegadores antiguos (Safari < 14).
            breadcrumbMedia.addListener(handleBreadcrumbBreakpoint);
        }
    }

    document.addEventListener('DOMContentLoaded', init);

    return { setLanguage, moveCarousel, goToScreen, selectGame };
})();