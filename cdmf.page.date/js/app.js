const loggedUser = '{{@user.username}}';
    let hostName = 'http://localhost:5000';
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const headerValue = urlParams.get('header');
    const terminalID = urlParams.get('terminalID');
    const field = urlParams.get('field');
    const tab = urlParams.get('tab');
    const first_field = urlParams.get("first_field");
    const setDate = urlParams.get("setDate");
    const totalHeader = document.getElementById("total-header");
    const terminal = document.getElementById("terminal");
    let currentPage = 1;
    let totalData = 0;
    let pageLimit = 15;

    function generatePagination(pagination, func_name) {
      const paginationNav = document.querySelector(".pagnation_nav");
      paginationNav.innerHTML = '';

      const paginationContainer = document.createElement("nav");
      paginationContainer.setAttribute("aria-label", "Page navigation example");

      const paginationList = document.createElement("ul");
      paginationList.classList.add("pagination", "justify-content-end");

      // Previous button
      if (pagination.prev) {
        const previousBtn = document.createElement("li");
        previousBtn.classList.add("page-item");
        previousBtn.innerHTML = `<a class="page-link previous" href="#" tabindex="-1" aria-disabled="true">Previous</a>`;
        previousBtn.addEventListener("click", () => {
          func_name(pagination.prev.page, pageLimit);
        });
        if (!pagination.prev) {
          previousBtn.classList.add("disabled");
        }
        paginationList.appendChild(previousBtn);
      }

      // Page number buttons
      for (let i = 1; i <= Math.ceil(totalData / pageLimit); i++) {
        const pageNumberItem = document.createElement("li");
        pageNumberItem.classList.add("page-item");
        pageNumberItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageNumberItem.addEventListener("click", () => {
          func_name(i, pageLimit);
        });
        paginationList.appendChild(pageNumberItem);
      }

      // Next button
      if (pagination.next) {
        const nextBtn = document.createElement("li");
        nextBtn.classList.add("page-item");
        nextBtn.innerHTML = `<a class="page-link next" href="#">Next</a>`;
        nextBtn.addEventListener("click", () => {
          func_name(pagination.next.page, pageLimit);
        });
        if (!pagination.next) {
          nextBtn.classList.add("disabled");
        }
        paginationList.appendChild(nextBtn);
      }

      paginationContainer.appendChild(paginationList);
      paginationNav.appendChild(paginationContainer);
    }


    function customExport() {
      var header = Array.from(document.querySelectorAll("#example th")).map(th => th.textContent);
      var footer = Array.from(document.querySelectorAll("#example tfoot td")).map(td => td.textContent);
      var body = Array.from(document.querySelectorAll("#example tbody tr")).map(tr => Array.from(tr.children).map(td => td.textContent));

      body = body.map(row => row.map((cell, i) => i === 1 ? `"${cell}"` : cell));

      var totalAmountRow = Array(header.length).fill('');
      totalAmountRow[header.indexOf('amount')] = document.getElementById("total-amount").textContent;
      body.push(totalAmountRow);

      var data = [header].concat(body, [footer]);
      var csvContent = "data:text/csv;charset=utf-8,";
      data.forEach(function (row) {
        csvContent += row.join(",") + "\n";
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    if (tab === "1") {
      totalHeader.textContent = field + " " + headerValue;
      terminal.textContent = "Terminal: " + terminalID;

      function getTransactionDetailsByDate(pageNumber, limit) {
        axios
          .get(`${hostName}/api/transactions/get_transaction_details_by_date?terminalID=${terminalID}&headerValue=${headerValue}&created=${first_field}&loggedUser=${loggedUser}&page=${pageNumber}&limit=${limit}`)
          .then(response => {
            const data = response.data.data;
            const metadata = response.data.metadata;
            totalData = metadata.total;
            currentPage = metadata.currentPage;
            const tableBody = document.getElementById("table-body");
            const fields = ["terminalId", "formattedDate", "rrn", "customer_name", "name", "payment_method", "amount", "status", "response"];
            let totalAmount = 0;

            tableBody.innerHTML = '';

            data.forEach(transaction => {
              const row = document.createElement("tr");

              fields.forEach(field => {
                const cell = document.createElement("td");
                cell.textContent = transaction[field];
                row.appendChild(cell);
              });

              const transactionAmount = parseFloat(transaction["amount"]);

              if (!isNaN(transactionAmount)) {
                totalAmount += transactionAmount;
              }
              tableBody.appendChild(row);
            });

            const totalAmountElement = document.getElementById("total-amount");
            totalAmountElement.textContent = "Total: " + totalAmount.toFixed(2);
            generatePagination(metadata.pagination, getTransactionDetailsByDate);

          })
          .catch(error => {
            console.log("ERROR", error);
          });
      }
      document.getElementById('export-button').addEventListener('click', customExport);

      $(document).ready(function () {
        getTransactionDetailsByDate(1, 15);
      });

    }

    else if (tab == "2") {

      totalHeader.textContent = field + " " + headerValue;
      function get_all_transactions_by_date(pageNumber, limit) {
        axios
          .get(`${hostName}/api/transactions/get_all_transactions_by_date?headerValue=${headerValue}&created=${setDate}&loggedUser=${loggedUser}&page=${pageNumber}&limit=${limit}`)
          .then(response => {
            const data = response.data.data;
            const metadata = response.data.metadata;
            totalData = metadata.total;
            currentPage = metadata.currentPage;
            const tableBody = document.getElementById("table-body");

            const fields = ["formattedDate", "rrn", "customer_name", "merchantId", "payment_method", "amount", "status", "terminalId", "response"];
            let totalAmount = 0;
            tableBody.innerHTML = ''; 
            data.forEach(transaction => {
              const row = document.createElement("tr");

              fields.forEach(field => {
                const cell = document.createElement("td");
                cell.textContent = transaction[field];
                row.appendChild(cell);
              });

              const transactionAmount = parseFloat(transaction["amount"]);

              if (!isNaN(transactionAmount)) {
                totalAmount += transactionAmount;
              }
              tableBody.appendChild(row);
            });

            const totalAmountElement = document.getElementById("total-amount");
            totalAmountElement.textContent = "Total: " + totalAmount.toFixed(2);
            generatePagination(metadata.pagination, get_all_transactions_by_date);
            
          })
          .catch(error => {
            console.log("ERROR", error);
          });
      }

      document.getElementById('export-button').addEventListener('click', customExport);


      $(document).ready(function () {
        get_all_transactions_by_date(1, 15);
      });

    }
