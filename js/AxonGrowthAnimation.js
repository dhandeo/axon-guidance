// Widget for visualizing axon growth
// Creates classes

function AxonGrowthAnimation(config) {
    this.config = {};
    var that = this;
    $.extend(this.config,{
       log:[],
       container:null
    },config);

    console.log("Generating steps ..");
    this.steps = [];
    for(var i=0; i < this.config.log.length; i++) {
        // get words
        var words = this.config.log[i].match(/[^ ]+/g);
//        console.log(words);
        var step = {
            time : parseFloat(words[0]),
            type : words[1],
            angle : parseFloat(words[2].split(":")[1]),
            length : parseFloat(words[3].split(":")[1])
        };

        this.steps.push(step);
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
    '<div class="mapdiv" class="row" style="width:500px;height:500px;"></div>';

    this.div = document.createElement("div");
    $(this.div).html(inner_html);
    $(this.div).appendTo($(config.container));


    this.playing = false;
    this.time = 0;
    this.maxtime = this.steps[this.steps.length-1].time;

    // Create slider
    $(this.div).find(".slider").slider({
      range: "min",
      value: this.time,
      min: 0,
      max: this.maxtime * 100,
      slide: function( event, ui ) {
        console.log("Sliding to time " + ui.value / 100);
      }
    });

    this.fps = 10; // fps
    this.timetick = 0;

    this.Tick = function() {
        // console.log("tick " + $.now());
        that.timetick = that.timetick + 1;
        var elapsed = that.timetick / that.fps;
        if(elapsed > that.maxtime ) {
            that.timetick = 0;
            return;
        }
        $(this.div).find(".slider").slider("value", elapsed * 100);

        // for each step that needs to be implemented
        while(this.steps[0].time < elapsed) {
            var astep = that.steps.splice(0,1)[0];
            console.log("Executing ..");
            console.log(astep);
            switch(astep.type) {
                case "create_protrusion":
                    that.AddProtrusion(astep.angle, astep.length);
                    break;
                case "select_protrusion":
                    that.SelectProtrusion(astep.angle, astep.length);
                    break;
            }
        }
    };

    // Bind events
    $(this.div).find(".play").click(function(event) {
        if(that.playing === true) {
            // Pause it
            window.clearInterval(that.timer);
            $(this).text("Play");
            that.playing = false;
        } else {
            // Play
            // start timer
            that.timer = window.setInterval(function () {
                that.Tick();
            },1000 / this.fps);
            $(this).text("Pause");
            that.playing = true;
        }
    });


    // Bind events
    $(this.div).find(".reset").click(function(event) {
        console.log("Reset clicked");
    });

    // Current point
    // Start with 0,0
    this.current_position = new OpenLayers.Geometry.Point(0, 0);
    // Start going towards positive x axis
    this.current_angle = 0;

    this.protrusions = [];
    this.microtubules = [];

    this.AddProtrusion = function(angle, length) {
        // create a line feature from a list of points
        // Start with current_position

        var newangle = that.current_angle + angle;

        var pointList = [];

        var newPoint = new OpenLayers.Geometry.Point(
                    that.current_position.x + length * Math.cos(Math.PI * newangle / 180.0),
                    that.current_position.y + length * Math.sin(Math.PI * newangle / 180.0));

        var lineFeature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString([that.current_position, newPoint]),null,{
                'strokeWidth': 2,
                'strokeColor': 'blue'
            });
        that.protrusions.push(lineFeature);
        that.vectorLayer.addFeatures(lineFeature);
    };


    this.SelectProtrusion = function (angle, length) {
        // that.vectorLayer.destroyFeatures(this.protrusions);
        var newangle = that.current_angle + angle;
        var newPoint = new OpenLayers.Geometry.Point(
                    that.current_position.x + length * Math.cos(Math.PI * newangle / 180.0),
                    that.current_position.y + length * Math.sin(Math.PI * newangle / 180.0));

        var lineFeature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString([that.current_position, newPoint]),null,{
                'strokeWidth': 5,
                'strokeColor': 'red'
            });

        that.microtubules.push(lineFeature);
        that.vectorLayer.addFeatures(lineFeature);

        that.current_position = newPoint;
        that.current_angle = newangle;
    };


    var Init = function() {
        // Adds map
        that.map = new OpenLayers.Map({
            div: $(that.div).find(".mapdiv")[0],
            controls:
                [
                new OpenLayers.Control.Navigation( // TODO: add options
                    {
                    zoomBoxEnabled: true,
                    dragPanOptions:
                        {
                        enableKinetic: true
                        },
                    mouseWheelOptions:
                        {
                        interval: 100, // TODO: is this a good delay?
                        cumulative: false
                        }
                    }),
                new OpenLayers.Control.Attribution() //TODO: why, ask DJ?
                ],
            maxExtent: new OpenLayers.Bounds(-100,-100, 100, 100),
            allOverlays: true,
            //tileSize: new OpenLayers.Size(tileSize, tileSize),
            cenPx: new OpenLayers.Pixel(0,0)
            }); // END OpenLayers.Map

        // allow testing of specific renderers via "?renderer=Canvas", etc

        /*
         * Layer style
         */
        // we want opaque external graphics and non-opaque internal graphics
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.2;
        layer_style.graphicOpacity = 1;

        /*
         * Blue style
         */
        var style_blue = OpenLayers.Util.extend({}, layer_style);
        style_blue.strokeColor = "blue";
        style_blue.fillColor = "blue";
        style_blue.pointRadius = 5;
        style_blue.strokeWidth = 2;
        style_blue.strokeLinecap = "solid";
        style_blue.title = "0,0";

        /*
         * Green style
         */
        var style_green = {
            strokeColor: "green",
            fillColor: "green",
            pointRadius: 5,
            strokeWidth: 4,
            strokeDashstyle: "solid",
            title: "50,50"
        };

        var vectorLayer = new OpenLayers.Layer.Vector("Simple Geometry", {
            style: layer_style,
            renderers: ["SVG", "SVG"],
            isBaseLayer: true
        });

        // create a point feature
        var point = new OpenLayers.Geometry.Point(0, 0);
        var pointFeature = new OpenLayers.Feature.Vector(point,null,style_blue);
        var point2 = new OpenLayers.Geometry.Point(50, 50);
        var pointFeature2 = new OpenLayers.Feature.Vector(point2,null,style_green);


        that.map.addLayer(vectorLayer);
        that.map.setCenter(new OpenLayers.LonLat(point.x, point.y), 5);
        vectorLayer.addFeatures([pointFeature, pointFeature2])

        that.vectorLayer = vectorLayer;
        that.style_green = style_green;
        that.style_blue = style_blue;

    };
    Init();

//    this.AddProtrusion(0,55, that.style_blue);
//    this.AddProtrusion(90,16, that.style_blue);
//    this.AddProtrusion(45,25, that.style_green);
//
//    this.SelectProtrusion(5, 10);
//    this.SelectProtrusion(5, 10);
//    this.SelectProtrusion(5, 10);

}
