function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function highlightText(text, query) {
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
        }

        function performSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const query = searchInput.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const results = [];

        for (const [section, data] of Object.entries(searchData)) {
            const sectionResults = [];

            if (data.title.toLowerCase().includes(query)) {
            sectionResults.push({ type: 'title', content: data.title });
            }

            data.content.forEach(item => {
            if (item.toLowerCase().includes(query)) {
                sectionResults.push({ type: 'content', content: item });
            }
            });

            if (sectionResults.length > 0) {
            results.push({ section, title: data.title, results: sectionResults });
            }
        }

        displaySearchResults(results, query);
        }

        function displaySearchResults(results, query) {
        const searchResults = document.getElementById('searchResults');

        if (results.length === 0) {
            searchResults.innerHTML = `<div class="no-results">No results found for "${query}"</div>`;
            searchResults.style.display = 'block';
            return;
        }

        let html = '';
        results.forEach(result => {
            result.results.forEach(item => {
            const highlighted = highlightText(item.content, query);
            html += `
                <div class="search-result-item" onclick="navigateToSection('${result.section}')">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-content">${highlighted}</div>
                </div>
            `;
            });
        });

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
        }

        function navigateToSection(section) {
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('searchInput').value = '';
        showContent(section);
        }

        function showContent(section, clickedElement = null) {
        document.querySelectorAll('.content-view').forEach(view => {
            view.style.display = 'none';
        });

        const target = document.getElementById(`content-${section}`);
        if (target) target.style.display = 'block';

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        if (clickedElement) {
            clickedElement.classList.add('active');
        } else {
            const found = document.querySelector(`[onclick*="showContent('${section}')"]`);
            if (found) found.classList.add('active');
        }

        const titles = {
            'installation': 'Installation',
            'getting-started': 'Getting Started',
            'products': 'Product Catalog',
            'orders': 'Order Management',
            'analytics': 'Analytics & Reports',
            'messages': 'Messages',
            'settings': 'Settings',
            'help': 'Help & Support'
        };

        if (titles[section]) {
            document.getElementById('pageTitle').textContent = titles[section];
            document.getElementById('breadcrumb').textContent = titles[section];
        }

        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('active');
        }
        }

        function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('active');
        }

        // Sidebar close on outside click (mobile)
        document.addEventListener('click', function (e) {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.querySelector('.mobile-menu-toggle');

        if (
            window.innerWidth <= 768 &&
            !sidebar.contains(e.target) &&
            !toggle.contains(e.target) &&
            sidebar.classList.contains('active')
        ) {
            sidebar.classList.remove('active');
        }
        });

        // Handle resize
        window.addEventListener('resize', function () {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
        });

        // Prevent closing when clicking inside search results
        document.getElementById('searchResults').addEventListener('click', function (e) {
        e.stopPropagation();
        });