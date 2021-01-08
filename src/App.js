import React from "react";
import { withSplash } from "./Splash";

import Layout, { Navbar } from "./Layout/Layout";

function App() {
  return (
    <>
      {false && <Navbar />}
      <Layout></Layout>
    </>
  );
}

export default withSplash(App);
