function mashShapes(shapeA, shapeB, slider) {
    let startingShape;
    let endingShape;
    let interpolation;
    //starting shape always has to have fewer subshapes than ending shape
    if (shapeA.length < shapeB.length) {
        startingShape = shapeA;
        endingShape = shapeB;
        interpolation = mashSeparate(startingShape, endingShape, slider);
    } else if (shapeA.length > shapeB.length) {
        startingShape = shapeB;
        endingShape = shapeA;
        interpolation = mashSeparate(startingShape, endingShape, (1 - slider));
    } else { //if both shapes have the same number of subshapes....
        interpolation = mashSame(shapeA, shapeB, slider);
    }
    return interpolation;
}

function mashSeparate(startingShape, endingShape, slider) {
    let interpolation = [];

    //create mash groupings
    let mashes = [];
    let ration = Math.round(endingShape.length / startingShape.length);
    let ori_end = endingShape.length;
    //console.log('ration: ' + ration);
    for (let i = 0; i < startingShape.length; i++) {
        let start = startingShape[i];
        //console.log('i: '+i);
        let j = i * ration;
        //console.log('j: '+j);
        let endings = [];
        while ((j < (i + 1) * ration) && (j < endingShape.length))  {
            let ending = endingShape[j];
            //console.log('ending: ');
            //console.log(ending);
            endings.push(ending);
            // if (endingShape.length == 1) {
            //     console.log('last one!');
            //     endings.push(endingShape[0]);
            // }
            //console.log('i: ' + i + ' | j: ' + j);
            j++;
        }

        if (i == startingShape.length-1) {
            while (j < endingShape.length) {
                //console.log('last grouping!');
                let ending = endingShape[j];
                endings.push(ending);
                //console.log('i: ' + i + ' | j: ' + j);
                j++;
            }

        }

        let mashup = {
            start: start,
            endings: endings
        }
        //console.log(mashup);
        mashes.push(mashup);
    }

    //once mash groupings are ready, interpolate!
    for (let k = 0; k < mashes.length; k++) {
        // console.log(k);
        // console.log(mashes[k].start);
        // console.log(mashes[k].endings);
        let interpolators = flubber.separate(mashes[k].start, mashes[k].endings);
        for (let l = 0; l < interpolators.length; l++) {
            let outcome = interpolators[l](slider);
            interpolation.push(outcome);
            //console.log(outcome);
        }
    }

    //console.log(interpolation);
    return interpolation;
}

function mashSame(shapeA, shapeB, slider) {
    //console.log('same!');
    let interpolation = [];
    let interpolators = flubber.interpolateAll(shapeA, shapeB);
    for (let j = 0; j < interpolators.length; j++) {
        let outcome = interpolators[j](slider);
        //console.log(outcome);
        interpolation.push(outcome);
    }
    //console.log(interpolation);
    return interpolation;
}