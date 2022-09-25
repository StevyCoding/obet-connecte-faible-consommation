$.get("localhost:8080", function(data, status){
    console.log(data);
  });
new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
      labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
      datasets: [{ 
          data: [86,114,106,106,107,111,133,221,783,2478],
          label: "temperature (C°)",
          borderColor: "#3e95cd",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Evolution de la temperature de la piece'
      }
    }
  });