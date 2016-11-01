
$(function() {
	
	if($('body').is('.index')) {
		navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
		/* based on country code check if there is file named /location-countrycode-words.txt
		-> if not: disable checkbox location-words
		*/
		

	}
});


$(function() {
	
	if($('body').is('.game-menu')) {
		
		$('#time-slider').noUiSlider({
			start: 90,
			connect: "lower",
			range: {
				min: 60,
				max: 300
			}
		});
		resetTimer();
		
		if (countryIsValid == 'true') {
				console.log(localStorage.getItem('countryIsValid'));
				
		} else {
			console.log(localStorage.getItem('countryIsValid'));
			$("#location-words").prop('disabled', true);
		}
	}
});


$(function() {
	if($('body').is('.playpage')) {
		setRandomWord();
		startTimer(window.countdownTime, document.querySelector('#remaining-time'));
	}


	$(".word-is-done").click(function() {
		saveDoneWordtoList(window.chosenWord);
	});


	$(".skip-word").click(function() {
		saveSkippedWordtoList(window.chosenWord);
	});
	
	
	//for testing
	$(".emptyWordsList").click(function() {
		allWords = [];
	});
});


function listWordsOnPage(array, element) {
	for (var i=0; i < array.length; i++) {
		$(element).append("<li><span>"+array[i]+"</span></li>");
	}
}

$(function() {
	if($('body').is('.gameover')) {
		resetTimer();
		listWordsOnPage(roundDoneWords, '#list-done-words');
		listWordsOnPage(roundSkippedWords, '#list-skipped-words');
	}
	
	$('.play-again').click(function() {
		emptyArray(roundDoneWords, 'roundDoneWords');
		emptyArray(roundSkippedWords, 'roundSkippedWords');
		window.location = "playpage.html";
	});
});
		

$(function() {
    $(".take-picture").click(function() {
		capturePhotoEdit();
	});
});





var allWords = JSON.parse(localStorage.getItem('allWords')) || [];
var gamemodes = JSON.parse(localStorage.getItem('gamemodes')) || [];
var roundDoneWords = JSON.parse(localStorage.getItem('roundDoneWords')) || [];
var roundSkippedWords = JSON.parse(localStorage.getItem('roundSkippedWords')) || [];

$(function() {
    $("#handle-settings").click(function() {
		gamemodes = [];
		emptyArray(roundDoneWords, 'roundDoneWords');
		emptyArray(roundSkippedWords, 'roundSkippedWords');
		
		//allWords is emptied when app is closed? 
		
		if ($('#explain-words').is(':checked')) {
			gamemodes.push("explain");
		}
		if  ($('#mime-words').is(':checked')) {
			gamemodes.push("mime");
		}
		if  ($('#location-words').is(':checked')) {
			gamemodes.push("locationwords");
		}
		
		localStorage.setItem("gamemodes", JSON.stringify(gamemodes));
		window.location = "playpage.html";
	});
});


function resetTimer() {
	countdownTime = 20;
	localStorage.setItem('countdownTime', parseInt(countdownTime));
}

function emptyArray(array, element) {
	array = [];
	localStorage.setItem(element, JSON.stringify(array));
}



function wordFromFile(fileName) {
	return $.get(fileName).then(function(data) {
		var lines = data.split("\n");
		var randomIndex = Math.floor(Math.random() * lines.length);
		var word = lines[randomIndex];
		window.chosenWord = word;
		if (wordIsUsed(word)) {
			wordFromFile(fileName);
		}
		return word;
	});
}


//If you return a promise, the next 'then' in the chain will use the value that the promise resolves to.


function wordIsUsed(word) {
	var allWordsList = JSON.parse(localStorage.getItem("allWords"));
	var isUsed = false;
	if (allWordsList.length == 0) {
		return false;
	} else {
		for (i=0; i < allWordsList.length; i++) {
			if (word == allWordsList[i]) {
				return true;
			}
		}
	}
	return false;
}

var chosenWord; //nollaantuu aina kun uusi sivu ladataan

function setRandomWord() {
	var randomMode = gamemodes[Math.floor(Math.random() * gamemodes.length)];
	console.log("random: "+randomMode+", modes:" +gamemodes);
	console.log("allWords:" +JSON.parse(localStorage.getItem('allWords')));
	
	if (randomMode == "explain" || randomMode == "locationwords") {
		$('#word-title').append("<h3>Explain it!</h3>");
	} else {
		$('#word-title').append("<h3>Mimic it!</h3>");
	}
	
	if (randomMode == "explain") {
		return wordFromFile("http://scoctail.com/english-explain-words.txt").then(appendWord);
	} else if (randomMode == "mime") {
		return wordFromFile("http://scoctail.com/english-mime-words.txt").then(appendWord);
	} else if (randomMode == "locationwords") {
		return wordFromFile("http://scoctail.com/location-"+countrycode+"-words.txt").then(appendWord);
	}
}

function appendWord(word) {
	$('.word').text(word);
	saveWordToAllWordsList(window.chosenWord);
}



function saveDoneWordtoList(word) {
	roundDoneWords.push(word);
	localStorage.setItem('roundDoneWords', JSON.stringify(roundDoneWords));
}

function saveSkippedWordtoList(word) {
	roundSkippedWords.push(word);
	localStorage.setItem('roundSkippedWords', JSON.stringify(roundSkippedWords));
}

function saveWordToAllWordsList(word) {
	allWords.push(word);
	localStorage.setItem('allWords', JSON.stringify(allWords));
}





function startTimer(duration, display) {
    var start = Date.now(), //milliseconds
        diff,
        minutes,
        seconds;
    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds; 
		localStorage.setItem('countdownTime', parseInt(diff));

        if (diff <= 0) {
            start = Date.now() + 1000;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
	
	window.setTimeout(function() {
	window.location = "gameover.html"}, duration*1000);
}

var countdownTime = parseInt(localStorage.getItem('countdownTime'));




var countrycode = localStorage.getItem('countrycode');

var onLocationSuccess = function(position) {
        getCountrycode(position.coords.latitude, position.coords.longitude);
    };

    // onError Callback receives a PositionError object
    //
function onLocationError(error) {
     alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }

	
var countryIsValid = localStorage.getItem('countryIsValid');
	
function getCountrycode(lat, lng) {
	grid = codegrid.CodeGrid();
	grid.getCode(lat, lng, function (error, code) {
		if (error) {
			console.log("Error: could not get country code");
		}
		countrycode = code;
		localStorage.setItem('countrycode', countrycode);
		console.log("current countrycode: " +countrycode);
		
		$.ajax({
			type: 'HEAD',
			url: 'http://scoctail.com/location-'+countrycode+'-words.txt',
			success: function() {
				console.log("page found");
				countryIsValid = 'true';
				localStorage.setItem('countryIsValid', countryIsValid);
			},
			error: function() {
				console.log("page NOT FOUND");
				countryIsValid = 'false';
				localStorage.setItem('countryIsValid', countryIsValid);
			}
		});
		
	});
}



    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 
    // Wait for PhoneGap to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);
    // PhoneGap is ready to be used!
    //
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64 encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true }); 
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
    }