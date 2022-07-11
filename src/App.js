import { Card, CardContent } from '@mui/material';
import './App.css';
import Header from './componet/Header/Header';
import InfoBox from './componet/InfoBox/InfoBox';
import Map from './componet/Map/Map';
import React, {useState, useEffect} from 'react';
import Table from './componet/Table/Table';
import { prettyPrintStat, sortData } from './componet/util';
import LineGraph from './componet/LineGraph/LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countryInfo, setCountryInfo]=useState({});
  const [country, setCountry] = useState("Worldwide");
  const [countries, setCountries] = useState([]);
  const [tableData, setTableData]= useState([]);
  const [mapCenter, setMapCenter]=useState({lat:34.80746, lng:-40.4796}); //lng:7.491302 lat: 9.072264  
  const [mapZoom, setMapZoom]=useState (3);
  const [mapCountries, setMapCountries]=useState([]);
  const[casesType, setCasesType]=useState("cases");





  useEffect(() => {
    const getCountriesData =async ()=>{
     await fetch("https://disease.sh/v3/covid-19/countries") //make a request to this endpoint and wait,
     .then ((response)=>response.json()) // get a response make sure it is in a json
     .then ((data)=>{
      const afterSorted=sortData(data);
       const countries= data.map((country)=>({ // i want to do something with the data and return an object
         name: country.country,
         value:country.countryInfo.iso2,
       }))
       setCountries(countries);
       setTableData(afterSorted);
       setMapCountries(data);

     })
     .catch((error)=>{
       alert(error);
     });
    }
  
    getCountriesData();
  }, [])

  //this piece of code is to request for the all cases endpoint when ever the page reloads and the selected options is the worldwide
  useEffect(() => {
  fetch ("https://disease.sh/v3/covid-19/all")
  .then(response=>response.json())
  .then(data=>{
    setCountryInfo(data);

  })
  
   
  }, [])
  

  const onCountryChange = async (event)=>{
    const countryCode = event.target.value;
    const url =countryCode ==="Worldwide"?
     "https://disease.sh/v3/covid-19/all":
     `https://disease.sh/v3/covid-19/countries/${countryCode}`;
     await fetch(url)
     .then((response)=>response.json())
     .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter({lat:data.countryInfo.lat, lng:data.countryInfo.long});      // console.log(data.countryInfo.lat, data.countryInfo.long);
      setMapZoom(4);

     })
   }

  
  return (
    <div className="app">
      <div className='app__left'>
      <div className='app__header'>
        <Header ChangeCall={onCountryChange} countryName={country} allCountries={countries}/>
        <div className='app__stats'>
        <InfoBox 
           isRed
          onClick={(e)=>setCasesType("cases")}
          active={casesType==="cases"}
          title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} 
          total={prettyPrintStat(countryInfo.cases)}/>
        <InfoBox
          onClick={(e)=>setCasesType("recovered")}
          active={casesType ==="recovered"}
          title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={prettyPrintStat(countryInfo.recovered)}/>
        <InfoBox
           isRed
          onClick={(e)=>setCasesType("deaths")} 
          active={casesType ==="deaths"} 
          title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={prettyPrintStat(countryInfo.deaths)}/>

        </div>
        <Map casesType={casesType} center={mapCenter} zoom={mapZoom} countries={mapCountries}/>
      </div>

      </div> 
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData}/>
          <h3 className='app__graphTitle'>Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>


        </CardContent>
      </Card>
    </div>
  );
}

export default App;
