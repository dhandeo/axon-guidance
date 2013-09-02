// Widget for visualizing axon growth
// Creates classes

function AxonGrowthAnimation(config) {
    this.config = {};

    $.extend(this.config,config,{
       log:[],
       container:null
    });

    // create the controls and div
    var inner_html = '<div class="row">' +
        '<div class="controls" class="row" >' +
        '<button class="play" class="button">Play</button>' +
        '<button class="reset" class="button">Reset</button>' +
        '<div class="slider">Slider</div>' +
    '</div>'+
    '<div id="map" class="row" ></div>';


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
