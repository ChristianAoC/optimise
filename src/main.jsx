import React from "react";
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route} from "react-router-dom";
import CR1 from './CR1.jsx'
import CR2 from './CR2.jsx'
import OBH from './OliverHacks.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="obh" element={<OBH />}></Route>
          <Route path="cr1" element={<CR1 />}></Route>
          <Route path="cr2" element={<CR2 />}></Route>
        </Routes>
      </HashRouter>
  </React.StrictMode>
);
