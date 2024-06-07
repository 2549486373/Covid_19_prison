<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Map from "./components/Map.svelte";
  import Graph from "./components/Graph.svelte";
  import { fade } from "svelte/transition";

  let count, index = 0, offset, progress; // Initialize index to 0
  let width, height;
  let showPlots = [false, false, false, false, false]; 
  let scroller; // Reference to Scroller component

  let geoJsonToFit = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [1, 0],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 1],
        },
      },
    ],
  };

  let string1 = `
<div style="text-align: center; max-width: 600px; margin: 0 auto;">
  <h2>COVID-19 Trends in the USA (2020-2022)</h2>
  <p>From 2020 to 2022, COVID-19 trends in the USA showed significant shifts:</p>
  
  <h3>2020</h3>
  <p>Accumulated cases and deaths rose rapidly due to uncontrolled spread and limited interventions.</p>
  
  <h3>2021</h3>
  <p>Saw cyclic patterns in monthly case increases, driven by new variants like Delta and Omicron, leading to notable peaks in July and December. Accumulated deaths continued to climb, albeit at varying rates.</p>
  
  <h3>2022</h3>
  <p>The trend began to stabilize with slower increases in cases and deaths, reflecting the impact of widespread vaccinations, improved treatments, and consistent public health measures.</p>
</div>

<div style="text-align: center; max-width: 600px; margin: 0 auto;">
  <h2>COVID-19 Cases and Cases Per Day Statistics (2020-2022)</h2>
  <table border="1" style="margin: 0 auto; border-collapse: collapse; width: 100%;">
    <thead>
      <tr>
        <th></th>
        <th>cases</th>
        <th>cases_per_day</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>count</td>
        <td>9,804</td>
        <td>9,804</td>
      </tr>
      <tr>
        <td>mean</td>
        <td>4,765,045</td>
        <td>13,081.42</td>
      </tr>
      <tr>
        <td>std</td>
        <td>23,135,340</td>
        <td>63,391.04</td>
      </tr>
      <tr>
        <td>min</td>
        <td>0</td>
        <td>0</td>
      </tr>
      <tr>
        <td>25%</td>
        <td>171,608.2</td>
        <td>487.1436</td>
      </tr>
      <tr>
        <td>50%</td>
        <td>799,195</td>
        <td>2,203.607</td>
      </tr>
      <tr>
        <td>75%</td>
        <td>2,727,922</td>
        <td>7,478.523</td>
      </tr>
      <tr>
        <td>max</td>
        <td>1,132,082,000</td>
        <td>3,101,594</td>
      </tr>
    </tbody>
  </table>
</div>
`;

  const sections = [
    { text: "First case of Covid 19 happens on 2020-01-21", showGraphs: false, showButton: true },
    { text: 'Year 2020', startDate: "2020-01-01", endDate: "2020-12-31", showGraphs: true, showButton: true,},
    { text: "Year 2021", startDate: "2021-01-01", endDate: "2021-12-31", showGraphs: true, showButton: true },
    { text: "Year 2022", startDate: "2022-01-01", endDate: "2022-12-31", showGraphs: true, showButton: true },
    { text: "Things become better after 2023", showGraphs: false, showButton: true }
  ];

  const dataUrls = ['public/data/us.csv'];

  function togglePlots(i) {
    showPlots[i] = !showPlots[i];
  }

  // Function to increment the index and scroll to the next section
  async function incrementIndex() {
    if (index < sections.length - 1) {
      index += 1;
      const nextSection = document.querySelector(`.section-${index}`);
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Function to decrement the index and scroll to the previous section
  async function decrementIndex() {
    if (index > 0) {
      index -= 1;
      const prevSection = document.querySelector(`.section-${index}`);
      prevSection.scrollIntoView({ behavior: 'smooth' });
    }
  }


</script>

<p>{@html string1}</p>





<Scroller
  top={0.0}
  bottom={1}
  threshold={0.5}
  bind:count
  bind:index
  bind:offset
  bind:progress
  bind:this={scroller}
>
<div class="container" slot="foreground">
  <div class="map-container" bind:clientWidth={width} bind:clientHeight={height}>
    <div class="title mainland-title">US Mainland</div>
    <div class="title hawaii-title">Hawaii</div>
    <div class="title alaska-title">Alaska</div>
    <Map {geoJsonToFit} {index} />
  </div> 
  <div class="sections-container" >
    {#each sections as section, i}
    
      <section class="section-{i}"> 
        <div>
          <div class="button-container">
            {#if section.showButton}
              {#if i === 0}
                <button class="show-plots-button" on:click={incrementIndex}>
                  Next Section
                </button>
              {/if}
              {#if i === sections.length - 1}
                <button class="show-plots-button" on:click={decrementIndex}>
                  Previous Section
                </button>
              {/if}
            {/if}
            {#if section.showButton && !showPlots[i] && i !== 0 && i !== sections.length - 1}
              <button class="show-plots-button" on:click={() => togglePlots(i)}>
                Show Plots
              </button>
              <button class="show-plots-button" on:click={incrementIndex}>
                Next Section
              </button>
              <button class="show-plots-button" on:click={decrementIndex}>
                Previous Section
              </button>
            {/if}
          </div>
        </div>
        {#if section.showGraphs && showPlots[i]}
          <div class="graph-section" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
            <div class="button-container">
              <button class="hide-plots-button" on:click={() => togglePlots(i)}>
                Hide Plots
              </button>
              <button class="show-plots-button" on:click={incrementIndex}>
                Next Section
              </button>
              <button class="show-plots-button" on:click={decrementIndex}>
                Previous Section
              </button>
            </div>
            <div class="graph-title">Accumulated Monthly Cases</div>
            <div class="graph-container">
              <Graph {dataUrls} graphType="accumulated" startDate={section.startDate} endDate={section.endDate} graphLabel="Accumulated Cases" />
            </div>
            
            <div class="graph-title">Monthly Cases Increasement</div>
            <div class="graph-container">
              <Graph {dataUrls} graphType="cases" startDate={section.startDate} endDate={section.endDate} graphLabel="Monthly Cases Increasement" />
            </div>
            
            <div class="graph-title">Accumulated Monthly Deaths</div>
            <div class="graph-container">
              <Graph {dataUrls} graphType="accumulatedDeaths" startDate={section.startDate} endDate={section.endDate} graphLabel="Accumulated Deaths" />
            </div>
          </div>
        {:else if !section.showButton}
          <div class="text-section" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
            {section.text}

          </div>
        {/if}
      </section>
    {/each}
  </div>
</div>
</Scroller>

<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .container {
    display: flex;
    width: 100%;
    height: 100vh;
  }


  .map-container {
    width: 70%;
    height: 100vh;
    position: relative;
  }

  .sections-container {
    width: 30%;
    height: 100vh;
    overflow-y: auto;
    position: relative;
    right: 0; 
    scroll-snap-type: y mandatory;
  }

  section {
    height: 100vh;
    text-align: center;
    max-width: 750px;
    color: black;
    padding: 1em;
    margin: 0;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .graph-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    
  }

  .graph-container {
    width: 100%;
    height: 180px;
    margin-top: 0.8em;
  }

  .graph-title {
    text-align: center;
    font-weight: bold;
    margin-top: 0.5em;
  }

  .button-container {
    text-align: center;
    margin-top: 1em;
  }

  .show-plots-button,
  .hide-plots-button {
    padding: 0.5em 1em;
    font-size: 1em;
    cursor: pointer;
    z-index: 2;
  }

  .title {
    position: absolute;
    font-size: 1.5em;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.7);
    padding: 0.2em;
    border-radius: 0.2em;
    z-index: 1;
  }

  .mainland-title {
    top: 15px;
    left: 20px;
  }

  .hawaii-title {
    bottom: 160px;
    left: 180px;
  }

  .alaska-title {
    bottom: 160px;
    left: 20px;
  }
</style>
