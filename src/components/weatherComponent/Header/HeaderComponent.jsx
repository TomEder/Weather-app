import React from "react";
import Logo from "../../../Images/Logo.png";

const HeaderComponent = () => {
  return (
    <header>
      <div className="flex justify-between p-2">
        <img src={Logo} alt="EtherSteel Software Logo" className="w-32" />
        <h1 className="text-white">WEATHER APP</h1>
      </div>
      <nav></nav>
    </header>
  );
};

export default HeaderComponent;
