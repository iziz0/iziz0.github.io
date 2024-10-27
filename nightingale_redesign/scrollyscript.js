// using d3 for convenience
var main = d3.select('main')
var scrolly = main.select('#scrolly');
var figure = main.select('figure');
var article = scrolly.select('article');
var newstep = article.selectAll('.newstep');

// initialize the scrollama
var scroller = scrollama();


// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.style('height', stepH + 'px');

    var figureHeight = window.innerHeight / 2
    var figureMarginTop = (window.innerHeight - figureHeight) / 2

    figure
        .style('height', figureHeight + 'px')
        .style('top', figureMarginTop + 'px');


    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}

var move_counter = 0

function disableScroll(event) {

    scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop;
    scrollLeft =
        window.pageXOffset ||
        document.documentElement.scrollLeft;

    window.onscroll = function () {
        if (move_counter < 50) {
            window.scrollTo(scrollLeft, scrollTop, {behavior:"smooth"});
            move_counter += 1;
            // console.log(move_counter);
        } else {
            move_counter = 0;
            window.onscroll = function () { };
        }
    }
}

// scrollama event handlers
function handleStepEnter(response) {

    newstep.classed('is-active', function (d, i) {
        return i === response.index;

    })

    // update graphic based on step
    figure.select('stats').text(response.element.attributes[1].value);
    figure.select('army').text(response.element.attributes[2].value);
    figure.select('wound').text(response.element.attributes[3].value);
    figure.select('des').text(response.element.attributes[4].value);
    figure.select('other').text(response.element.attributes[5].value);
    console.log(response.element.attributes[1].value)
    // slow the users scrolling
}


    function handleStepExit(response) {
    // if(response.index == 1){
    //     document.getElementById("first_step").classList.add('is-active');
    // }


}

function setupStickyfill() {
    d3.selectAll('.sticky').each(function() {
        Stickyfill.add(this);
    });
}

function init() {
    setupStickyfill();

    document.getElementById("first_step").classList.add('is-active');

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    // handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
        step: '#scrolly article .newstep',
        offset: .53,
       //debug: true,
    })
        .onStepEnter(handleStepEnter)


    // setup resize event
    window.addEventListener('resize', handleResize);
}
// kick things off
init();

