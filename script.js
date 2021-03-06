function showPlacesNearMe() {
	var output = document.getElementById( 'places-list' );

	/* Learn about this code on MDN: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API */
	if ( !navigator.geolocation ) {
		output.innerHTML = '<p>Geolocation is not supported by your browser</p>';
		return;
	}

	function success( position ) {
		var latitude  = position.coords.latitude,
			longitude = position.coords.longitude,
			api_endpoint =
            'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates%7Cpageimages%7Cdescription%7Cinfo&inprop=url&pithumbsize=144&generator=geosearch&format=json&ggsradius=10000&ggslimit=10&ggscoord=' +
            latitude + '%7C' + longitude;  

		$.ajax( {
			url: api_endpoint, 
			dataType: 'jsonp',
			success: function( data ) {
				var places = data && data.query && data.query.pages,
					no_thumb = 'https://upload.wikimedia.org/wikipedia/commons/7/75/Gnome-image-missing.svg',
					title, description, articleUrl, thumbnail, distance,
					response = '';


				for ( var k in places ) {
					if ( !places.hasOwnProperty( k ) ) {           
						continue;
					}

					title = places[ k ].title;
					description = places[ k ].description || '';
					articleUrl = places[ k ].fullurl;

					thumbnail = ( places[ k ].thumbnail && places[ k ].thumbnail.source ) || no_thumb;

					distance = getDistanceFromLatLonInKm( places[ k ].coordinates[ 0 ].lat, 
						places[ k ].coordinates[ 0 ].lon, latitude, longitude );

					response +=
                        '<div class="item"><hr class="col-xs-12"><div class="col-xs-8 no-padding"><h5><a href="' +
                        articleUrl + '" target="_blank">' +
                        title + '</a></h5><h6>' +
                        description + '</h6><p>' + distance +
                        ' miles from your location</p></div><div class="col-xs-4 no-padding"><img height="80" src="' +
                        thumbnail + '"></div></div>';
				}
				output.innerHTML = response;
			}
		} ); 
	}

	function error() {
		output.innerHTML = 'Unable to retrieve your location';
	}

	output.innerHTML = '<p>Searching...</p>';

	navigator.geolocation.getCurrentPosition( success, error );
}

/* Solution from https://stackoverflow.com/a/27943 */
function getDistanceFromLatLonInKm( lat1, lon1, lat2, lon2 ) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad( lat2 - lat1 );
	var dLon = deg2rad( lon2 - lon1 );
	var a = 
        Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
        Math.cos( deg2rad( lat1 ) ) * Math.cos( deg2rad( lat2 ) ) * 
        Math.sin( dLon / 2 ) * Math.sin( dLon / 2 ); 
	var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) ); 
	var d = R * c * 0.6; // Distance in miles
	return d.toFixed( 2 ); 
}

function deg2rad( deg ) {
	return deg * ( Math.PI / 180 );
}
