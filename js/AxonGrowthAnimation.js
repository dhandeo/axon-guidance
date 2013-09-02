// Widget for visualizing axon growth
// Creates classes

function AxonGrowthAnimation(config) {
    this.config = {};

    $.extend(this.config,{
       log:[],
       container:null
    },config);

    console.log("Generating steps ..");
    this.steps = [];
    for(var i=0; i < this.config.log.length; i++) {
        // get words
        var words = this.config.log[i].match(/[^ ]+/g);
        console.log(words);
    }

    // Start with clean slate
    $(config.container).empty();

    // create the controls and div
    var inner_html = '<div class="row"><br/>' +
        '<div class="controls" class="row" >' +
        '<button class="play" class="button">Play</button>' +
        '<button class="reset" class="button">Reset</button> <br/><br/>' +
        '<div class="slider" style="margin-left:50px;margin-right: 50px"></div>' +
    '</div>'+
    '<div id="map" class="row"></div>';

    this.div = document.createElement("div");
    $(this.div).html(inner_html);
    $(this.div).appendTo($(config.container));

    // Create slider
    $(this.div).find(".slider").slider();

    // Bind events
    $(this.div).find(".play").click(function(event) {
        console.log("Play clicked");
    });

    // Bind events
    $(this.div).find(".reset").click(function(event) {
        console.log("Reset clicked");
    });
}
