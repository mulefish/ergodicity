const getFloatValue = id => {
    const widget = document.getElementById(id);
    const v = parseFloat(widget.options[widget.selectedIndex].text);
    return v;
}
const getIntValue = id => {
    const widget = document.getElementById(id);
    const v = parseInt(widget.options[widget.selectedIndex].text);
    return v;
}

function run() {
    const upPercentage = getFloatValue('upside');
    const downPercentage = getFloatValue('downside');
    const iterations = getIntValue('iterations');

    doit(upPercentage, downPercentage, iterations);
}
const UP = 'up';
const DOWN = 'down';
let runCount = 0;
let runningTotal = 0;
let runSummary = [];
let runResults = [];
const doit = (up, down, iterations) => {
    let bankroll = 100;
    let most = 0;
    let results = [{
        bankroll,
        result: 'start'
    }];
    for (let i = 0; i < iterations; i++) {

        const r = Math.random();
        let result = UP;
        if (r > 0.5) {
            const more = bankroll * up;
            bankroll += more;
            result = UP;
        } else {
            const less = bankroll * down;
            bankroll -= less;
            result = DOWN;

        }
        results.push({
            bankroll,
            result
        });

        // needed for gui 
        if (most < bankroll) {
            most = bankroll;
        }
    }
    runCount++;
    let endingValue = results[results.length - 1].bankroll;
    runningTotal += endingValue;
    runSummary.push({
        end: endingValue
    });


    ave = runningTotal / runCount;

    document.getElementById("run").innerHTML = runCount;
    document.getElementById("total").innerHTML = runningTotal.toFixed(0);
    document.getElementById("average").innerHTML = ave.toFixed(0);

    makeThisRunGUI(results, most);
    runResults.push(endingValue)

    createLeafChart_ofStdDev(runResults);
}


const createLeafChart_ofStdDev = (ary_of_final_results_of_each_run) => {
    // 1: 'results' is an array of the values of the _last_ iteration of each run. 
    // 2: This method will graph out the distance from stddev each the endings of each run against all the runs

    const n = ary_of_final_results_of_each_run.length;
    const maxPixles = 250;
    const sd = get_standard_deviation(ary_of_final_results_of_each_run);
    const mean = get_mean(ary_of_final_results_of_each_run);




    let ary_of_sd = [];
    let most_distance = 0;

    let winners = 0;
    let losers = 0;
    let tie = 0 
    ary_of_final_results_of_each_run.forEach((amount, i) => {
        if ( amount < 100 ) {
            losers++; 
            console.log( " L amount " + amount )
        } else if ( amount > 100 ) {
            winners++; 
            console.log( " W amount " + amount )
        } else {
            tie++; 
            console.log( " T amount " + amount )

        }
    });

    ary_of_final_results_of_each_run.forEach((amount, i) => {
        let obj = {}
        if (sd == 0) {
            // the first time through, it will be 0 
            obj = {
                distance: 0,
                amount: amount,
                isPositive: true
            };
        } else {
            const distance = get_distance_from_stddev(sd, mean, amount);
            // console.log( "sd " + sd + " distance " + distance + " mean " + mean + " amount " + amount )

            if (distance > most_distance) {
                most_distance = distance;
            }
            obj = {
                distance: distance,
                amount: amount,
                isPositive: amount < mean ? false : true
            };
        }
        ary_of_sd.push(obj);
    });

    ary_of_sd.forEach((obj, i) => {
        obj.pixels = maxPixles * obj.distance / most_distance;
    });

    let html = `
    Standard Deviations of the runs
    <table border='1'>
        <tr>
        <td>Mean</td><td>${mean.toFixed(0)}</td>
        <td>Losers</td><td>${losers}</td>
        <td>Winners</td><td>${winners}</td>
        <td>Tied</td><td>${tie}</td>
        
        </tr></table>
            <table border='1'>
            <tr>
            <td>run</td>
            <td class='r'>dollars</td>
            <td align='right'>- standard deviaions</td>
            <td>&nbsp;</td>
            <td>+ standard deviations</td>
         	</tr>`

    ary_of_sd.forEach((obj, i) => {


        let made_or_lost_money_css = 'made_money';
        if (obj.amount < 100) {
            made_or_lost_money_css = 'lost_money';
        }


        html += `<tr>
        <td class='r'>${i}</td>

        <td  class=${made_or_lost_money_css}>${obj.amount.toFixed(0)}
        `
        if (obj.isPositive == true) {
            // yay
            const cssClass = 'paleGreen';
            html += `
            <td></td>
            <td>&nbsp;</td>
            <td align="left"> <div class='${cssClass}' style='width:${obj.pixels}'; >${obj.distance.toFixed(2)}</div> </td>
            </tr>`
        } else {
            // boo
            const cssClass = 'lightOrange';
            // The '&nbsp;' to prevent the number from peeking out of its cell
            html += `
            <td align="right" >   <div class='${cssClass}' style='width:${obj.pixels}'; >${obj.distance.toFixed(2)} &nbsp;&nbsp;</div> </td>
            <td>&nbsp;</td>
            <td></td>
            </tr>`

        }

    });
    document.getElementById("stddev").innerHTML = html;
}


const makeThisRunGUI = (results, most) => {
    const maxPixles = 500;
    results.forEach((result) => {
        result.pixels = maxPixles * result.bankroll / most;
    });


    let html = `<table border='1'>
            <tr>
                <td colspan='3'>Numbers will never actually reach 0 but to the right of the decimal is not being shown.</td>
            </tr>
         	<tr>
                 <th>i</th>
                 <th>up/down</th>
         		<th>Bankroll ( green = $100+ )</th>
         	</tr>`

    results.forEach((item, i) => {
        const dollar = "&nbsp;&nbsp;" + item.bankroll.toFixed(0);
        const up_or_down = item.result == UP ? 'paleGreen' : 'lightOrange';
        let made_or_lost = 'tie_money2';
        if ( item.bankroll > 100 ) {
            made_or_lost = 'made_money2';
        } else if ( item.bankroll < 100 ) {
            made_or_lost = 'lost_money2';
        }

        html += `<tr>
                     <td class='r'>${i}</td>
                     <td><div class='${up_or_down}' >&nbsp;</div></td>
         			<td> <div class='${made_or_lost}' style='width:${item.pixels}'; >${dollar}</div> </td>
         			</tr>`

    });
    document.getElementById("content").innerHTML = html;
}

/////// standard dev 