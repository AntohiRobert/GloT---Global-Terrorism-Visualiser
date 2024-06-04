document.addEventListener('DOMContentLoaded', function () {
    // Initialize map
    var map = L.map('map').setView([51.505, -0.09], 2); // Set initial zoom level to 2 for a global view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var incidents = []; // This will hold the fetched incidents

    // Fetch incidents from the backend
    fetch('http://localhost:3006/api/incidents')
        .then(response => response.json())
        .then(data => {
            /*
            // incidente de proba
            var incidents = [
                { location: "London", date: "2024-01-01", description: "An intense event occurred." },
                { location: "Paris", date: "2024-01-02", description: "A mild incident." },
                { location: "New York", date: "2024-01-03", description: "A moderate event." }
            ];
            // Populate map with incidents
            //pct pt demo, cu scara intensitate
            var heatPoints = [
                [51.5, -0.09, 100000], // London
                [48.8566, 2.3522, 5], // Paris
                [40.7128, -74.0060, 10], // New York
                ];
            */
            incidents=[];
            heatPoints=[];
            console.log(data);
            data.forEach((element) => {
                description="An event with "+element.fatalities+" fatalities, weapon="+element.weaponType;
                var event={location:element.city, date:element.date, description:description}
                incidents.push(event);
                var el=1;
                for (var i=1;i<=element.fatalities;i++)
                    el*=5;
                var heatelement=[element.latitude, element.longitude, el];
                heatPoints.push(heatelement);
                //console.log(event)
            })
            console.log(incidents);
            //incidents = data;
            var heat = L.heatLayer(heatPoints, {radius: 25}).addTo(map);
            //var heatPoints = data.map(incident => [incident.latitude, incident.longitude, 1]); // Intensity set to 1 for simplicity
            //var heat = L.heatLayer(heatPoints, { radius: 25 }).addTo(map);

            // Populate the incident list
            populateIncidents('');

            // Populate chart
            var regions = {};
            data.forEach(incident => {
                regions[incident.region] = (regions[incident.region] || 0) + 1;
            });
            var ctx = document.getElementById('chart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(regions),
                    datasets: [{
                        label: '# of Terrorist Incidents',
                        data: Object.values(regions),
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
        })
        .catch(error => console.error('Error fetching incidents:', error));

    // Function to populate the incident list
    function populateIncidents(filter) {
        var listContainer = document.getElementById('incident-list');
        listContainer.innerHTML = ''; // Clear previous entries
        var filteredIncidents = incidents.filter(incident => incident.location.toLowerCase().includes(filter.toLowerCase()));

        filteredIncidents.forEach(function (incident) {
            var incidentEntry = document.createElement('div');
            incidentEntry.className = 'incident';
            incidentEntry.textContent = `${incident.date} - ${incident.location}: ${incident.description}`;
            listContainer.appendChild(incidentEntry);
        });
    }

    // Initial population
    populateIncidents('');

    // Filter input
    var filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'Filter by location...';
    filterInput.oninput = function () {
        populateIncidents(this.value);
    };

    var mapElement = document.getElementById('map');
    mapElement.parentNode.insertBefore(filterInput, mapElement.nextSibling);
});
