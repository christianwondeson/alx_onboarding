function getColor(data) {
    switch (data.color) {
        case 'green':
            return 'green';
        case 'blue':
            return '#11375B';
        case 'red':
            return 'red';
        case 'yellow':
            return 'yellow';
        default:
            return 'gray';
    }
}

function getStatus(data) {
    switch (data) {
        case 'Number of terminals in use':
            return 'in_use';
        case 'Number of terminals in Idle':
            return 'in_idle';
        case 'Number of terminals in low memory':
            return 'in_low_memory';
        case 'Number of terminals in low battery':
            return 'in_low_battery';
    }
}

function createAndFillComponent(data, containerId) {
    const container = document.getElementById(containerId);
    const firstComponent = document.createElement('div');
    firstComponent.classList.add('first_component');

    const title = document.createElement('h3');
    title.innerText = data.name;

    const amount = document.createElement('h3');
    amount.innerText = data.count;

    const myProgress = document.createElement('div');
    myProgress.id = 'myProgress';

    const myBar = document.createElement('div');
    myBar.id = `myBar_${containerId}`;
    myBar.style.width = data.percentage;
    myBar.style.height = '18px';
    myBar.style.backgroundColor = getColor(data);
    myBar.style.transition = 'width 0.3s ease';
    myBar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

    myProgress.appendChild(myBar);

    const componentFooters = document.createElement('div');
    componentFooters.classList.add('component_footers');

    const h2 = document.createElement('h2');
    const amountSpan = document.createElement('span');
    amountSpan.innerText = data.count;
    const totalSpan = document.createElement('span');
    totalSpan.innerText = data.total;
    h2.appendChild(amountSpan);
    h2.appendChild(document.createTextNode(' / '));
    h2.appendChild(totalSpan);

    const percentage = document.createElement('h3');
    percentage.innerText = data.percentage;

    componentFooters.appendChild(h2);
    componentFooters.appendChild(percentage);
    firstComponent.appendChild(title);
    firstComponent.appendChild(amount);
    firstComponent.appendChild(myProgress);
    firstComponent.appendChild(componentFooters);
    container.appendChild(firstComponent);

    firstComponent.addEventListener('click', () => {
        const status = getStatus(data.name);
        const url = `/devicemgt/device/chart_data/?status=${encodeURIComponent(status)}`;
        window.location.href = url;
    });
}

axios.get(`http://localhost:5000/api/devices/get_devices_status_for_card/${loggedUser}`)
    .then(response => {
        const data = response.data;
        for (let i = 0; i < data.top_data.length; i++) {
            createAndFillComponent(data.top_data[i], 'top_component');
            createAndFillComponent(data.bottom_data[i], 'bottom_component');
        }
    })
    .catch(error => {
        console.error("ERROR", error);
    });

$(document).ready(() => {
    const view_devices_btn = $('#view-devices-button');
    const view_devices_lbl = $('#custom-view-devices-button');

    if (loggedUser === "admin") {
        view_devices_btn.hide();
    } else {
        view_devices_btn.hide();
        view_devices_lbl.hide();
    }

    view_devices_btn.click(() => {
        const url = "/devicemgt/devices/edit_info";
        window.location.href = url;
    });

    axios.get(`http://localhost:5000/api/devices/get_devices_details_for_data_table/${loggedUser}`)
        .then(response => {
            const data = response.data;
            const tableBody = $("#table-body");
            const fields = ["registration_time", "serial_number", "type", "model", "terminal_status", "city", "merchant"];

            data.forEach(devices => {
                const row = $('<tr>').addClass("data-row");

                fields.forEach(field => {
                    const cell = $('<td>').addClass("clickable-cell");

                    if (field === "terminal_status") {
                        const statusDiv = $('<div>').addClass("terminal-status");
                        const statusCol = $('<div>').addClass("status-col");

                        if (devices[field] === "Online") {
                            statusCol.css('backgroundColor', 'green');
                        } else if (devices[field] === "Offline") {
                            statusCol.css('backgroundColor', 'gray');
                        } else if (devices[field] === "In Maintenance") {
                            statusCol.css('backgroundColor', 'orange');
                        } else {
                            statusCol.css('backgroundColor', 'red');
                        }

                        const statusText = $('<div>').text(devices[field]);
                        statusDiv.append(statusCol, statusText);
                        cell.append(statusDiv);
                    } else {
                        cell.text(devices[field]);
                    }

                    cell.click(() => {
                        const url = `/devicemgt/device/android?id=${devices.device_id}`;
                        window.location.href = url;
                    });

                    row.append(cell);
                });

                tableBody.append(row);
            });

            $("#example").DataTable().destroy();
            $("#example").DataTable({
                language: {
                    search: "",
                    searchPlaceholder: "Search",
                }
            });
        })
        .catch(error => {
            console.error("ERROR", error);
        });
});
