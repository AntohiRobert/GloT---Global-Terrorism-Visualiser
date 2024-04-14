document.addEventListener('DOMContentLoaded', function() {
    //map div
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    //pct pt demo, cu scara intensitate
    var heatPoints = [
    [51.5, -0.09, 100000], // London
    [48.8566, 2.3522, 5], // Paris
    [40.7128, -74.0060, 10], // New York
    ];

    var heat = L.heatLayer(heatPoints, {radius: 25}).addTo(map);

    //chart
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Europe', 'North America', 'Asia', 'Africa', 'South America', 'Australia'],
            datasets: [{
                label: '# of Terrorist Incidents(without Antarctica)',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
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
    // incidente de proba
    var incidents = [
        {location: "London", date: "2024-01-01", description: "An intense event occurred."},
        {location: "Paris", date: "2024-01-02", description: "A mild incident."},
        {location: "New York", date: "2024-01-03", description: "A moderate event."}
    ];

    //lista incidente
    function populateIncidents(filter) {
        var listContainer = document.getElementById('incident-list');
        listContainer.innerHTML = ''; // clear
        var filteredIncidents = incidents.filter(incident => incident.location.toLowerCase().includes(filter.toLowerCase()));

        filteredIncidents.forEach(function(incident) {
            var incidentEntry = document.createElement('div');
            incidentEntry.className = 'incident';
            incidentEntry.textContent = `${incident.date} - ${incident.location}: ${incident.description}`;
            listContainer.appendChild(incidentEntry);
        });
    }

    // initial
    populateIncidents('');

    // filtru
    var filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'Filter by location...';
    filterInput.oninput = function() {
        populateIncidents(this.value);
    };

    var mapElement = document.getElementById('map');
    mapElement.parentNode.insertBefore(filterInput, mapElement.nextSibling);
n
});
