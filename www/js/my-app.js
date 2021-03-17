  
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
  
var storageLocal = window.localstorage;
var db = firebase.firestore();

var colCateg = db.collection("categorias");
var colRecetas = db.collection("recetas");
var colUsuarios = db.collection("usuarios");

var idCategSelec = "";
var txtnombre = "";

var emailUsuario = "ivan_ranea@hotmail.com";

var maxCateg = 12;


var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
	
	
	/*
	for (i=0; i<5; i++){
		
		datos = {nombre : "Categ "+i, icono : "Icono "+i, imagen : "Imagen "+i, email: emailUsuario};
		colCateg.add(datos);
		console.log("categs creadas inicio");
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
	
	
})

$$(document).on('page:init', '.page[data-name="crearCateg"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	$$("#btncrearCateg").on("click", fnCrearCateg);
	
	$$("#imgNuevaCateg").on("click", fnSubirImagen);
	
	fnBajarImagen();


})

$$(document).on('page:init', '.page[data-name="editarCateg"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	console.log("Nombre categoría: " + txtnombre);
	var ids = [];
	var query = colCateg.where("email", "==", emailUsuario).where("nombre", "==", txtnombre);
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			ids.push(doc.id);
			
		});
		
		for(i=0; i<(ids.length); i++){
			
			if(ids[i] == idCategSelec){
				$$("#nombreEditarCateg").val(txtnombre);
			}
		}
		
		$$("#btnactualizarCateg").on("click", fnActualizarCategs);
		
	})
	.catch(function (error){
		console.log("Error");
	});

})

$$(document).on('page:init', '.page[data-name="categElegida"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	
	$$("#btnborrarCateg").on("click", fnBorrarCateg);
	
	


})

$$(document).on('page:init', '.page[data-name="crearReceta"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	
	var query = colCateg.where("email", "==", emailUsuario).orderBy("nombre");
	var agregar = "";
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			var nombre = doc.data().nombre;
			var id = doc.id;
			console.log(nombre);
			$$("#selectCateg").append("<option value='"+id+"'>"+nombre+"</option>");
			
		});
		
		$$("#btnAñadirIngrediente").on("click", fnAñadirIngrediente);
		
	})
	.catch(function (error){
		console.log("Error: " +error);
	});
	
	


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
	var query = categRef.where("email", "==", emailUsuario);
	cont = 0;
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			cont++;
			
		});
		
		console.log("cont :" + cont);
		if(cont >= maxCateg){
			app.dialog.alert("Limite de categorías alcanzado");
			return;
		}
		
		nombreCateg = $$("#nombreNuevaCateg").val();
		//iconoCateg = $$("#iconoNuevaCateg")    Tomar icono del pop up
		//imgCateg = $$("#imgNuevaCateg")       subir imagen
		
		nuevaCateg = {"nombre" : nombreCateg, "icono" : "icono1", "imagen" : "img1", "email" : emailUsuario};
		console.log("Categoría creada: ");
		colCateg.add(nuevaCateg);
		app.views.main.router.navigate("/principal/");
		
		
	})
	.catch(function (error){
		console.log("Error");
	});
	
}

function mostrarCateg (){
	
	var nombres = [];
	var idcateg = [];
	var query = colCateg.where("email", "==", emailUsuario).orderBy("nombre");
	var agregar = "";
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			nombres.push(doc.data().nombre);
			idcateg.push(doc.id);
			
		});
		
		/*var pathReference = storageImg.ref('imgs/pasta.jpg');*/
		
		

		var k = 0;
		largo = Math.ceil((nombres.length/2));
		for(j=0; j<largo; j++){
		agregar += "<div class='row'>";
		
		for(i=0; i<2 ; i++){
			if(k < nombres.length){
				
				agregar += "<a id='IDCATEG"+idcateg[k]+"' href='/categElegida/' class='col-50 button button-large button-raised categs'>"+nombres[k]+"</a>";
				k++;
				
			}else {break;}
			
		}
		agregar += "</div>";
		}
		
		$$("#contenedorCateg").append(agregar);
		
		$$(".categs").on("click", fnTomaridCateg);
		
	})
	.catch(function (error){
		console.log("Error: " +error);
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
	console.log("ID: " +idCategSelec);
	txtnombre = $$("#" + idCategSelec).text();
	console.log("nombre: " + txtnombre);
	idCategSelec = idCategSelec.replace("IDCATEG","");
	console.log("ID: " +idCategSelec);
	

}


function fnActualizarCategs(){
	
	var nuevnombre = $$("#nombreEditarCateg").val();
	//icono e img
	
	colCateg.doc(idCategSelec).update
	({nombre: nuevnombre})
	
	.then(function(){
		console.log("Actualizado");
	})
	.catch(function (error){
		
		console.log("Error: " + error);
	})
	
}

function fnBorrarCateg(){
	
	app.dialog.confirm("Esta seguro que desea borrar la categoría? </br>Las recetas de esta categoría también serán borradas.", "Borrar Categoría", function(){
		
		colCateg.doc(idCategSelec).delete()
		.then(function (){
			app.dialog.alert("Categoría borrada","Borrar Categoría");
			app.views.main.router.navigate("/principal/");
	})
	.catch(function (error){
		console.log("Error");
	});
		
		
	});
	
}



function fnAñadirIngrediente(){
	
	$$("#listaIngredientes").append(`
	
	
	
	
	`)
	
	
	
	
}

function fnSubirImagen(){
	console.log("en funcion subir Imagen");
	
	var archivo = document.getElementById("foto").files[0];
	var storage = firebase.storage();
	var storageRef = storage.ref("imagenes/pasta");
	
	storageRef.put(archivo);
	
}

function fnBajarImagen(){
	
	var storage = firebase.storage();
	storage.refFromURL("gs://mis-recetas-d4106.appspot.com/imagenes/pastas").getDownloadURL()
	.then(function(url) {
		console.log("url: "+url);
		$$("#fotosubida").attr("src", url);
		
	
	}).catch(function(error) {
		console.log("Error: "+error);
	});
}





