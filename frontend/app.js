document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([51.505, -0.09], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var incidents = [];
    var currentPage = 0;
    var itemsPerPage = 50;
    var currentFilter = '';
    var currentWeaponFilter = '';

    fetch('http://localhost:3022/api/incidents')
        .then(response => response.json())
        .then(data => {
            incidents = data.map(element => ({
                location: element.city,
                date: `${element.iyear}-${element.imonth}-${element.iday}`,
                description: `An event with ${element.fatalities} fatalities, weapon=${element.weaponType}`,
                latitude: element.latitude,
                longitude: element.longitude,
                fatalities: element.fatalities,
                region: element.region
            }));
            updateFilteredIncidents();
            createHeatmap();
            drawChart();
        })
        .catch(error => console.error('Error fetching incidents:', error));

    function createHeatmap() {
        var heatPoints = incidents.map(incident => [incident.latitude, incident.longitude, Math.exp(incident.fatalities + 1)]);
        L.heatLayer(heatPoints, { radius: 25 }).addTo(map);
    }

    function drawChart() {
        var regions = {};
        incidents.forEach(incident => {
            regions[incident.region] = (regions[incident.region] || 0) + 1;
        });

        var ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(regions),
                datasets: [{
                    label: '# of Incidents',
                    data: Object.values(regions),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateFilteredIncidents() {
        var filteredIncidents = incidents.filter(incident =>
            incident.location.toLowerCase().includes(currentFilter.toLowerCase()) &&
            incident.description.toLowerCase().includes(currentWeaponFilter.toLowerCase())
        );
        setupPagination(filteredIncidents);
        populateIncidents(filteredIncidents);
    }

    function populateIncidents(filteredIncidents) {
        var listContainer = document.getElementById('incident-list');
        listContainer.innerHTML = '';

        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        filteredIncidents.slice(startIndex, endIndex).forEach(incident => {
            var incidentEntry = document.createElement('div');
            incidentEntry.className = 'incident';
            incidentEntry.textContent = `${incident.date} - ${incident.location}: ${incident.description}`;
            listContainer.appendChild(incidentEntry);
        });
    }

    function setupPagination(filteredIncidents) {
        var paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        var prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 0;
        prevButton.addEventListener('click', () => {
            currentPage--;
            populateIncidents(filteredIncidents);
        });
        paginationContainer.appendChild(prevButton);

        var nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage >= Math.floor(filteredIncidents.length / itemsPerPage);
        nextButton.addEventListener('click', () => {
            currentPage++;
            populateIncidents(filteredIncidents);
        });
        paginationContainer.appendChild(nextButton);
    }

    // Filter inputs
    var filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'Filter by location...';
    filterInput.oninput = function () {
        currentFilter = this.value;
        currentPage = 0;
        updateFilteredIncidents();
    };

    var weaponTypeInput = document.createElement('input');
    weaponTypeInput.type = 'text';
    weaponTypeInput.placeholder = 'Filter by weapon type...';
    weaponTypeInput.oninput = function () {
        currentWeaponFilter = this.value;
        currentPage = 0;
        updateFilteredIncidents();
    };
    var mapElement = document.getElementById('map');
    mapElement.parentNode.insertBefore(filterInput, mapElement.nextSibling);
    mapElement.parentNode.insertBefore(weaponTypeInput, filterInput.nextSibling);
});
