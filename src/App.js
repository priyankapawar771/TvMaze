import React, { useEffect, useState } from "react";
import Actor from "./Actor.js";
import Shows from "./Shows";
import axios from "axios";
import "./App.css";

function App() {
  let [dataActor, setDataActor] = useState([]);
  let [dataShows, setDataShows] = useState([]);
  let [actorShowData, setActorShowData] = useState([]);
  let [noData, setNoData] = useState("");
  let [inputrow,setInputRow]=useState('');
  let [radio, setRadio] = useState("");
  let [input, setInput] = useState("");

  useEffect(() => {
    if (radio === "actor") {
      console.log("actor api called");
      axios
        .get(`https://api.tvmaze.com/search/people?q=${input}`)
        .then((response) => setDataActor(response.data));
    } else {
      console.log("shows api called");
      axios
        .get(`https://api.tvmaze.com/search/shows?q=${input}`)
        .then((response) => setDataShows(response.data));
    }
  }, [input]);

  useEffect(() => {
    if (dataActor.length !== 0) {
      console.log(dataActor[0]?.person?.id, dataActor[0]?.person?.name);
      if (input === "") {
        setActorShowData([]);
      } else
        axios
          .get(
            `https://api.tvmaze.com/people/${dataActor[0]?.person?.id}/castcredits?embed=show`
          )
          .then((response) =>
            setActorShowData(
              (prevState, prevProp) => (prevState = response.data)
            )
          );
    
    }
  }, [dataActor, input]);

  function updateRadio(event) {
    setRadio((radio = event.target.value));
    setDataActor((prevState, prevProp) => (prevState = []));
    setDataShows((prevState, prevProp) => (prevState = []));
    setInput((prevState, prevProp) => (prevState = ""));
    setActorShowData((prevState, prevProp) => (prevState = ""));
    setNoData((prevState, prevProp) => (prevState = ""));
    setInputRow((prevState,prevProp)=>(prevState=""));
    console.log(radio);
  }

  return (
    <div className="App container">
      <div className="main">
        <h1 style={{ color: "purple" ,fontSize:"80px",float:"center"}}>TVmaze</h1>
        <h3 style={{ color: "black",fontSize:"40px",float:"center" }}>Search your favourite shows </h3>
        <br></br>
        <form>
          <div style={{ padding: "10px" }}>
            <input
              style={{ margin: "10px" }}
              className="form-check-input"
              onChange={updateRadio}
              name="tv"
              type="radio"
              value="actor"
              onClick={()=>{setInputRow('Enter The Person Name')}}
            ></input>
            <label style={{ fontSize: "30px",color:"darkblue",fontWeight:"bold",backgroundColor:"yellow" }}>Actor</label>
            <input
            
              style={{ margin: "35px" }}
              className="form-check-input"
              onChange={updateRadio}
              name="tv"
              type="radio"
              value="shows"
              onClick={()=>{setInputRow('Enter The Show Name')}}
            ></input>
            <label style={{ fontSize: "30px",color:"darkblue",fontWeight:"bold",backgroundColor:"yellow" }}>Shows</label>
          </div>
          <p></p>
          <div style={{ margin: "35px" }}>
            <input
            placeholder="eg..friends"
              className="form-control w-50 mx-auto"
              value={input}
              onBlur={() => {
                setNoData("NO SHOWS AVAILABLE");
              }}
              onChange={(e) => {
                setInput(e.target.value);
                setNoData("NO SHOWS AVAILABLE");
              }}
              type="text"
            ></input>
          </div>
        </form>
      </div>
      
      {radio === "actor" ? (
        actorShowData.length !== 0 ? (
          <Actor data={actorShowData}></Actor>
        ) : (
          <h3 style={{ color: "red" }}>{noData}</h3>
        )
      ) : dataShows.length !== 0 ? (
        <Shows data={dataShows}></Shows>
      ) : (
        <h3 style={{ color: "red" }}>{noData}</h3>
      )}
    </div>
  );
}

export default App;
