document.addEventListener('DOMContentLoaded', function() {
    const filterBtn = document.getElementById('filter-btn');
    const filterArea = document.getElementById('filter-area');
    const searchBtn = document.getElementById('search');
    const query = document.getElementById('query');
    const param = document.getElementById('param');
    const priority = document.getElementById('priority');
    const date = document.getElementById('date');
    const place = document.getElementById('place');
    const apply = document.getElementById('apply');
    const clear = document.getElementById('clear');
    const list = document.getElementById('list');

    filterBtn.addEventListener('click', function() {
        filterArea.classList.toggle('show');
    });

    searchBtn.addEventListener('click', doSearch);
    query.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            doSearch();
        }
    });

    apply.addEventListener('click', doSearch);

    clear.addEventListener('click', function() {
        priority.value = 'high';
        date.value = '';
        place.value = '';
        doSearch();
    });

    const data = [
        {
            id: 1,
            title: 'Advanced Web Development Course',
            content: 'Learn modern web development techniques including HTML5, CSS3, and JavaScript frameworks.',
            param1: 'Development',
            param2: 'Education',
            param3: 'Web',
            priority: 'high',
            expiry: '2025-06-15',
            location: 'Online'
        },
        {
            id: 2,
            title: 'Project Management Software',
            content: 'Comprehensive solution for tracking tasks, milestones, and team collaboration.',
            param1: 'Software',
            param2: 'Management',
            param3: 'Business',
            priority: 'medium',
            expiry: '2025-05-20',
            location: 'Global'
        },
        {
            id: 3,
            title: 'Data Science Workshop',
            content: 'Hands-on workshop covering statistical analysis, machine learning, and data visualization.',
            param1: 'Education',
            param2: 'Data',
            param3: 'Science',
            priority: 'high',
            expiry: '2025-04-30',
            location: 'New York'
        },
        {
            id: 4,
            title: 'Mobile App Development',
            content: 'Create cross-platform mobile applications using React Native and Flutter.',
            param1: 'Development',
            param2: 'Mobile',
            param3: 'Applications',
            priority: 'medium',
            expiry: '2025-07-10',
            location: 'San Francisco'
        },
        {
            id: 5,
            title: 'Artificial Intelligence Conference',
            content: 'Annual conference featuring the latest advances in AI research and applications.',
            param1: 'Technology',
            param2: 'Research',
            param3: 'Conference',
            priority: 'low',
            expiry: '2025-09-15',
            location: 'London'
        }
    ];

    function doSearch() {
        const searchText = query.value.toLowerCase();
        const selectedParam = param.value;
        const selectedPriority = priority.value;
        const selectedDate = date.value;
        const selectedPlace = place.value.toLowerCase();

        const results = data.filter(item => {
            const matchText = 
                !searchText || 
                item.title.toLowerCase().includes(searchText) ||
                item.content.toLowerCase().includes(searchText) ||
                item[selectedParam].toLowerCase().includes(searchText);

            const matchPriority = !selectedPriority || item.priority === selectedPriority;
            
            const matchDate = !selectedDate || 
                (new Date(item.expiry) >= new Date(selectedDate));
            
            const matchPlace = !selectedPlace || 
                item.location.toLowerCase().includes(selectedPlace);

            return matchText && matchPriority && matchDate && matchPlace;
        });

        showResults(results);
    }

    function showResults(results) {
        list.innerHTML = '';

        if (results.length === 0) {
            list.innerHTML = '<div class="empty">No results found. Try different search terms or filters.</div>';
            return;
        }

        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'item';

            const expiryDate = new Date(result.expiry);
            const nice_date = expiryDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            item.innerHTML = `
                <div class="title">${result.title}</div>
                <div class="content">${result.content}</div>
                <div class="details">
                    <div class="detail">
                        <i class="fas fa-flag"></i> 
                        Priority: <span>${result.priority.charAt(0).toUpperCase() + result.priority.slice(1)}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-calendar-alt"></i> 
                        Expires: ${nice_date}
                    </div>
                    <div class="detail">
                        <i class="fas fa-map-marker-alt"></i> 
                        ${result.location}
                    </div>
                </div>
            `;

            list.appendChild(item);
        });
    }

    showResults(data);
});
document.addEventListener('mousemove', function (e) {
    const cursor = document.getElementById('custom-cursor');
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});