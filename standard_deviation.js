function get_median(ary_of_numbers) {
    // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
    const n = ary_of_numbers.length;
    let median = 0;
    ary_of_numbers.sort();

    if (
        n % 2 === 0 // is even
    ) {
        // average of two middle numbers
        median = (ary_of_numbers[n / 2 - 1] + ary_of_numbers[n / 2]) / 2;
    } else { // is odd
        // middle number only
        median = ary_of_numbers[(n - 1) / 2];
    }

    return median;
}

const get_highest = (numbers) => {
    let most = 0;
    numbers.forEach((item) => {
        if (item > most) {
            most = item;
        }
    })
    return most;
}

const get_mode = (numbers) => {
    // as result can be bimodal or multi-modal,
    // the returned result is provided as an array
    // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
    var modes = [],
        count = [],
        i, number, maxIndex = 0;

    for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }

    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }

    return modes;
}

const get_mean = (ary_of_numbers) => {
    const n = ary_of_numbers.length;
    const total = ary_of_numbers.reduce((a, b) => a + b, 0)
    const mean = total / n;
    return mean;
}
const get_standard_deviation = (ary_of_numbers) => {
    const n = ary_of_numbers.length;
    const mean = get_mean(ary_of_numbers);
    let sd_before = 0;
    ary_of_numbers.forEach((item) => {
        sd_before += Math.pow((parseFloat(item) - mean), 2);
    })

    // find standard deviation
    const sd = Math.sqrt(sd_before / n);

    return sd;
}

const get_distance_from_stddev = (sd, mean, point_to_measure) => {
    // const sd =  get_standard_deviation(ary_of_numbers); 
    // const mean = get_mean(ary_of_numbers);
    let delta = point_to_measure - mean;
    let isPositive = true;
    if (delta < 0) {
        delta = Math.abs(delta);
        isPositive = false;
    }
    const distance = delta / sd;
    return distance;
}

function test() {
    console.log("\t\t****** SELF-TEST ******")
    // sd 
    const expect1 = 1.4142135623730951;
    const ary1 = [10, 11, 12, 13, 14];
    const r1 = get_standard_deviation(ary1);
    const test1 = r1 == expect1 ? "PASS stddev  " : "FAIL stddev ";
    console.log(test1 + r1)

    // median
    const expect2 = 3;
    const ary2 = [3, 5, 4, 4, 1, 1, 2, 3];
    const r2 = get_median(ary2);
    const test2 = r2 == expect2 ? "PASS median  " : "FAIL media  ";
    console.log(test2 + r2)

    // mode 
    const expect3 = JSON.stringify([1, 3, 4]);
    const ary3 = [3, 5, 4, 4, 1, 1, 2, 3];
    const r3 = get_mode(ary3);
    const test3 = expect3 == JSON.stringify(r3) ? "PASS mode  " : "FAIL mode  ";
    console.log(test3 + JSON.stringify(r3));

    // most
    const expect4 = 6;
    const ary4 = [1, 2, 3, 3, 3, 2, 4, 5, 6, 3, 2, 2];
    const r4 = get_highest(ary4);
    const test4 = r4 == expect4 ? "PASS highest  " : "FAIL most  ";
    console.log(test4 + JSON.stringify(r4));



    // standard deviations away from the mean
    // negative but small
    const ary6 = [3, 5, 4, 4, 1, 1, 2, 3];
    const sd6 = get_standard_deviation(ary6);
    const mean6 = get_mean(ary6);
    const r6 = get_distance_from_stddev(sd6, mean6, 2);
    const expect6 = 0.641688947919748;
    const test6 = r6 == expect6 ? "PASS get_distance_from_stddev  " : "FAIL get_distance_from_stddev  "
    console.log(test6 + r6);


    console.log("\t\t****** END SELF-TEST ******")
}
test();