  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var storage = window.localstorage;

var state = "";


var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/registro/',
        url: 'registro.html',
      },
	  {
        path: '/principal/',
        url: 'principal.html',
      },
	  {
        path: '/index/',
        url: 'index.html',
      },
	  {
        path: '/categElegida/',
        url: 'categElegida.html',
      },
	  {
        path: '/crearCateg/',
        url: 'crearCateg.html',
      },
	  {
        path: '/crearReceta/',
        url: 'crearReceta.html',
      },
	  {
        path: '/favoritos/',
        url: 'favoritos.html',
      },
	  {
        path: '/perfil/',
        url: 'perfil.html',
      },
	  {
        path: '/buscador/',
        url: 'buscador.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
	
	
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized

})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	
	$$("#btnregistro").on("click", fnRegistrarUsuario);

})


$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	
	$$("#btnlogin").on("click", fnLogin);
	
	
	
	

})

$$(document).on('page:init', '.page[data-name="principal"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	
	for(j=0; j<2; j++){
	$$("#contenedorCateg").append("<div class='row'>");
	
	for(i=1; i<=2 ; i++){
		
		$$("#contenedorCateg").append("<a href='#' class='col-50 button button-large button-raised'>Categoría "+i+"</a>");
		
	}
	
	$$("#contenedorCateg").append("</div>");
	}

})

$$(document).on('page:init', '.page[data-name="crearCateg"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	$$("#btncrearCateg").on("click", fnCrearCateg);


})

function fnRegistrarUsuario(){
	
	nombre = $$("#nombRegistro").val();
	email = $$("#emailRegistro").val();
	password = $$("#passRegistro").val();
	console.log("nombre: "+ nombre +", email: "+email+", pass: "+ password);
	
	firebase.auth().createUserWithEmailAndPassword(email, password) //Registro de usuario
	.then(function (){
		
		firebase.auth().signInWithEmailAndPassword(email, password) //Si se registra correctamente, hace el login automáticamente
		.then((user) => {
			
		app.views.main.router.navigate("/principal/");
		
		})
		.catch((error) => {
		var errorCode = error.code;
		var errorMessage = error.message;
		if(errorCode == "auth/wrong-password"){
			
			$$("#passInfo").html("Contraseña incorrecta");
			$$("#passInfo").addClass("text-color-red");
			
		}
		if(errorCode == "auth/user-not-found"){
			
			$$("#emailInfo").html("E-mail incorrecto");
			$$("#emailInfo").addClass("text-color-red");
			
		}
		
		});
		
		//mandar mail de verificacion
		
	})
	.catch(function(error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	if (errorCode == 'auth/weak-password') {
	alert('Clave muy débil.');
	} else {
	alert(errorMessage);
	}
	console.log(error);
	});

}

function fnLogin(){ //Log in
	
	email = $$("#emailLogin").val();
	password = $$("#passLogin").val();
	checkRecordar = $$("#recordarUsuario").prop("checked");
	console.log(checkRecordar);
	
	firebase.auth().signInWithEmailAndPassword(email, password)
	.then((user) => {
		if(checkRecordar == true){
			var usuario = { "email" : email, "password" : password, "nombre" : nombre};
			usuarioAGuardar = JSON.parse(usuarioAGuardar);
			usuarioAGuardar.email = email;
			
		}
		app.views.main.router.navigate("/principal/"); //En log in exitoso invoca la página Principal
		
	})
	.catch((error) => {
		var errorCode = error.code;
		var errorMessage = error.message;
		if(errorCode == "auth/wrong-password"){
			
			$$("#passInfo").html("Contraseña incorrecta");
			$$("#passInfo").addClass("text-color-red");
			
		}else if(errorCode == "auth/user-not-found"){
			
			$$("#emailInfo").html("E-mail incorrecto");
			$$("#emailInfo").addClass("text-color-red");
			
		}
	});
}


/*function fnCrearCateg(){
	
	nombreCateg = $$("#nombreNuevaCateg").val();
	//iconoCateg = $$("#iconoNuevaCateg")    Tomar icono del pop up
	//imgCateg = $$("#imgNuevaCateg")
	
	nuevaCateg = {"nombre" : nombreCateg, "icono" : iconoCateg, "imagen" : imgCateg};
	
	
	
	
	
}*/

/*function mostrarCateg (){
	
	$$("#contenedorCateg").html("<div class='row'>");
	
	for(i=1; i<=2 ; i++){
		
		$$("#contenedorCateg").html("<a href='#' class='col-50 button button-large button-raised'>Categoría "+i+"</a>");
		
	}
	
	$$("#contenedorCateg").html("</div>");
	
	
	
}*/