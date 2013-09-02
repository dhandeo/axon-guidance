function AxonGrowthSimulation(MEAN_PROTRUSION_LENGTH, MEAN_PROTRUSION_CREATION, MEAN_PROTRUSION_WITHDRAW, MEAN_TUBULE_SELECTION, SIMTIME, SEED) {
    var SPREAD = 30;
    var sim = new Sim();
    var random = new Random(SEED);
    var protrusions = [];

    var MicroTubuleGrowth = {
        //currentLight: 0,  // the light that is turned on currently
        start: function () {
            // pick a random number and select the protrusion
            var sel = random.random();

            sim.log("MicroTubule selects protrusion #" + parseInt(sel*protrusions.length));
//            sim.log("------------------------------------------");
            protrusions = [];
            // Repeat every GREEN_TIME interval
            this.setTimer(random.random()*MEAN_TUBULE_SELECTION).done(this.start);
        }
    };

    var Protrusion = {
        start: function () {
            var length = random.random()*MEAN_PROTRUSION_LENGTH;
            var direction = random.normal(0,SPREAD);
            protrusions.push([length, direction]);
            // Repeat every GREEN_TIME interval
            sim.log("Protrusion created  @" + direction + " and " + length);
            this.setTimer(random.random()*MEAN_PROTRUSION_CREATION).done(this.start);
        }
    };

    sim.addEntity(MicroTubuleGrowth );
    sim.addEntity(Protrusion);
    var results = [];

    // Display logging information
    sim.setLogger(function (str) {
        // console.log(str);
        results.push(str);
        $("#log").append(str + "<br/>");
    });

    // simulate for SIMTIME time
    sim.simulate(SIMTIME);

    return results;

}
