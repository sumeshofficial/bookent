import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [data, setData] = useState(null);
  const baseUrl = "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      const obj = await axios(`${baseUrl}/api/data`);
      setData(obj.data);
    };

    fetchData();
  },[]);

  return (
    <>
      <p>data: {data?.message}</p>
    </>
  );
}

export default App;
