// Source URL
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Use d3 library to read in sampes.json from URL
d3.json(url).then(function(data){
}); 

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual. 
function init(){
    //Dropdown menu variables for each sample
    let dropdown = d3.select("#selDataset");
    //Use d3 to retrieve sample names and populate dropdown 
    d3.json(url).then((data) => {
    //Set variable names
    let sample_ids = data.names;
        for (id of sample_ids){
            dropdown.append("option").attr("value", id).text(id);
        };
    //Display first sample 
    let first_sample = sample_ids[0];
    
    //Initial plots  
    makeBar(first_sample);
    makeBubble(first_sample);
    makeDemographics(first_sample);
    }); 
};

//Function to populate bar chart
function makeBar(sample){

    //Use D3 to populate the bar chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //Filter to match on ID 
        let results = sample_data.filter(id => id.id == sample);
        //Store first entry
        let first_result = results[0];
        //Store first 10 results 
        let sample_values = first_result.sample_values.slice(0,10);
        let otu_ids = first_result.otu_ids.slice(0,10);
        let otu_labels = first_result.otu_labels.slice(0,10);

        //Trace for bar charts 
        let trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(item => `OTU ${item}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = {title: "Top 10 Bacteria Cultures Found"};
        Plotly.newPlot("bar", [trace], layout);
    });
};

function makeBubble(sample){
    //Use D3 to access sample data 
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //Filter to match on Sample ID
        let results = sample_data.filter(id => id.id == sample);
        //Store first entry 
        let first_result = results[0];
        console.log(first_result);
        //Store results 
        let sample_values = first_result.sample_values;
        let otu_ids = first_result.otu_ids;
        let otu_labels = first_result.otu_labels;

        //Create trace for bubble chart
        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

        let layout = {
            title: 'Bacteria Cultures Per Sample',
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'}
        };
        Plotly.newPlot("bubble", [bubble_trace], layout); 
    });
};

//Demographic Info 
function makeDemographics(sample){
    //Use d3 to access sample data 
    d3.json(url).then((data) => {
        let demographic_info = data.metadata;
     //Match on sample ID 
        let results = demographic_info.filter(id => id.id == sample);
    //Store first result 
        let first_result = results[0];
        d3.select('#sample-metadata').html('');
        Object.entries(first_result).forEach(([key,value]) => {
        d3.select('#sample-metadata').append('h6').text(`${key}: ${value}`);
    });
    
    });
};

function optionChanged(value){
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

init();