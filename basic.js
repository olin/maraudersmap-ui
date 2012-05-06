var queryDict;

$(function () {

  queryDict = parseQuery(window.location.search);
  console.log(queryDict);
 
 
  if (queryDict.action == 'place' && queryDict.signals != null) {
    createDialog();
  }


  // Get the image height as soon as the image loads
  var imgWidth;
  var imgHeight;
  $('#map-img').on('load', function () {
    imgWidth = $('#map-img').width();
    imgHeight = $('#map-img').height();
  })

  // Put user icons at the locations of mouse clicks on mouseclick on the map image
  $('#map-img').mousedown(function(eventObject) {
    if (queryDict.action == 'place' && queryDict.signals != null) {
      var mouseX = eventObject.pageX - $('#map-img').offset().left;
      var mouseY = eventObject.pageY - $('#map-img').offset().top;

      Api.postPlace('eh4', 'lounge', 'The SLAC Realm', function (err, json) {
        console.log(err);
        var place = json.place;

        Api.postBind(queryDict.username, place.id, mouseX/imgWidth, mouseY/imgHeight, queryDict.signals, function (err, json) {
          console.log(err);          
          addUserIcon(username, mouseX, mouseY);
          reloadMapRoot();
        });

      })

    }

  });

  Api.getPositions(function (err, json) {
    var positions = json.positions;
    console.log(positions);
    for (var i=0; i < positions.length; i++) {
      Api.getBind(positions[i].bind, function (err, json) {
        var bind = json.bind;
        addUserIcon(bind.username, bind.x*imgWidth, bind.y*imgHeight);
      });
    }
  });


})

function reloadMapRoot() {
  window.location.href = window.location.origin + window.location.pathname;
}

function createDialog() {
    var dialog = document.createElement('div');
    $(dialog).prop({'id': 'location-dialog', 'class': 'modal'});
    
    var dialogHeader = document.createElement('div');
    $(dialogHeader).prop({'class': 'modal-header'});
    $(dialogHeader).appendTo(dialog);

    var dialogTitle = document.createElement('h3');
    $(dialogTitle).html("Select your Location:");
    $(dialogTitle).appendTo(dialogHeader);

    var dialogBody = document.createElement('div');
    $(dialogBody).prop({'class': 'modal-body'});    
    $(dialogBody).appendTo(dialog);

    var form = document.createElement('form');
    $(form).prop({'class': 'form-horizontal'});
    $(form).appendTo(dialogBody);

    var buildingInput = document.createElement('select');
    $(buildingInput).prop({'class': "span2"}); 
    var opt;

    opt = document.createElement('option');
    $(opt).html("Building/Floor");    
    $(opt).appendTo(buildingInput); 

    opt = document.createElement('option');
    $(opt).html("Outside");
    $(opt).appendTo(buildingInput);    

    for (var i=1; i<=4; i++) {
      opt = document.createElement('option');
      $(opt).html("West Hall " + i);    
      $(opt).appendTo(buildingInput);    
    }

    for (var i=1; i<=4; i++) {
      opt = document.createElement('option');
      $(opt).html("East Hall " + i);    
      $(opt).appendTo(buildingInput);    
    }

    for (var i=1; i<=4; i++) {
      opt = document.createElement('option');
      $(opt).html("Academic Center " + i);    
      $(opt).appendTo(buildingInput);    
    }

    for (var i=1; i<=4; i++) {
      opt = document.createElement('option');
      $(opt).html("Campus Center " + i);    
      $(opt).appendTo(buildingInput);    
    }

    for (var i=1; i<=4; i++) {
      opt = document.createElement('option');
      $(opt).html("Milas Hall " + i);    
      $(opt).appendTo(buildingInput);    
    }

    $(buildingInput).appendTo(form);

    var nameInput = document.createElement('input');
    $(nameInput).prop({'type': "text", 'class': "span3", 'placeholder': "Common Name (Ex: lounge)"});
    $(nameInput).appendTo(form);

    var aliasInput = document.createElement('input');
    $(aliasInput).prop({'type': "text", 'class': "span3", 'placeholder': "Nickname (Ex: The SLAC Realm)"});
    $(aliasInput).appendTo(form);

    var dialogFooter = document.createElement('div');
    $(dialogFooter).prop({'class': 'modal-footer'});
    $(dialogFooter).appendTo(dialog);

    var doneButton = document.createElement('a');
    $(doneButton).prop({'class': 'btn btn-primary', 'href':"#"});
    $(doneButton).html("Done");
    $(doneButton).appendTo(dialogFooter);
    $(doneButton).click(function () {$(dialog).modal('hide');});

    $(dialog).appendTo($('body'));

    
    $('#location-dialog').modal({keyboard: false});  
}

function addUserIcon(username, x, y) {
  var user = document.createElement('img');
  $(user).prop({'class': 'user', 'alt': username, 'src': 'Feet Raster.png'});
  $(user).on('load', function () {
      var userPosX = x - user.width/2.0;
      var userPosY = y - user.height/2.0;
      $(user).css({'left': userPosX, 'top': userPosY}).appendTo($('#map'));
  });
}

// Function from https://github.com/voituk/Misc/blob/master/js/hash.js
function parseQuery(str, separator) {
		separator = separator || '&'
		var obj = {}
		if (str.length == 0)
			return obj
		var c = str.substr(0,1)
		var s = c=='?' || c=='#'  ? str.substr(1) : str;

		var a = s.split(separator)
		for (var i=0; i<a.length; i++) {
			var p = a[i].indexOf('=')
			if (p < 0) {
				obj[a[i]] = ''
				continue
			}
			var k = decodeURIComponent(a[i].substr(0,p)),
				v = decodeURIComponent(a[i].substr(p+1))

			var bps = k.indexOf('[')
			if (bps < 0) {
				obj[k] = v
				continue;
			}

			var bpe = k.substr(bps+1).indexOf(']')
			if (bpe < 0) {
				obj[k] = v
				continue;
			}

			var bpv = k.substr(bps+1, bps+bpe-2) // Tim Ryan fixed problem with original code
			var k = k.substr(0,bps)
			if (bpv.length <= 0) {
				if (typeof(obj[k]) != 'object') obj[k] = []
				obj[k].push(v)
			} else {
				if (typeof(obj[k]) != 'object') obj[k] = {}
				obj[k][bpv] = v
			}
		}
		return obj;

}

