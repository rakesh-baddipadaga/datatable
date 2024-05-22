import React, { useState, useEffect } from 'react';
import { Table, Container } from '@mantine/core';
import jsonData from '../data/data.json';
import './styles.css'


//function for  processesing the input data to handle missing values. If any of the key fields are missing it setsthem  to 0
const processData = (data) => {
  const processedData = data.map(item => ({
    ...item,
    "Crop Production (UOM:t(Tonnes))": item["Crop Production (UOM:t(Tonnes))"] || 0,
    "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] || 0,
    "Area Under Cultivation (UOM:Ha(Hectares))": item["Area Under Cultivation (UOM:Ha(Hectares))"] || 0,
  }));

  return processedData;
};


//function to calculate the crops with maximum andminimun production for a year
const getMaxMinProductionByYear = (data) => {
  const yearMap = {};

  data.forEach(item => {
    const year = item.Year.split(',')[1].trim();
    const crop = item["Crop Name"];
    const production = parseFloat(item["Crop Production (UOM:t(Tonnes))"]);

    if (!yearMap[year]) {
      yearMap[year] = {
        maxCrop: crop,
        maxProduction: production,
        minCrop: crop,
        minProduction: production,
      };
    } else {
      if (production > yearMap[year].maxProduction) {
        yearMap[year].maxCrop = crop;
        yearMap[year].maxProduction = production;
      }
      if (production < yearMap[year].minProduction) {
        yearMap[year].minCrop = crop;
        yearMap[year].minProduction = production;
      }
    }
  });

  return Object.entries(yearMap).map(([year, { maxCrop, minCrop }]) => ({
    year,
    maxCrop,
    minCrop,
  }));
};

//function to  calculate the average yield and average area under cultivation for each crop over the entire dataset
const getCropAverages = (data) => {
  const cropMap = {};

  data.forEach(item => {
    const crop = item["Crop Name"];
    const yieldKgPerHa = parseFloat(item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]);
    const areaHa = parseFloat(item["Area Under Cultivation (UOM:Ha(Hectares))"]);

    if (!cropMap[crop]) {
      cropMap[crop] = {
        totalYield: yieldKgPerHa,
        totalArea: areaHa,
        count: 1,
      };
    } else {
      cropMap[crop].totalYield += yieldKgPerHa;
      cropMap[crop].totalArea += areaHa;
      cropMap[crop].count += 1;
    }
  });

  return Object.entries(cropMap).map(([crop, { totalYield, totalArea, count }]) => ({
    crop,
    averageYield: (totalYield / count).toFixed(3),
    averageArea: (totalArea / count).toFixed(3),
  }));
};


// function for rendering the tables.
const AnalyticsTable = () => {
  const [maxMinData, setMaxMinData] = useState([]);
  const [cropAverages, setCropAverages] = useState([]);

  useEffect(() => {
    const processedData = processData(jsonData);
    setMaxMinData(getMaxMinProductionByYear(processedData));
    setCropAverages(getCropAverages(processedData));
  }, []);


  return (
    <Container>
      <Table withTableBorder={true} withColumnBorders >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Year</Table.Th>
            <Table.Th>Crop with Maximum Production in that Year</Table.Th>
            <Table.Th>Crop with Minimum Production in that Year</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {maxMinData.map(({ year, maxCrop, minCrop }) => (
            <Table.Tr key={year}>
              <Table.Td>{year}</Table.Td>
              <Table.Td>{maxCrop}</Table.Td>
              <Table.Td>{minCrop}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <br />
      <Table withTableBorder={true} withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Crop</Table.Th>
            <Table.Th>Average Yield of the Crop between 1950-2020</Table.Th>
            <Table.Th>Average Cultivation Area of the Crop Between 1950-2020</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {cropAverages.map(({ crop, averageYield, averageArea }) => (
            <Table.Tr key={crop}>
              <Table.Td>{crop}</Table.Td>
              <Table.Td>{averageYield}</Table.Td>
              <Table.Td>{averageArea}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
};

export default AnalyticsTable;
