import React from "react";
import Chart from "react-apexcharts";

export default function PieChart({ data }) {

  // Ryhmittele datan hintaluokat ja laske määrät sekä yhteishinnat
  const groupedData = data.reduce((acc, item) => {
    const { hintaluokka, hinta } = item.hinnasto;
    if (!acc[hintaluokka]) {
      acc[hintaluokka] = { count: 0, totalPrice: 0 };
    }
    acc[hintaluokka].count += 1; // Kasvata lipun määrää
    acc[hintaluokka].totalPrice += hinta; // Lisää hinta yhteishintaan
    return acc;
  }, {});

  // Laske kokonaishinta kaikista lipuista
  const totalRevenue = Object.values(groupedData).reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // Muodosta data kaaviota varten
  const categories = Object.keys(groupedData); // Hintaluokat
  const amounts = Object.values(groupedData).map((item) => item.count); // Lipun määrät
  const totalPrices = Object.values(groupedData).map((item) => item.totalPrice); // Yhteishinnat

  const chartOptions = {
    labels: categories, // Hintaluokat
    title: {
      text: `Hintaluokkien määrät ja kokonaistulot: ${totalRevenue} €`,
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          // Varmista, että opts ja opts.w.globals.labels ovat määriteltyjä
          if (opts && opts.w && opts.w.globals.labels && opts.seriesIndex !== undefined) {
            const label = opts.w.globals.labels[opts.seriesIndex];
            const totalPrice = groupedData[label]?.totalPrice || 0;
            return `${val} lippua, yhteensä ${totalPrice} €`;
          }
          return `${val} lippua`; // Varmistettu fallback-arvo
        },
      },
    },
  };

  const chartSeries = amounts; // Lipun määrät kaaviota varten

  return (
    <div>
      <Chart options={chartOptions} series={chartSeries} type="pie" width="400" />
      {/* Näytä hintaluokkakohtainen tulos listana */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h4>Hintaluokkien yhteishinnat</h4>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {categories.map((category, index) => (
            <li key={category}>
              <strong>{category}:</strong> {totalPrices[index]} €
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};