document.addEventListener("DOMContentLoaded", function () {
    var options = {
      chart: {
        type: 'line',
        height: 250,
        toolbar: { show: false }
      },
      series: [
        {
          name: 'Total',
          data: [5, 6, 7, 10, 6]
        },
        {
          name: 'Pendentes',
          data: [3, 3, 4, 5, 4]
        },
        {
          name: 'Em análise',
          data: [2, 3, 3, 5, 3]
        },
        {
          name: 'Resolvidas',
          data: [0, 1, 2, 4, 4]
        }
      ],
      xaxis: {
        categories: [
          '8 HORAS ATRÁS',
          '6 HORAS ATRÁS',
          '4 HORAS ATRÁS',
          '2 HORAS ATRÁS',
          'NESTE MOMENTO'
        ]
      },
      colors: ['#C084FC', '#0EA5E9', '#38BDF8', '#1E40AF'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 4
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      }
    };
  
    var chart = new ApexCharts(document.querySelector("#profit"), options);
    chart.render();
  });
  