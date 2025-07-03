document.addEventListener('DOMContentLoaded', () => {
    // Hide loader after page load
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        });
    }

    // Close flash info
    const closeFlash = document.getElementById('close-flash');
    if (closeFlash) {
        closeFlash.addEventListener('click', () => {
            const flashInfo = document.getElementById('flash-info');
            if (flashInfo) {
                flashInfo.classList.add('animate__animated', 'animate__fadeOut');
                setTimeout(() => {
                    flashInfo.style.display = 'none';
                }, 500);
            }
        });
    }

    // Interactive Map with Leaflet
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof epns !== 'undefined') {
        mapContainer.style.height = '400px';
        const map = L.map('map').setView([6.8229, -5.2767], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        const regionCoords = {
            'Abidjan': [5.3602, -4.0082],
            'Yamoussoukro': [6.8797, -6.4503]
        };
        epns.forEach(epn => {
            const coords = regionCoords[epn.region] || [5.3602, -4.0082];
            L.marker(coords)
                .addTo(map)
                .bindPopup(`<b>${epn.nom}</b> (${epn.sigle})<br>${epn.region}<br><a href="mailto:${epn.email}">Contact</a>`);
        });
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }

    // Organigram Animation
    const orgNodes = document.querySelectorAll('.org-node');
    if (orgNodes.length) {
        orgNodes.forEach((node, index) => {
            setTimeout(() => {
                node.classList.add('animate__animated', 'animate__fadeInDown');
            }, index * 100);
        });
    }

    // Historique Timeline Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length) {
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate__animated', 'animate__fadeInUp');
            }, index * 100);
        });
    }

    // Animations for Events
    const animatedElements = document.querySelectorAll('[data-animate-delay]');
    if (animatedElements.length) {
        animatedElements.forEach(element => {
            const delay = parseInt(element.getAttribute('data-animate-delay')) || 0;
            setTimeout(() => {
                element.classList.add('animate__animated', 'animate__fadeInUp');
            }, delay);
        });
    }

    // Calendar Initialization
    const calendarEl = document.getElementById('calendar');
    if (calendarEl && typeof evenements !== 'undefined') {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            height: 400,
            events: evenements.map(event => ({
                title: event.title,
                start: event.date,
                classNames: [event.status],
                extendedProps: { id: event.id }
            })),
            eventClick: function(info) {
                window.location.href = `/event/${info.event.extendedProps.id}`;
            },
            locale: 'fr',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
            }
        });

        // Event Filter
        const eventStatusFilter = document.getElementById('event-status-filter');
        if (eventStatusFilter) {
            eventStatusFilter.addEventListener('change', () => {
                const status = eventStatusFilter.value;
                calendar.getEvents().forEach(event => {
                    const eventStatus = event.classNames[0];
                    event.setProp('display', (!status || eventStatus === status) ? 'auto' : 'none');
                });
            });
        }

        calendar.render();
    }

    // Services Search Functionality
    const searchService = document.getElementById('search-service');
    const serviceRows = document.querySelectorAll('.service-row');
    if (searchService && serviceRows.length) {
        searchService.addEventListener('input', () => {
            const searchValue = searchService.value.toLowerCase().trim();
            serviceRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const nom = cells[0].textContent.toLowerCase();
                const fonction = cells[1].textContent.toLowerCase();
                const departement = cells[2].textContent.toLowerCase();
                const matches = nom.includes(searchValue) || fonction.includes(searchValue) || departement.includes(searchValue);
                if (matches) {
                    row.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                }
            });
        });
    }

    // EPN Filtering
    const filterForm = document.getElementById('epn-filter-form');
    if (filterForm) {
        const searchInput = document.getElementById('search-input');
        const categorySelect = document.getElementById('filter-categorie');
        const regionSelect = document.getElementById('filter-region');
        const epnCards = document.querySelectorAll('.epn-card');

        const filterEPNs = () => {
            const searchValue = searchInput.value.toLowerCase();
            const categoryValue = categorySelect.value;
            const regionValue = regionSelect.value;

            epnCards.forEach(card => {
                const nom = card.dataset.nom.toLowerCase();
                const sigle = card.dataset.sigle.toLowerCase();
                const categorie = card.dataset.categorie;
                const region = card.dataset.region;

                const matchesSearch = nom.includes(searchValue) || sigle.includes(searchValue);
                const matchesCategory = !categoryValue || categorie === categoryValue;
                const matchesRegion = !regionValue || region === regionValue;

                if (matchesSearch && matchesCategory && matchesRegion) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        };

        searchInput.addEventListener('input', filterEPNs);
        categorySelect.addEventListener('change', filterEPNs);
        regionSelect.addEventListener('change', filterEPNs);
    }

    // Document Search
    const documentSearch = document.getElementById('document-search');
    const documentResults = document.getElementById('document-results');
    if (documentSearch && documentResults) {
        documentSearch.addEventListener('input', () => {
            const searchValue = documentSearch.value.toLowerCase();
            documentResults.innerHTML = '';
            const mockResults = ['Rapport financier 2024', 'PV de réunion - 2025-01'].filter(item => item.toLowerCase().includes(searchValue));
            mockResults.forEach(result => {
                const li = document.createElement('li');
                li.className = 'list-group-item animate__animated';
                li.textContent = result;
                documentResults.appendChild(li);
            });
        });
    }

    // Validation Function
    window.validateDocument = function(docId) {
        console.log('Validating document:', docId);
    };

    // Dropdown behavior
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.parentElement.addEventListener('mouseenter', () => {
            const dropdownMenu = toggle.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                dropdownMenu.classList.add('show');
            }
        });

        toggle.parentElement.addEventListener('mouseleave', () => {
            const dropdownMenu = toggle.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                dropdownMenu.classList.remove('show');
            }
        });

        toggle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const dropdownMenu = toggle.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                dropdownMenu.classList.toggle('show');
            }
        });
    });

    // Ensure nav-link clicks redirect
    const navLinks = document.querySelectorAll('a.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const closeChatbot = document.getElementById('close-chatbot');
    let welcomeMessageShown = false;

    const typeWelcomeMessage = (text, element, speed = 50) => {
        let i = 0;
        const typing = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        };
        typing();
    };

    const appendMessage = (message, type) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
            appendMessage(message, 'user');
            chatInput.value = '';
            setTimeout(() => {
                appendMessage(`Vous avez dit : ${message}`, 'bot');
            }, 500);
        }
    };

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            if (!welcomeMessageShown) {
                setTimeout(() => {
                    const welcomeDiv = document.createElement('div');
                    welcomeDiv.className = 'chat-message bot';
                    chatMessages.appendChild(welcomeDiv);
                    typeWelcomeMessage('Bienvenue sur l’assistant DGEPN ! Comment puis-je vous aider ?', welcomeDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    welcomeMessageShown = true;
                }, 100);
            }
        });
    }

    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    if (closeChatbot) {
        closeChatbot.addEventListener('click', () => {
            const chatbot = document.getElementById('chatbot');
            if (chatbot) {
                const collapse = new bootstrap.Collapse(chatbot, { toggle: false });
                collapse.hide();
            }
        });
    }
});