import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const sortData =(data)=>{
    const sortedData =[...data]; // converting the argument to an array 
    // const sortedData=[].slice.call(data);
    // sortedData.sort((a,b)=>{
    //     if(a.cases > b.cases){
    //         return -1
    //     }else{
    //         return 1

    //     }
    // })
    // return sortedData; ||
     sortedData.sort((a,b)=>(a.cases > b.cases ? -1: 1));
     return sortedData;

   


}

const casesTypeColors ={
    cases: {
        hex: "#CC1034",
        multiplier:300,
        half_op: "rgba(204, 16, 52, 0.5)",
    },
    recovered:{
        hex: "#7dd71d",
        multiplier: 200,
        half_op: "rgba(125, 215, 29, 0.5)",
    },
    deaths:{
        hex: "#fb4443",
        multiplier:400,
        half_op: "rgba(251, 68, 67, 0.5)",

    },
};


export const showDataOnMap = (data, casesType)=>(
    data.map((country)=>(
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fill={casesTypeColors[casesType].hex}
            radius={Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier}
        >
            <Popup>
                <div className="info-container">
                    <div
                        className="info-flag"
                        style={{backgroundImage: `url(${country.countryInfo.flag})`}}
                    />
                    <div className="info-name">{country.country}</div>
                    <div className="info-cases">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))

);

export const prettyPrintStat=(stat)=> 
    stat ? `+${numeral(stat).format("0.0a")}`: "+0";