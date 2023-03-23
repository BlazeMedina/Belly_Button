function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var newSampleArray = sampleArray.filter(obj => obj.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaDataArray = data.metadata;
    var newMetaData = metaDataArray.filter(obj => obj.id == sample);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstSample = newSampleArray[0];
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var firstMetaData = newMetaData[0];
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wash = firstMetaData.wfreq;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0,10).map(i => 'OTU ' + i).reverse();
       console.log(yticks);
    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels,
      marker: {
        color: ['#0000ff', '#5686ff', '#3be7ff', '#31d3ad', '#239b45', '#529c00', 
        '#b5d400', '#ffeb00', '#ff9600', '#ff0000']},
      orientation: 'h',
      type: 'bar',
      

    }];   

    //Created variable 'config' to hide the floating toolbar in Plotly.
    var config = { displayModeBar: false};

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "Top 10 Bacteria Cultures Found",
        font: {color: "white"}},
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: {color: "gray"},
      xaxis: {title: {text: "Amount of Detected Bacteria"}},
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, config);


    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      type: "scatter",
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Jet"
      }
    }];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "Bacteria Cultures Per Sample",
      font: {color: "white"}
      },
      font: {color: "gray"},
      xaxis: {title: {text: "OTU ID"}},
      margins: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
      },
      hovermode: "closest",
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)'

    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config);

    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      type: "indicator",
      mode: "gauge+number",
      value: wash,
      textfont: {color: "white"},
      title: { text: "Belly Button Washing Frequency <br> Per Week <br>.", 
        font: {color: "white"}
      },    
      gauge: {
        axis: { 
          range: [0, 10],
          tickwidth: 1
        },
        bordercolor: "gray",
        bar: { color: '#3a1139', line: {color: 'black', width: 1}},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lime"},
          {range: [8,10], color: "green"},
        ]

      }
    }];
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 400, 
      margin: { t:0, b:0 },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: {color: "aqua"}
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);
  });
}
