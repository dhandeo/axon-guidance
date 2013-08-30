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
//    var Traffic = {
//        start: function () {
//            this.generateTraffic("North", trafficLights[0]); // traffic for North -> South
//            this.generateTraffic("South", trafficLights[0]); // traffic for South -> North
//            this.generateTraffic("East", trafficLights[1]); // traffic for East -> West
//            this.generateTraffic("West", trafficLights[1]); // traffic for West -> East
//        },
//        generateTraffic: function (direction, light) {
//            // STATS: record that vehicle as entered the intersection
//            stats.enter(this.time());
//            sim.log("Arrive for " + direction);
//
//            // wait on the light.
//            // The done() function will be called when the event fires
//            // (i.e. the light turns green).
//            this.waitEvent(light).done(function () {
//                var arrivedAt = this.callbackData;
//                // STATS: record that vehicle has left the intersection
//                stats.leave(arrivedAt, this.time());
//                sim.log("Leave for " + direction + " (arrived at " + arrivedAt.toFixed(6) + ")");
//            }).setData(this.time());
//
//            // Repeat for the next car. Call this function again.
//            var nextArrivalAt = random.exponential(1.0 / MEAN_ARRIVAL);
//            this.setTimer(nextArrivalAt).done(this.generateTraffic, this, [direction, light]);
//        }
//    };

    sim.addEntity(MicroTubuleGrowth );
    sim.addEntity(Protrusion);

//    sim.addEntity(Traffic);
//
//    Uncomment to display logging information
    sim.setLogger(function (str) {
        console.log(str);
        document.write(str);
    });

    // simulate for SIMTIME time
    sim.simulate(SIMTIME);

    return;

}
