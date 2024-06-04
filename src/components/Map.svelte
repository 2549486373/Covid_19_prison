<script>
  import mapboxgl from "mapbox-gl";
  import { onMount } from "svelte";
  export let index;
  export let geoJsonToFit;
  let data = [];

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async function loadData() {
    if (index <= 1) {
      data = await fetchData('public/data/average_cases_per_day_2020.json');
    } else if (index === 2) {
      data = await fetchData('public/data/average_cases_per_day_2021.json');
    } else {
      data = await fetchData('public/data/average_cases_per_day_2022.json');
    }
  }

  mapboxgl.accessToken =
    "pk.eyJ1IjoiMjU0OTQ4NjM3MyIsImEiOiJjbHcyc2pvdnMwcHRyMmp0aTF2Zm9uMG1jIn0.5jMEYh4ZzoZT0-SDWUfVqA";

  let container;
  let alaskaContainer;
  let hawaiiContainer;
  let map, alaskaMap, hawaiiMap;

  let zoomLevel;
  let hoveredCounty = null; // Variable to store hovered county information

  function updateZoomLevel() {
    const screenWidth = window.innerWidth;
    zoomLevel = screenWidth <= 600 ? 3 : 4; 
  }

  function handleResize() {
    updateZoomLevel();
    if (map) map.setZoom(zoomLevel);
  }

  function calculatePercentiles(data, percentiles) {
    const sorted = data.slice().sort((a, b) => a - b);
    const results = percentiles.map(p => {
      const idx = Math.ceil(p * sorted.length) - 1;
      return sorted[idx];
    });
    return results;
  }

  async function fetchAndPrepareGeoJSON() { // Function to fetch and prepare GeoJSON data
    try {
      const response = await fetch('https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json');
      const countyGeoJSON = await response.json();

      countyGeoJSON.features.forEach((feature) => {
        const fips = parseInt(feature.id, 10);
        const countyData = data.find(item => item.fips === fips);
        feature.properties.cases_per_day = countyData ? countyData.cases_per_day : 0;
        feature.properties.county = countyData ? countyData.county : '';
        feature.properties.state = countyData ? countyData.state : '';
        feature.properties.cases = countyData ? countyData.cases : 0;
      });

      return countyGeoJSON;
    } catch (error) {
      console.error("Error fetching and preparing GeoJSON data:", error);
      return null;
    }
  }

  let countyGeoJSON;

  onMount(async () => {
    await loadData(); // Ensure data is loaded before proceeding

    if (!data || data.length === 0) {
      console.error("Data is not available or empty");
      return;
    }

    try {
      const casesPerDay = data.map(d => d.cases_per_day);
      const [min, p15, p30, p50, p75, max] = calculatePercentiles(casesPerDay, [0, 0.15, 0.30, 0.50, 0.75, 1.0]);

      countyGeoJSON = await fetchAndPrepareGeoJSON(); // Fetch and prepare GeoJSON data

      if (!countyGeoJSON) {
        console.error("Failed to fetch or prepare GeoJSON data");
        return;
      }

      updateZoomLevel();
      map = new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-98.583333, 39.833333], 
        zoom: zoomLevel,
        attributionControl: true, 
      });

      alaskaMap = new mapboxgl.Map({
        container: alaskaContainer,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-152.4044, 61.3707],
        zoom: 1.2,
        attributionControl: false,
      });

      hawaiiMap = new mapboxgl.Map({
        container: hawaiiContainer,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-157.5828, 19.8968],
        zoom: 4.1,
        attributionControl: false,
      });

      window.addEventListener("resize", handleResize);

      function hideLabelLayers(mapInstance) {
        const labelLayerIds = mapInstance
          .getStyle()
          .layers.filter(
            (layer) =>
              layer.type === "symbol" && /label|text|place/.test(layer.id)
          )
          .map((layer) => layer.id);

        for (const layerId of labelLayerIds) {
          mapInstance.setLayoutProperty(layerId, "visibility", "none");
        }
      }

      function addCountyBoundaries(mapInstance) {
        mapInstance.addSource('county-boundaries', {
          type: 'geojson',
          data: countyGeoJSON // Use the prepared GeoJSON data
        });

        mapInstance.addLayer({
          id: 'county-boundaries',
          type: 'line',
          source: 'county-boundaries',
          layout: {},
          paint: {
            'line-color': '#000000',
            'line-width': 0.1
          }
        });
      }

      function colorCounties(mapInstance) {
        mapInstance.addLayer({
          id: 'county-data',
          type: 'fill',
          source: 'county-boundaries', // Use the same source as county boundaries
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'cases_per_day'],
              0, '#F2F12D',  // Min cases_per_day
              p15, '#EED322',  // 15th percentile
              p30, '#E6B71E',  // 30th percentile
              p50, '#DA9C20',  // 50th percentile
              p75, '#CA8323',  // 75th percentile
              max, '#723122'   // Max cases_per_day
            ],
            'fill-opacity': 0.7
          }
        });
      }

      function addHoverEffect(mapInstance) {
        mapInstance.on('mousemove', 'county-data', (e) => {
          if (e.features.length > 0) {
            hoveredCounty = e.features[0].properties;
          }
        });

        mapInstance.on('mouseleave', 'county-data', () => {
          hoveredCounty = null;
        });
      }

      map.on("load", () => {
        hideLabelLayers(map);

        addCountyBoundaries(map);
        colorCounties(map); // Call colorCounties function to color counties based on data
        addHoverEffect(map); // Add hover effect to show county information

        updateBounds();
        map.on("zoom", updateBounds);
        map.on("drag", updateBounds);
        map.on("move", updateBounds);
      });

      alaskaMap.on("load", () => {
        hideLabelLayers(alaskaMap);
        addCountyBoundaries(alaskaMap);
        colorCounties(alaskaMap); // Color counties in Alaska map
      });

      hawaiiMap.on("load", () => {
        hideLabelLayers(hawaiiMap);
        addCountyBoundaries(hawaiiMap);
        colorCounties(hawaiiMap); // Color counties in Hawaii map
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  });

  function updateBounds() {
    if (!map) return;
    const bounds = map.getBounds();
    geoJsonToFit.features[0].geometry.coordinates = [
      bounds._ne.lng,
      bounds._ne.lat,
    ];
    geoJsonToFit.features[1].geometry.coordinates = [
      bounds._sw.lng,
      bounds._sw.lat,
    ];
  }

  let isVisible = true;

</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"
  />
</svelte:head>

<div class="map-container">
  <div class="map" class:visible={isVisible} bind:this={container}></div>
  <div class="inset-map alaska" bind:this={alaskaContainer}></div>
  <div class="inset-map hawaii" bind:this={hawaiiContainer}></div>
  <div class="info-box">
    {#if hoveredCounty}
      <div>
        <h3>County: {hoveredCounty.county}, State: {hoveredCounty.state}</h3>
        <p>Average Cases Per Day: {hoveredCounty.cases_per_day}</p>
        <p>Total Cases: {hoveredCounty.cases}</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .map {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: opacity 2s, visibility 2s;
  }

  .map.visible {
    opacity: 1;
    visibility: visible;
  }

  .inset-map {
    position: absolute;
    width: 150px;
    height: 150px;
    border: 2px solid #000;
  }

  .alaska {
    bottom: 10px;
    left: 10px;
  }

  .hawaii {
    bottom: 10px;
    left: 170px;
  }

  .info-box {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
</style>
