document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([51.505, -0.09], 2); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var incidents = [];
    var currentPage = 0;
    var itemsPerPage = 50;

    // Fetching incident data from the backend
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
            populateIncidents();
            setupPagination();
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
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)'
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
    }

    function populateIncidents() {
        var listContainer = document.getElementById('incident-list');
        listContainer.innerHTML = '';
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        incidents.slice(startIndex, endIndex).forEach(incident => {
            var incidentEntry = document.createElement('div');
            incidentEntry.className = 'incident';
            incidentEntry.textContent = `${incident.date} - ${incident.location}: ${incident.description}`;
            listContainer.appendChild(incidentEntry);
        });
    }

    function setupPagination() {
        var paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';
        var prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 0;
        prevButton.addEventListener('click', () => {
            currentPage--;
            populateIncidents();
        });
        paginationContainer.appendChild(prevButton);

        var nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage >= Math.floor(incidents.length / itemsPerPage);
        nextButton.addEventListener('click', () => {
            currentPage++;
            populateIncidents();
        });
        paginationContainer.appendChild(nextButton);
    }
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
