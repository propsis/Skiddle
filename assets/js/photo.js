
function getUsername() {
	var decodedToken = localStorage.getItem("decodedToken");
	console.log(decodedToken);
	var tokenJson = JSON.parse(decodedToken);
	return tokenJson.data.userName;
}

var userName = getUsername();


$(function() {
	if($('body').is('.profile')) {
		showProfilePicture(userName);
	}
});


function showProfilePicture(webuser) {
	var user = webuser;
	console.log(user);
	$("#profile-picture").attr("src", "profileimages/profile-pic-"+user+".jpg");
	$(".header-title").text(webuser);
}


function showDefaultPicture() {
	$("#profile-picture").attr("src", "assets/img/default-profile-pic.jpg");
}


$(function() {
    $("#change-picture").click(function() {
		capturePhoto();
	});
});



var pictureSource;  
var destinationType; 

document.addEventListener("deviceready",onDeviceReady,false);
	
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
	
}


function capturePhoto() {
 navigator.camera.getPicture(uploadPhoto, function(message) {
 console.log('get picture failed');
 }, {
 quality: 100,
 destinationType: navigator.camera.DestinationType.FILE_URI,
 sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
 });
}

function uploadPhoto(imageURI) {
	 var options = new FileUploadOptions();
	 options.fileKey = "file";
	 options.fileName = "profile-pic-"+window.user+".jpg";
	 options.mimeType = "image/jpeg";
	 console.log(options.fileName);
	 var params = new Object();
	 params.value1 = "test";
	 params.value2 = "param";
	 options.params = params;
	 options.chunkedMode = false;

	var ft = new FileTransfer();
	 ft.upload(imageURI, "assets/upload.php", function(result){
	 console.log(JSON.stringify(result));
	 window.location.reload();
	 }, function(error){
	 console.log(JSON.stringify(error));
	 }, options);
}



function getPhoto(source) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}


function onFail(message) {
    console.log('Failed because: ' + message);
}