document.addEventListener('DOMContentLoaded', () => {
    // --- NAVEGACIÓN Y MARCADOR (MENU LINKS) ---
    const menuLinks = document.querySelectorAll('.menu-link');

    // Función auxiliar para deseleccionar todos
    const deselectAll = () => {
        menuLinks.forEach(item => {
            item.classList.remove('selected');
        });
    };
    
    // Función que actualiza la clase 'selected' del menú
    const updateMenuHighlight = (sectionIndex) => {
        if (sectionIndex >= 0 && sectionIndex < menuLinks.length) {
            if (!menuLinks[sectionIndex].classList.contains('selected')) {
                deselectAll();
                menuLinks[sectionIndex].classList.add('selected');
            }
        }
    };
    
    // Inicializa el menú
    if (menuLinks.length > 0) {
         menuLinks[0].classList.add('selected');
    }

    // --- LÓGICA DE SCROLL LATERAL Y SNAPPING (PC) ---

    const scrollContainer = document.getElementById('scroll-container');
    const scrollHeightContainer = document.getElementById('scroll-height-container');
    let scrollTimeout; 
    
    // Esta lógica solo se ejecuta en pantallas grandes (PC)
    if (scrollContainer && window.innerWidth > 768) {
        
        const scrollHeight = scrollHeightContainer.offsetHeight;
        const maxScrollX = 3 * window.innerWidth;
        const sectionHeight = window.innerHeight;

        const snapToSection = () => {
            const currentScrollY = window.scrollY;
            const targetSectionIndex = Math.round(currentScrollY / sectionHeight);
            const targetScrollY = targetSectionIndex * sectionHeight;

            const threshold = 5; // Umbral de 5 píxeles
            if (Math.abs(currentScrollY - targetScrollY) > threshold) {
                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth'
                });
            }
            
            updateMenuHighlight(targetSectionIndex);
        };

        // Hacemos updateScroll global (window.updateScroll) para que pueda ser llamada 
        // desde el script en index.html (esto soluciona el problema de navegación de los headers).
        window.updateScroll = () => {
            const scrollY = window.scrollY;

            // 1. Calcula y aplica la posición horizontal
            const scrollProgress = scrollY / (scrollHeight - sectionHeight);
            const scrollX = Math.min(scrollProgress * maxScrollX, maxScrollX);
            scrollContainer.style.transform = `translateX(-${scrollX}px)`;

            // 2. Limpia el temporizador anterior
            clearTimeout(scrollTimeout);

            // 3. Establece un nuevo temporizador para el snap
            scrollTimeout = setTimeout(snapToSection, 150);
            
            // 4. Mantenemos la actualización del menú en tiempo real
            const currentSectionIndex = Math.round(scrollY / sectionHeight);
            updateMenuHighlight(currentSectionIndex);
        };

        // --- MANEJO DE EVENTOS (Scroll Horizontal) ---
        window.addEventListener('scroll', window.updateScroll);

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                window.updateScroll(); 
                snapToSection(); 
            }
        });

        window.updateScroll(); // Ejecuta una vez al inicio
    }
    
    // ======================================================================
    // --- LÓGICA DE LA SECCIÓN CONTACTO: CONTENIDO DINÁMICO ---
    // ======================================================================
    
    const contactItems = document.querySelectorAll('.item-slot');
    // Necesitas añadir el ID 'detail-content-area' al contenedor de detalles en index.html
    const detailContentArea = document.getElementById('detail-content-area'); 
    
    if (contactItems.length > 0 && detailContentArea) {
        
        const updateContactDetails = (selectedItem) => {
            // Lee el contenido HTML del atributo data-content (de index.html)
            const newContent = selectedItem.getAttribute('data-content');
            
            if (newContent) {
                // 1. Deselecciona todos los ítems
                contactItems.forEach(item => {
                    item.classList.remove('selected');
                });
                
                // 2. Marca el ítem actual como seleccionado
                selectedItem.classList.add('selected');
                
                // 3. Inyecta el nuevo contenido
                detailContentArea.innerHTML = newContent;
            }
        };
        
        // Asigna el evento click a cada ítem de la lista
        contactItems.forEach(item => {
            item.addEventListener('click', function() {
                updateContactDetails(this);
            });
        });
    }

});