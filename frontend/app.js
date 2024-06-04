document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([51.505, -0.09], 2); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var incidents = [];

    // backend
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
            incidents = [];
            heatPoints = [];
            console.log(data);
            data.forEach((element) => {
                description = "An event with " + element.fatalities + " fatalities, weapon=" + element.weaponType;
                var event = { location: element.city, date: element.date, description: description }
                incidents.push(event);
                var el = 1;
                for (var i = 1; i <= element.fatalities; i++)
                    el *= 5;
                var heatelement = [element.latitude, element.longitude, el];
                heatPoints.push(heatelement);
                //console.log(event)
            })
            console.log(incidents);
            //incidents = data;
            var heat = L.heatLayer(heatPoints, { radius: 25 }).addTo(map);
            //var heatPoints = data.map(incident => [incident.latitude, incident.longitude, 1]); // Intensity set to 1 for simplicity
            //var heat = L.heatLayer(heatPoints, { radius: 25 }).addTo(map);

            // populate
            populateIncidents('');

            // chart
            var regions = {};
            data.forEach(incident => {
                regions[incident.region] = (regions[incident.region] || 0) + 1;
            });
            console.log(regions);
            nrevents = [];
            Object.keys(regions).forEach(region => {
                var el = 0;
                el = regions[region];
                nrevents.push(el);
            })
            console.log(nrevents)
            var ctx = document.getElementById('chart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(regions),
                    datasets: [{
                        label: '# of Terrorist Incidents',
                        data: nrevents,
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

    // incident list
    function populateIncidents(filter, weaponTypeFilter) {
        var listContainer = document.getElementById('incident-list');
        listContainer.innerHTML = ''; // prev entries
        var filteredIncidents = incidents.filter(incident =>
            incident.location.toLowerCase().includes(filter.toLowerCase()) &&
            (!weaponTypeFilter || incident.description.toLowerCase().includes(weaponTypeFilter.toLowerCase()))
        );

        filteredIncidents.forEach(function (incident) {
            var incidentEntry = document.createElement('div');
            incidentEntry.className = 'incident';
            incidentEntry.textContent = `${incident.date} - ${incident.location}: ${incident.description}`;
            listContainer.appendChild(incidentEntry);
        });
    }

    // Filter
    var filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'Filter by location...';
    filterInput.oninput = function () {
        populateIncidents(this.value, weaponTypeInput.value);
    };

    var weaponTypeInput = document.createElement('input');
    weaponTypeInput.type = 'text';
    weaponTypeInput.placeholder = 'Filter by weapon type...';
    weaponTypeInput.oninput = function () {
        populateIncidents(filterInput.value, this.value);
    };

    var mapElement = document.getElementById('map');
    mapElement.parentNode.insertBefore(filterInput, mapElement.nextSibling);
    mapElement.parentNode.insertBefore(weaponTypeInput, filterInput.nextSibling);
    // csv
    window.exportCSV = function() {
        var csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Location,Description\n";
        incidents.forEach(function (incident) {
            csvContent += `${incident.date},${incident.location},${incident.description}\n`;
        });
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "incidents.csv");
        document.body.appendChild(link);
        link.click();
    }

    // png
    window.exportPNG = function() {
        html2canvas(document.getElementById('map')).then(function (canvas) {
            var link = document.createElement('a');
            link.download = 'map.png';
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    }

    // svg
    window.exportSVG = function() {
        var svg = document.getElementById('map').getElementsByTagName("svg")[0].outerHTML;
        var blob = new Blob([svg], { type: "image/svg+xml" });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "map.svg");
        link.click();
    }
});
