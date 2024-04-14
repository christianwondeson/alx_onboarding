const loggedUser = '{{@user.username}}';

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  let formattedDate = urlParams.get('formattedDate')
  let merchantId = urlParams.get('merchantId')

  $(document).ready(function () {
    axios
      .get(`http://localhost:5000/api/eth_switch/get_all_transaction_detail/${formattedDate}/${merchantId}/${loggedUser}`)
      .then(response => {
        const data = response.data;

        const POS = response.data.POS;
        const ETHSWITCH = response.data.ETHSWITCH;

        const tablePosBody = document.getElementById("table-pos-body");
        const fieldsPos = ["formattedDate", "merchantId", "terminalId", "amount", "status", "bank"];


        let totalAmountPos = 0;

        POS.forEach(transaction => {
          const row = document.createElement("tr");

          fieldsPos.forEach(field => {
            const cell = document.createElement("td");
            cell.textContent = transaction[field];
            row.appendChild(cell);
          });

          const transactionAmount = parseFloat(transaction["amount"]);

          if (!isNaN(transactionAmount)) {
            totalAmountPos += transactionAmount;
          }
          tablePosBody.appendChild(row);
        });

        const totalAmountElementPos = document.getElementById("total-pos-amount");
        totalAmountElementPos.textContent = "Total: " + totalAmountPos.toFixed(2);

        // Initialize the DataTable
        var table1 = $("#table_1").DataTable({
          language: {
            search: "",
            searchPlaceholder: "Search",
          },
        })

        //////////////////////////////////////////////////////////////////////////////////////

        const tableEthBody = document.getElementById("table-eth-body");
        const fieldsETH = ["formattedDate", "Transaction_Place", "Terminal_ID", "Amount", "status", "Issuer"];


        let totalAmountETH = 0;

        ETHSWITCH.forEach(transaction => {
          const row = document.createElement("tr");

          fieldsETH.forEach(field => {
            const cell = document.createElement("td");
            cell.textContent = transaction[field];
            row.appendChild(cell);
          });

          const transactionAmount = parseFloat(transaction["Amount"]);

          if (!isNaN(transactionAmount)) {
            totalAmountETH += transactionAmount;
          }
          tableEthBody.appendChild(row);
        });

        const totalAmountElementETH = document.getElementById("total-eth-amount");
        totalAmountElementETH.textContent = "Total: " + totalAmountETH.toFixed(2);

        // Initialize the DataTable
        var table2 = $("#table_2").DataTable({
          language: {
            search: "",
            searchPlaceholder: "Search",
          },
        })


      })
      .catch(error => {
        console.log("ERROR", error);
      });

  });
