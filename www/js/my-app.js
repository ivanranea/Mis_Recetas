  
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
	  {
        path: '/editarCateg/',
        url: 'editarCateg.html',
      },
	  {
        path: '/editarReceta/',
        url: 'editarReceta.html',
      },
    ]
    // ... other parameters
  });
  
var storage = window.localstorage;
var db = firebase.firestore();
var colCateg = db.collection("categorias");
var colRecetas = db.collection("recetas");
var colUsuarios = db.collection("usuarios");

var idCategSelec = "";

var emailUsuario = "ivan_ranea@hotmail.com";

var maxCateg = 12;
var idArray = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
var lastID = "";

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
	
	/*var id = "";
	
	
	for (i=0; i<5; i++){
		
		datos = {nombre : "Categ "+i, icono : "Icono "+i, imagen : "Imagen "+i, email: emailUsuario};
		id = i.toString();
		colCateg.doc(id).set(datos);
	}*/
	
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
	
	mostrarCateg();
	$$(".categs").on("click", fnTomaridCateg);
	
})

$$(document).on('page:init', '.page[data-name="crearCateg"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	$$("#btncrearCateg").on("click", fnCrearCateg);
	$$("#imgNuevaCateg").on("click", fnGaleria);


})

$$(document).on('page:init', '.page[data-name="editarCateg"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	console.log(idCategSelec);
	var query = colCateg.doc("idCategSelec");
	query.get()
	.then((doc) => {
    if (doc.exists) {
        
		var nombre = doc.data().nombre;
		//traer icono e imagen 
		
		$$("#nombreEditarCateg").val(nombre);
		
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
	}).catch((error) => {
		console.log("Error getting document:", error);
	});

})

$$(document).on('page:init', '.page[data-name="categElegida"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	
	
	
	


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


function fnCrearCateg(){
	
	var categRef = colCateg;
	var query = categRef.where("Email", "==", emailUsuario);
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			lastID = doc.id;
		});
		
		console.log("last id after get; " + lastID);
	
		lastID = parseInt(lastID);
		if(lastID >= maxCateg){
			alert("Limite de categorías alcanzado");
			return;
		}
		
		nombreCateg = $$("#nombreNuevaCateg").val();
		//iconoCateg = $$("#iconoNuevaCateg")    Tomar icono del pop up
		//imgCateg = $$("#imgNuevaCateg")       subir imagen
		
		nuevaCateg = {"nombre" : nombreCateg, "icono" : "icono1", "imagen" : "img1", "Email" : emailUsuario};
		
		id = lastID + 1;
		id = id.toString();
		colCateg.doc(id).set(nuevaCateg);
		
	})
	.catch(function (error){
		console.log("Error");
	});
	
}

function mostrarCateg (){
	
	var nombres = [];
	var idcateg = [];
	var categRef = colCateg;
	var query = categRef.where("email", "==", emailUsuario);
	var agregar = "";
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			nombres.push(doc.data().nombre);
			idcateg.push(doc.id);
			
		});
		console.log("length: "+nombres.length);
		var k = 0;
		largo = Math.ceil((nombres.length/2));

		for(j=0; j<largo; j++){
		agregar += "<div class='row'>";
		
		for(i=0; i<2 ; i++){
			if(k < nombres.length){
			
				agregar += "<a id='"+idcateg[k]+"' href='/categElegida/' class='col-50 button button-large button-raised categs'>"+nombres[k]+"</a>";
				k++;
				
			}else {break;}
			
		}
		agregar += "</div>";
		}
		
		$$("#contenedorCateg").append(agregar);
		
		
		
	})
	.catch(function (error){
		console.log("Error");
	});
	
	
}

function fnGaleria() {

}

function onSuccessCamara(imageURI){
	  $$("#foto").attr("src", imageURI);

}

function onErrorCamara(){
	
	
}

function fnTomaridCateg(){
	idCategSelec = this.id;
	console.log("id sleccionado: " +idCategSelec);
}
