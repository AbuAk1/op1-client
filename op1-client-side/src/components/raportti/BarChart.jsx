import React from "react";
import Chart from "react-apexcharts";

export default function BarChart({ data }) {

  // Ryhmittele datan hintaluokat ja laske määrät
  const groupedData = data.reduce((acc, item) => {
    const { hintaluokka } = item.hinnasto;
    const maxLippumaara = item.tapahtuma.lippumaara;

    if (!acc[hintaluokka]) {
      acc[hintaluokka] = { count: 0, max: maxLippumaara };
    }
    acc[hintaluokka].count += 1; // Kasvata lipputyypin määrää
    return acc;
  }, {});

  // Lasketaan jäljellä olevien lippujen määrä (maxLippumaara - myytyjen summa)
  const totalTicketsSold = Object.values(groupedData).reduce(
    (sum, item) => sum + item.count,
    0
  );
  const maxTickets = data[0]?.tapahtuma.lippumaara || 0; // Oletetaan sama max kaikille
  const remainingTickets = maxTickets - totalTicketsSold;

  // Muodosta kaaviodata
  const categories = Object.keys(groupedData); // Hintaluokat
  const ticketCounts = Object.values(groupedData).map((item) => item.count); // Lipputyyppien määrät

  // Lisätään jäljellä olevien lippujen data
  categories.push("Jäljellä");
  ticketCounts.push(remainingTickets);

  const chartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: categories, // Hintaluokat + "Jäljellä"
    },
    title: {
      text: "Lipputyyppien määrät ja jäljellä olevat liput",
      align: "center",
    },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          const category = opts.w.globals.labels[opts.dataPointIndex];
          return category === "Jäljellä"
            ? `${val} lippua jäljellä`
            : `${val} lippua myyty`;
        },
      },
    },
  };

  const chartSeries = [
    {
      name: "Lukumäärä",
      data: ticketCounts,
    },
  ];

  return <Chart options={chartOptions} series={chartSeries} type="bar" width="600" />;
};
