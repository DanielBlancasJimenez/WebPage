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
        
        // 1. Declaramos las variables con 'let' para poder actualizarlas
        let scrollHeight;
        let maxScrollX;
        let sectionHeight;

        // 2. Creamos una función que recalcula los tamaños actuales
        const updateDimensions = () => {
            scrollHeight = scrollHeightContainer.offsetHeight;
            maxScrollX = 3 * window.innerWidth; // 3 porque tienes 4 secciones
            sectionHeight = window.innerHeight;
        };

        // 3. Calculamos por primera vez al cargar
        updateDimensions();

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

        window.updateScroll = () => {
            const scrollY = window.scrollY;

            // Usa las variables que se actualizan dinámicamente
            const scrollProgress = scrollY / (scrollHeight - sectionHeight);
            const scrollX = Math.min(scrollProgress * maxScrollX, maxScrollX);
            scrollContainer.style.transform = `translateX(-${scrollX}px)`;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(snapToSection, 150);
            
            const currentSectionIndex = Math.round(scrollY / sectionHeight);
            updateMenuHighlight(currentSectionIndex);
        };

        window.addEventListener('scroll', window.updateScroll);

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // 4. ¡LA CLAVE ESTÁ AQUÍ! Recalculamos dimensiones antes de reposicionar
                updateDimensions(); 
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