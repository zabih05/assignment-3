var app = angular.module('app', []);

google.load("visualization", "1", {packages:["corechart"]});

app.controller('MainController', ['$scope', '$http',  function($scope, $http) {
  $http.get('/houseprice').success(function(data){
  
   formatDataTable(data);
  });
}]);

function formatDataTable(chartdata) {
  var data = [];
  var header = ['year', 'index'];
  
  data.push(header);
  
  for (var i = 0; i < chartdata.length; i++) {
    var temp = [];
    temp.push(chartdata[i].Year);
    temp.push(chartdata[i].index);
    data.push(temp);
  }
  
  var g_data = google.visualization.arrayToDataTable(data, false);
  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(g_data, getOptions());
}

function getOptions()
{
     var options = {
        title: 'Housing Price Indices in California for 2010-2015',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Year + Quarter',
          minValue: 0
        },
        vAxis: {
          title: 'Index (in thousands)'
        }
      };

    return options;
}