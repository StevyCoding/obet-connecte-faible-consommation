import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

let label: string[] = ["1", "2"];
let label2: string[] = ["1", "2"];
let label3: string[] = ["1", "2"];

let temperature: any[] = [1, 2];
let humidite: any[] = [1, 2];
let gaz: any[] = [1, 2];

let bm680: any[] = [];
declare var $: any;
declare var Gauge: any;


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})

export class LineChartComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('canvas2') canvas2: ElementRef;
  @ViewChild('canvas3') canvas3: ElementRef;

  public chart: any;
  public chart2: any;
  public chart3: any;

  public avgTemp: any;
  public avgHum: any;
  public avgGaz: any;


  constructor(private _httpClient: HttpClient) { }
  ngOnInit() {

  }
  ngAfterViewInit() {
    this._httpClient.get<any>('http://127.0.0.1:8080').subscribe({
      next: data => {
        bm680 = data.bm680;
        this.createChart();
        this.createChartGaz();
        this.createChartHumidite();


      },
      error: error => {

      }
    })

  }

  createChart() {


    bm680.forEach((element) => {
      temperature.push(element.temperature);
      label.push(element.heure);
      console.log
    })


    var ctx = this.canvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: label,
        datasets: [
          {
            label: "temperature",
            data: temperature,
            backgroundColor: 'rgb(250,128,114)',
            borderColor: 'rgb(250,128,114)',
          },

        ]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        }
      }

    });
    const sum = temperature.reduce((a, b) => a + b, 0);
    this.avgTemp = (sum / temperature.length) || 0;
    var avg  =  this.avgTemp;
   Gauge(document.getElementById("gauge-demo"),{
      dialRadius: 40,
      dialStartAngle: 135,
      dialEndAngle: 45,
      value: avg,
      max: 100,
      min: 0,
      valueDialClass: "value",
      valueClass: "value-text",
      dialClass: "dial",
      gaugeClass: "gauge",
      showValue: true,
      gaugeColor: null,
      label: function(value: number) {return Math.round(avg) + "\n C°" ;} // returns a string label that will be rendered in the center
  });
  }

  createChartHumidite() {
    bm680.forEach((element) => {
      humidite.push(element.humidite);
      label2.push(element.heure);
      console.log
    })
    var ctx = this.canvas2.nativeElement.getContext('2d');
    this.chart2 = new Chart(ctx, {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: label2,
        datasets: [
          {
            label: "humidite",
            data: humidite,
            backgroundColor: 'rgb(0,191,255)',

            borderColor: 'rgb(0,191,255)',
          },

        ]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        }
      }

    });
    var sum = humidite.reduce((a, b) => a + b, 0);
    this.avgHum = (sum / humidite.length) || 0;
    var avg  =  this.avgHum;
   Gauge(document.getElementById("gauge-demo2"),{
      dialRadius: 40,
      dialStartAngle: 135,
      dialEndAngle: 45,
      value: avg,
      max: 100,
      min: 0,
      valueDialClass: "value",
      valueClass: "value-text",
      dialClass: "dial",
      gaugeClass: "gauge",
      showValue: true,
      gaugeColor: null,
      label: function(value: number) {return Math.round(avg) + "\n %" ;} // returns a string label that will be rendered in the center
  });
  }

  createChartGaz() {
    bm680.forEach((element) => {
      gaz.push(element.pression);
      label3.push(element.heure);
      console.log
    })
    var ctx = this.canvas3.nativeElement.getContext('2d');
    this.chart3 = new Chart(ctx, {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: label3,
        datasets: [
          {
            label: "gaz",
            data: gaz,
            backgroundColor: 'rgb(255,165,0)',
            borderColor: 'rgb(255,165,0)',
          },

        ]
      },
      options: {

        elements: {
          point: {
            radius: 0
          }
        }
      }

    });
    var sum = gaz.reduce((a, b) => a + b, 0);
    this.avgGaz = (sum / gaz.length) || 0;
    var avg  =  this.avgGaz;
   Gauge(document.getElementById("gauge-demo3"),{
      dialRadius: 40,
      dialStartAngle: 135,
      dialEndAngle: 45,
      value: avg,
      max: 100,
      min: 0,
      valueDialClass: "value",
      valueClass: "value-text",
      dialClass: "dial",
      gaugeClass: "gauge",
      showValue: true,
      gaugeColor: null,
      label: function(value: number) {return Math.round(avg) + "" ;} // returns a string label that will be rendered in the center
  });
  }

}




