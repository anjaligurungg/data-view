import React, { memo, useEffect, useMemo, useState } from "react";
import config from "../config/Config";

const Table = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("start_date");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(config.url);
        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (column) => {
    setOrder(orderBy === column && order === "asc" ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];

      if (orderBy.includes("date")) {
        return order === "asc"
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filterData = () => {
    return data.filter((item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  const memoizedData = useMemo(
    () => sortData(filterData()),
    [data, search, order, orderBy]
  );

  return (
    <>
      <h1>Data</h1>
      <input
        style={styles.input}
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {[
                { label: "Symbol", key: "symbol" },
                { label: "Time Frame", key: "timeframe" },
                { label: "Start Date", key: "start_date" },
                { label: "End Date", key: "end_date" },
                { label: "File", key: "file" },
              ].map(({ label, key }) => (
                <th key={key} style={styles.th} onClick={() => handleSort(key)}>
                  {label} {orderBy === key && (order === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={styles.loading}>
                  Loading...
                </td>
              </tr>
            ) : (
              memoizedData.map((row, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{row.symbol}</td>
                  <td style={styles.td}>{row.timeframe}</td>
                  <td style={styles.td}>{row.start_date}</td>
                  <td style={styles.td}>{row.end_date}</td>
                  <td style={styles.td}>
                    <button style={styles.button}>{row.file}</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

const styles = {
  input: {
    width: "400px",
    height: "40px",
    borderRadius: "12px",
    padding: "10px 15px",
    fontSize: "16px",
    marginBottom: "20px",
  },
  tableContainer: {
    maxWidth: "100%",
    overflowX: "auto",
    display: "flex",
    justifyContent: "center",
  },
  table: {
    borderCollapse: "collapse",
    border: "1px solid #ddd",
    width: "100%",
  },
  th: {
    padding: "20px 25px",
    textAlign: "left",
    cursor: "pointer",
  },
  tr: { borderBottom: "1px solid #ddd" },
  td: { padding: "20px 25px", textAlign: "left" },
  button: {
    cursor: "pointer",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "9px",
    height: "30px",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
  },
};

export default memo(Table);
