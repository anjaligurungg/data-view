import React, { memo, useEffect, useMemo, useState } from "react";
import "./Table.css";
import config from "../config/Config";

const Table = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("start_date");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(config.url, {
        method: "GET",
      });
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (orderBy === "start_date" || orderBy === "end_date") {
        const dateA = new Date(a[orderBy]);
        const dateB = new Date(b[orderBy]);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }

      const valueA = a[orderBy];
      const valueB = b[orderBy];
      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
  };
  const filteeData = () => {
    const filteredData = data.filter((data) => data.symbol.includes(search));
    return sortData(filteredData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const memoData = useMemo(filteeData, sortData[(data, search)], [
    data,
    order,
    orderBy,
    search,
  ]);
  return (
    <>
      <h1>Data</h1>
      <div>
        <input
          style={{
            width: "400px",
            height: "20px",
            borderRadius: "12px",
            padding: "10px 40px 10px 15px",
            fontSize: "16px",
          }}
          type="text"
          placeholder="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div
        style={{
          maxWidth: "100%",
          overflowX: "auto",
          margin: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <table
          style={{
            maxWidth: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th
                style={{ padding: "20px 25px", textAlign: "left" }}
                onClick={() => handleSort("symbol")}
              >
                Symbol
                {orderBy === "symbol" && (order === "asc" ? " ↑" : " ↓")}
              </th>
              <th
                style={{ padding: "20px 25px", textAlign: "left" }}
                onClick={() => handleSort("timeframe")}
              >
                Time Frame
              </th>
              <th
                style={{ padding: "20px 25px", textAlign: "left" }}
                onClick={() => handleSort("start_date")}
              >
                Start Date
                {orderBy === "start_date" && (order === "asc" ? " ↑" : " ↓")}
              </th>
              <th
                style={{ padding: "20px 25px", textAlign: "left" }}
                onClick={() => handleSort("end_date")}
              >
                End Date
                {orderBy === "end_date" && (order === "asc" ? " ↑" : " ↓")}
              </th>
              <th style={{ padding: "20px 25px", textAlign: "left" }}>File</th>
            </tr>
          </thead>

          {loading && <p>Loading....</p>}
          <tbody>
            {memoData.map((row, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "20px 25px", textAlign: "left" }}>
                  {row.symbol}
                </td>
                <td style={{ padding: "20px 25px", textAlign: "left" }}>
                  {row.timeframe}
                </td>
                <td style={{ padding: "20px 25px", textAlign: "left" }}>
                  {row.start_date}
                </td>
                <td style={{ padding: "20px 25px", textAlign: "left" }}>
                  {row.end_date}
                </td>
                <td style={{ padding: "20px 25px", textAlign: "left" }}>
                  <button
                    style={{
                      cursor: "pointer",
                      backgroundColor: "Blue",
                      border: "none",
                      borderRadius: "9px",
                      color: "white",
                      height: "30px",
                    }}
                  >
                    {row.file}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(Table);
