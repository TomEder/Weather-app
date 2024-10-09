import "./App.css";
import HeaderComponent from "./components/weatherComponent/Header/HeaderComponent";
import WeatherComponent from "./components/weatherComponent/WeatherComponent";

function App() {
  return (
    <div className="App">
      <HeaderComponent />
      <WeatherComponent />
    </div>
  );
}

export default App;
