  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

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

function fnRegistrarUsuario(){
	
	nombre = $$("#nombregistro").val();
	email = $$("#emailregistro").val();
	password = $$("#passregistro").val();
	
	console.log("nombre: "+ nombre +", email: "+email+", pass: "+ password);
	
/*	firebase.auth().createUserWithEmailAndPassword(email, password)
	.then(function (){
		
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
	alert("q paso?")*/
}


