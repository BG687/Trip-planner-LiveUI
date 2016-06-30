$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

  function drawMarker (type, coords) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    marker.setMap(currentMap);
    return marker;  
  }


var dataArrays = {
  hotel: hotels,
  restaurant: restaurants,
  activity: activities
}


function itineraryMaker(title, type){
    var htmlText = '<div class="itinerary-item"><span data-type="'+type+'" class="title">'+ title +'</span><button data-action="remove" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
    return htmlText;
  }

function Day () {
  return {
  hotel: {},
  restaurant: {},
  activity: {}
}
}

var days = {
  day1: Day()
}
var currentDay = 1;

function listItinerary (selectText, selectType){
  $('.list-group-'+ selectType).append(itineraryMaker(selectText, selectType));
}

$('[data-action="add"]').on('click', function(){
  var selectType = $(this).siblings('.current-choice').data("type");
  var selectText = $(this).siblings().find(':selected').text();
  listItinerary(selectText, selectType);

  for(var i = 0; i<dataArrays[selectType].length; i++){
    if(dataArrays[selectType][i].name===selectText) days["day"+currentDay][selectType][selectText] = drawMarker('selectType', dataArrays[selectType][i].place.location); 
  }
  // if (selectType === 'hotel') {
  //   for(i=0; i<hotels.length; i++){
  //   if(hotels[i].name === selectText)  
  //     Day1[selectType][selectText] = drawMarker('selectType', hotels[i].place.location); //We are working here
  //     } 
  // }
  // if (selectType === 'restaurant') {
  //   for(i=0; i<restaurants.length; i++){
  //   if(restaurants[i].name === selectText)  
  //     Day1[selectType][selectText] = drawMarker('selectType', restaurants[i].place.location); //We are working here
  //     } 
  // }
  // if (selectType === 'activity') {
  //   for(i=0; i<activitys.length; i++){
  //   if(activitys[i].name === selectText)  
  //     Day1[selectType][selectText] = drawMarker('selectType', activitys[i].place.location); //We are working here
  //     } 
  // }
}) 

$('ul').on('click', '.remove', function(){
  event.preventDefault();
  var selectType = $(this).siblings().data("type");
  var selectText = $(this).siblings().text();
  // console.log(hotelMarkers);
  // console.log(selectText);
  days["day"+currentDay][selectType][selectText].setMap(null);

  // if (selectType === 'hotel') {
  //   hotelMarkers[selectText].setMap(null);
  //   delete hotelMarkers[selectText];
  // }
  // if (selectType === 'restaurant') {
  //   restaurantMarkers[selectText].setMap(null);
  //   delete restaurantMarkers[selectText];
  // }
  // if (selectType === 'activity') {
  //   activityMarkers[selectText].setMap(null);
  //   delete activityMarkers[selectText];    
  // }
$(this).siblings().remove(); 
$(this).remove(); 
  }) 

function switchDay(prevDay){
  console.log("called SD!");
  $('.list-group-hotel').empty();
  $('.list-group-restaurant').empty();
  $('.list-group-activity').empty();
  // var prevDay= currentDay-1;
  // console.log(days["day"+prevDay].hotel);
  clearGroup(days["day"+prevDay].hotel);
  clearGroup(days["day"+prevDay].restaurant);
  clearGroup(days["day"+prevDay].activity);
}

function reMap(type, obj){
  for(var marker in obj){
    obj[marker].setMap(currentMap);
    listItinerary(marker, type);
  }
}

function clearGroup(obj){
  console.log("CG called!");
  for (var marker in obj){
    obj[marker].setMap(null);
  }
}

$('[data-action="dayadd"]').on('click', function(){
  currentDay+=1;
  days["day"+currentDay] = Day();
  htmlText = '<button data-action= "switchdays" class="btn btn-circle day-btn" id="day'+currentDay+'">'+currentDay+'</button>';
  console.log(htmlText);
  $(this).before(htmlText);
  switchDay(currentDay-1);
  $('#daydelete').text('Day '+currentDay+' X');
})

$('.day-buttons').on('click', '[data-action="switchdays"]', function(){
  switchDay(currentDay);
  currentDay = parseInt($(this).text());
  console.log(currentDay);
  dayViewChange();
})

function dayViewChange(){
  reMap("hotel", days["day"+currentDay].hotel);
  reMap("restaurant", days["day"+currentDay].restaurant);
  reMap("activity", days["day"+currentDay].activity);
  console.log("setting cd button to", currentDay);
  $('#daydelete').text('Day '+currentDay+' X');
}

$('#daydelete').on('click', function(){
  switchDay(currentDay);
  
  for(var i=currentDay; i<days.length; i++){
    days["day"+i] = days["day"+i];
    var id = "day"+i;
    $("#"+id).text(i);

  }
  var oldLength = days.length + 2;
  delete days["day"+oldLength];
  $('#day'+oldLength).remove();
  currentDay-=1;

  dayViewChange();
})

});
