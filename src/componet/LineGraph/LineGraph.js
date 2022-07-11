import React, {useState, useEffect} from 'react';
import './LineGraph.css';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import Chart from 'chart.js/auto';



const options = {
    plugins: {
        title: {
            display: false,
            text: 'Chart Title'
        },
        legend: {
            display: false,
          },
    },
    
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0.0"); 
        },
      },
    },
    scales: {
      x: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      y: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

const buildChartData=( data, casesType) =>{
    let chartData =[];
     let lastDataPoint;
    
    for(let date in data.cases){
         if (lastDataPoint){
             const newDataPoint={
                 x:date,
                 y:data[casesType][date]-lastDataPoint,
             };
             chartData.push(newDataPoint);

         }
         lastDataPoint =data[casesType][date]   
         
     }
     return chartData;

 }

function LineGraph({casesType, ...props}) {
    const[data, setData]= useState({});


    useEffect(() => {
        const fetchData = async () =>{
           await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response)=>response.json())
            .then(data=>{
              let chartData = buildChartData(data, casesType);
              setData(chartData);
      
            })

        }
        fetchData();
    
    }, [casesType]);
    

  return (
    <div className={props.className}>
        {data?.length > 0 && (
             <Line
             data={{
                 datasets:[{
                     data:data,
                     backgroundColor: "rgba(204, 16, 52, 0.5)",
                     borderColor: "#CC1034",
                 }]
             }}
             options={options}

         />

        )}
       
    </div>
  )
}

export default LineGraph