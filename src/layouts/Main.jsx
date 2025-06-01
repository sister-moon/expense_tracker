// rrd imports
import { Outlet, useLoaderData } from "react-router-dom";

// assets
// import wave from "../assets/wave.svg";

// components
import Nav from "../components/Nav";

//  helper functions
import { fetchData } from "../helpers";

// loader
export function mainLoader() {
  const userName = fetchData("userName");
  return { userName };
}

import { PlansProvider } from "../context/PlansContext";

const Layout = ({ userName }) => {
  return (
    <div className="layout">
      <Nav userName={userName} />
      <main>
        <PlansProvider>
          <Outlet />
        </PlansProvider>
      </main>
    </div>
  );
};

export default Layout;
