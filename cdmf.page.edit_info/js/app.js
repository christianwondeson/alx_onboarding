function updateDeviceInfo(id, name) {
    axios
      .get(`http://localhost:5000/api/devices/update_devices/${id}/${name}`)
      .then(response => {
        if (response.data.status === "Success") {
          Swal.fire('Success', response.data.message, 'success')
        }
        else {
          Swal.fire('Error!', response.data.message, 'error')
        }

      })
      .catch(error => {
        console.log("ERROR", error);
      });

  }
  $(document).ready(function () {
    axios
      .get(`http://localhost:5000/api/devices/get_all_device_information`)
      .then(response => {
        const data = response.data;
        const tableBody = document.getElementById("table-body");
        const fields = ["id", "device_type_id", "name", "description", "updated_time", "actions"];

        data.forEach(devices => {
          const row = document.createElement("tr");
          row.classList.add("data-row");
          let clicked = false;
          fields.forEach(field => {
            const cell = document.createElement("td");
            if (field === "actions") {
              const edit_name_container = document.createElement('div');
              edit_name_container.classList.add("edit-name-container");

              const action_container = document.createElement("div");
              action_container.classList.add("action-container");

              const edit_button = document.createElement('div');
              edit_button.classList.add('edit-button');
              if (clicked === false) {
                edit_button.innerHTML = '<i class="fa fa-pencil"></i>';
              }

              edit_button.addEventListener('click', function (event) {
                if (clicked === false) {
                  clicked = true;
                  edit_button.innerHTML = '<i class="fa fa-times"></i>';

                  const name_cell = row.querySelector('.name-cell');

                  const textField = document.createElement('input');
                  textField.id = "name_field";
                  textField.type = 'text';
                  textField.value = name_cell.textContent;

                  const save_button = document.createElement('div');
                  save_button.classList.add('save-button');
                  save_button.innerHTML = '<i class="fa fa-check"></i>';


                  name_cell.innerHTML = '';
                  name_cell.appendChild(textField);
                  name_cell.appendChild(save_button);

                  save_button.addEventListener('click', function (event) {
                    let updatedName;
                    if (textField.value !== '') {
                      updatedName = textField.value;
                    }
                    name_cell.innerHTML = updatedName;
                    let id = devices['id'];

                    updateDeviceInfo(id, updatedName);
                    clicked = false;
                    edit_button.innerHTML = '<i class="fa fa-pencil"></i>';
                  });

                } else {
                  clicked = false;
                  edit_button.innerHTML = '<i class="fa fa-pencil"></i>';

                  const name_cell = row.querySelector('.name-cell');

                  const textField = name_cell.querySelector('input');
                  const save_button = name_cell.querySelector('.save-button');

                  const originalName = textField.value;
                  name_cell.innerHTML = originalName;
                }
              });

              action_container.appendChild(edit_button);
              cell.appendChild(action_container);
            } else if (field === "name") {
              cell.classList.add("name-cell");
              cell.textContent = devices[field];
            } else {
              cell.textContent = devices[field];
            }

            row.appendChild(cell);
          });

          tableBody.appendChild(row);
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
        console.log("ERROR", error);
      });
  });