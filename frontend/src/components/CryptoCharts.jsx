import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const CryptoCharts = ({ ethPrices }) => {
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const updatedBarData = [...barData];
    const volume = Math.floor(Math.random() * 100) + 1; // Volume simulé

    // Ajouter ou mettre à jour les données du volume
    if (updatedBarData.length < 24) {
      updatedBarData.push(volume);
    } else {
      updatedBarData.shift();
      updatedBarData.push(volume);
    }

    setBarData(updatedBarData);
  }, [ethPrices]);

  // Option pour le graphique en ligne avec une courbe
  const lineChartOption = {
    title: {
      text: "Évolution du prix d'Ethereum",
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ethPrices.map((_, index) => index), // Index ou date
    },
    yAxis: {
      type: 'value',
      name: 'Prix (USDT)',
    },
    series: [
      {
        name: 'Prix',
        type: 'line',
        data: ethPrices.map((price) => price), // Les valeurs des prix ETH/USDT
        smooth: true, // Courbe lissée
        lineStyle: {
          color: '#007bff', // Couleur de la ligne
          width: 2, // Épaisseur de la ligne
        },
        itemStyle: {
          color: '#007bff', // Couleur des points
        },
      },
    ],
  };

  // Option pour le graphique en barres (volume échangé par heure)
  const barChartOption = {
    title: {
      text: 'Volume échangé par heure',
    },
    tooltip: {
      trigger: 'item',
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 24 heures
    },
    yAxis: {
      type: 'value',
      name: 'Volume',
    },
    series: [
      {
        name: 'Volume',
        type: 'bar',
        data: barData,
        itemStyle: {
          color: '#28a745', // Couleur des barres
        },
      },
    ],
  };

  return (
    <div>
      <h2>Graphiques d'Ethereum</h2>
      {/* Graphique courbe d'évolution du prix */}
      <ReactECharts option={lineChartOption} />
      {/* Graphique du volume échangé */}
      <ReactECharts option={barChartOption} />
    </div>
  );
};

export default CryptoCharts;
