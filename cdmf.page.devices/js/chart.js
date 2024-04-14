axios.get(`http://localhost:5000/api/devices/get_devices_with_status/${loggedUser}`)
      .then(response => {
        let data = response.data;
        const ctx = document.getElementById('myChart').getContext('2d');
        const xValues = ["Online", "Offline", "In Maintenance", "Defective"];
        const yValues = [data.online_count, data.offline_count, data.in_maintenance_count, data.defective_count];

        const total = yValues.reduce((a, b) => a + b, 0);
        const percentages = yValues.map(value => (value / total) * 100);

        const barColors = ["green", "gray", "orange", "red"];

        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: xValues,
            datasets: [{
              backgroundColor: barColors,
              data: yValues
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'left'
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    var label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    label += Math.round((context.parsed / total) * 100) + '%';
                    return label;
                  }
                }
              },
              title: {
                display: true,
                text: 'Terminal Status',
                color: 'black',
                font: {
                  size: 20,
                  family: 'Poppins, sans-serif'
                }
              }
            },
            layout: {
              padding: {
                right: 10
              }
            }
          }

        });
      })
      .catch(error => {
        console.log("ERROR", error);
      });