const ONE_HOUR = 60 * 60 * 1000,
      ONE_DAY = 24 * ONE_HOUR,
      ONE_WEEK = 7 * ONE_DAY,
      ONE_MONTH = 30 * ONE_DAY,
      SIX_MONTHS = 6 * ONE_MONTH;
      YEAR = 2 * SIX_MONTHS;

//add pading to the timeline
function addDays(date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}

var data = [];
var start = new Date(dates['min']);
var end = new Date(dates['max']);

//var current =

start = addDays(start, -3);
end = addDays(end, 3);
var curImg = 0;
var clicked = 0;

console.log(json);
for (var x in json) { //json lives in external file for testing
  data[x] = {};
  //console.log(json[x].name);
  data[x].name = json[x].name;
  data[x].data = [];
  for (var y in json[x].data) {
    data[x].data.push({});
    data[x].data[y].date = new Date(json[x].data[y].date);
    data[x].data[y].details = json[x].data[y].details;
  }
  data[x].display = true;
}

var timeline = d3.chart.timeline()
  .end(end)
  .start(start)
  .minScale(ONE_MONTH / YEAR)
  .maxScale(ONE_DAY/ONE_HOUR)
  .lineHeight(10)
  .contextHeight(50)
  // .axisFormat((axis) =>
  //     axis.ticks(d3.timeDay.every(15)),
  // )
  .tickFormat([
    [' ', (d) => d.getMilliseconds()],
    [' ', (d) => d.getSeconds()],
    [' ', (d) => d.getMinutes()],
    [' ', (d) => d.getHours()],
    ['%b %d', (d) => d.getMonth() && d.getDate()],
    ['%b', (d) => d.getMonth()],
    ['%Y', () => true]
  ])
  .eventHover(function(el){
    var attr = $(this).attr('hover')
    $(this).text('⬤');
    var tags = "";
    for (i in el.details.tags){
      tags += '<p class="badge badge-info">'+el.details.tags[i]+'</p>';
    }

    if( tags !== ""){
      $('.hover').css('left', d3.event.pageX-20);
      $('.hover').css('top', d3.event.pageY+20);
      $('.hover').css('display', 'block');
      $('.hover').html('<div class="tooltip-top"><div class="tt shadow-lg p-1 mb-5">' + 
                        tags + '<div class="clear"><?div></div></div>');
      $(this).mouseleave(function() {
          $('.hover').empty();
        }
      );
    };

    $(this).mouseleave(function() {
      var attr = $(this).attr('clicked');
      if (attr === undefined)  $(this).text('◯');
    });

  })
  .eventClick(function(el) {
    $("text[connected = true]").text('◯');
    $("text[connected = true]").removeAttr('connected');
    $("text[clicked = true]").text('◯');
    $("text[clicked = true]").removeAttr('clicked');
    var attr = $(this).attr('clicked');
    $('#commonality').empty();

    if (attr !== undefined){
      $('.info').fadeTo("slow", 0);
      $('.info').css('display', 'none');
      $("text[fill='black']").removeAttr('fill');
      $(this).text('◯');
      $(this).removeAttr('clicked');
    } else {
      $('.text').text(el.details.message);
      if (el.details.isCommon === 0) {
        $('#find_commonality').attr("disabled", "disabled");
      }


      curImg = 0;
      $.post('/img/'+ el.details.name).done(function(data){
        $('.imgs').empty();
        for( img in data){
          var display = img > 0 ? 'none' : 'block';
          $(".imgs").append(
            '<img id="' +img+'" style="width:100%; display:'+display+'" class="mySlides" src="/static/'+data[img]+'">');
        }
      });
      $('.info').fadeTo("slow", 1);
      $('.info').css('display', 'block');
      $(this).attr('clicked', true);

    }
  })
  .eventShape('◯')
  .eventLineColor((d,i) => {
      switch (i % 2) {
        case 0:
          return "#0088ce";
        case 1:
          return "#cc0000";
      }
  });


if(countNames(data) <= 0) {
  timeline.labelWidth(60);
}

var element = d3.select('#pf-timeline').append('div').datum(data.filter(function(eventGroup) {
  console.log("group: " + eventGroup);
  return eventGroup.display === true;
}));
timeline(element);

function countNames(data) {
  var count = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].name !== undefined && data[i].name !=='') {
      count++;
    }
  }
  return count;
}

function zoomFilter() {

  startDate = start;
  endDate = end;

  timeline.Zoom.zoomFilter(start, end);
}


$('.close').click(function(el){
  $("text[connected = true]").text('◯');
  $("text[connected = true]").removeAttr('connected');
  $("text[clicked = true]").removeAttr('clicked');
  console.log("closed");
  $('.info').fadeTo("slow", 0);
  $('.info').css('display', 'none');
  $('#commonality').empty();
});

$('#find_commonality').click(function(){

   $('#commonality').empty();

   curr = $("text[clicked = true]");
   isCommon = curr.attr('data-content').match(new RegExp("IsCommon: " + "(.*)" + "Message"))[1].replace('<br>','');
   if (isCommon === '1'){
     $('#find_commonality').popover('disable');
     curr.attr('connected', true)

     // Find the news that shares common
     common_index = curr.attr('data-content').match(new RegExp("Common: " + "(.*)" + "IsCommon"))[1].replace('<br>','');
     common = $("text[data-content*='Name: "+common_index+"<br>']")
     common.text('⬤')
     common.attr('connected', true)

     var line1 = createLine(curr,common);
     $('#commonality').append(line1);
   } else {
     $('#find_commonality').popover('enable');
   }
   $('#find_commonality').popover('disable');

})

function showImage(next){

  var imgNum = $(".imgs img").length;
  hide = curImg;
  curImg = curImg + next;

  if (curImg < 0){
    curImg = imgNum -1;
  } else if (curImg == imgNum){
    curImg = 0; 
  }

  $('#'+hide).css('display', 'none');
  $('#'+curImg).css('display', 'block');
}

function createLine(el1, el2){
  var off1 =getElementProperty(el1);
  var off2 =getElementProperty(el2);
  // center of first point
  var dx1 = off1.left + off1.width;
  var dy1 = off1.top + off1.height;
  // center of second point 
  var dx2 = off2.left + off2.width;
  var dy2 = off2.top + off1.height;
  
  // distance
  var length = Math.sqrt(((dx2-dx1) * (dx2-dx1)) + ((dy2-dy1) * (dy2-dy1)));
  // center
  var cx = ((dx1 + dx2) / 2) - (length / 2);
  var cy = ((dy1 + dy2) / 2) - (2	 / 2);
  // angle
  var angle = Math.atan2((dy1-dy2),(dx1-dx2))*(180/Math.PI);
  // draw line
  console.log("line created");
  return  "<section class='connectingLines' style='left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -webkit-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);'></section>"
}

function getElementProperty(el){
	var dx = 0;
	var dy = 0;
	var width = 16
  var height = 16;

  dx = el.position().left;
  dy = el.position().top;

  return { top: dy, left: dx, width: width, height: height };
}

$(window).on('resize', function() {
  timeline(element);
});