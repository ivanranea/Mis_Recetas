  
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
	  {
        path: '/recetaElegida/',
        url: 'recetaElegida.html',
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
var idRecetaSelec = "";
var idRecetaBorrar = "";
var txtnombre = "";
var contIngred = 0;
const maxCateg = 12;
var IDingredientes = [];
var recetaId = "";
var nuevoIngredienteUpdate = 0;

const emailUsuario = "ivan_ranea@hotmail.com";




var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
	
		$$("#toolbarInferior").addClass("oculto");
		$$("#IconoBack").addClass("oculto");
		$$("#upperNavbar").addClass("oculto");
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
	$$("#titulonavbar").text("Registro");
	fnIconobackVisible();
	fnNavbarVisible();
	

})


$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	$$("#upperNavbar").addClass("oculto");
	fnToolbarkOculto();
	fnIconobackOculto();
	fnNavbarOculto();
	$$("#btnlogin").on("click", fnLogin);
	$$("#btntest").on("click", fnTest);

})

$$(document).on('page:beforein', '.page[data-name="principal"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	$$("#contenedorCateg").html("");
})

$$(document).on('page:afterin', '.page[data-name="principal"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	fnToolbarkVisible();
	fnIconobackOculto();
	fnNavbarVisible();
	$$("#titulonavbar").text("Categorías");
	mostrarCateg();
	
	
})

$$(document).on('page:init', '.page[data-name="crearCateg"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	fnNavbarVisible();
	$$("#titulonavbar").text("Crea una Categoría");
	$$("#btncrearCateg").on("click", fnCrearCateg);
	$$("#imgNuevaCateg").on("click", fnSubirImagen);
	$$(".popIcono").on("click", fnCambiarIcono);
	
	fnBajarImagen();


})

$$(document).on('page:init', '.page[data-name="editarCateg"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	fnEditarCateg();
	fnIconobackVisible();
})

$$(document).on('page:beforein', '.page[data-name="categElegida"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	$$("#contenedorRecetas").html("");

})

$$(document).on('page:afterin', '.page[data-name="categElegida"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	fnIconobackOculto();
	fnMostrarRecetas();

})

$$(document).on('page:init', '.page[data-name="crearReceta"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	$$("#titulonavbar").text("Crea tu Receta");
	fnIconobackOculto();
	fnCreaciondeReceta();
	
})

$$(document).on('page:beforein', '.page[data-name="recetaElegida"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	$$("#IngredientesReceta").html("");
	$$("#elabReceta").text("");
	fnIconobackVisible();

})

$$(document).on('page:afterin', '.page[data-name="recetaElegida"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
	
	fnIconobackVisible();
	fnRecetaElegida();

})

$$(document).on('page:init', '.page[data-name="editarReceta"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	fnIconobackVisible();
	fnrellenarEditReceta();
	$$("#btnactualizarReceta").on("click", fnActualizarReceta);

})

$$(document).on('page:init', '.page[data-name="buscador"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

	fnBuscador();
})

function fnRegistrarUsuario(){
	
	nombre = $$("#nombRegistro").val();
	email = $$("#emailRegistro").val();
	password = $$("#passRegistro").val();
	
	
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
		
		
		if(cont >= maxCateg){
			app.dialog.alert("Limite de categorías alcanzado");
			return;
		}
		
		nombreCateg = $$("#nombreNuevaCateg").val();
		iconoCateg = $$("#IconoCrearCateg").attr("src");
		//imgCateg = $$("#imgNuevaCateg")       subir imagen
		
		nuevaCateg = {"nombre" : nombreCateg, "icono" : iconoCateg, "imagen" : "img1", "email" : emailUsuario};
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
	var idicono = [];
	var query = colCateg.where("email", "==", emailUsuario).orderBy("nombre");
	var agregar = "";
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			nombres.push(doc.data().nombre);
			idcateg.push(doc.id);
			idicono.push(doc.data().icono);
			
		});	

		var k = 0;
		largo = Math.ceil((nombres.length/2));
		for(j=0; j<largo; j++){
		agregar += "<div class='row paddingB10'>";
		
		for(i=0; i<2 ; i++){
			if(k < nombres.length){
				
				agregar += "<div class='col-50 heightbtnCateg'><a id='IDCATEG"+idcateg[k]+"' href='/categElegida/' class='button button-large button-raised categs heightbtnCateg colorbtnverde'><img src='"+idicono[k]+"' class='paddingB20'><p class='categtxt'>"+nombres[k]+"</p></a></div>";
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
	txtnombre = $$("#" + idCategSelec).text();
	idCategSelec = idCategSelec.replace("IDCATEG","");
}

function fnActualizarCategs(){
	
	var nuevnombre = $$("#nombreEditarCateg").val();
	var nuevicono = $$("#IconoEditarCateg").attr("src");
	
	colCateg.doc(idCategSelec).update
	({nombre: nuevnombre, icono: nuevicono})
	
	.then(function(){
		console.log("Actualizado");
		app.views.main.router.navigate("/principal/");
	})
	.catch(function (error){
		
		console.log("Error: " + error);
	})
	
}

function fnBorrarCateg(){
	
	app.dialog.confirm("Esta seguro que desea borrar la categoría? </br>Las recetas de esta categoría también serán borradas.", "Borrar Categoría", function(){
	
		var recetasid = [];
		
		var queryRecetas = colRecetas.where("email", "==", emailUsuario).where("categoria", "==", idCategSelec);
		queryRecetas.get()
		.then(function (querySnapshot){
			querySnapshot.forEach(function(doc){
				
				recetasid.push(doc.id);
				console.log("id recetas:" +doc.id);
				
			})
			
			for(i=0; i<(recetasid.length); i++){
				
				colRecetas.doc(recetasid[i]).delete()
				.then(function (){
					console.log("Receta borrada");
				})
				.catch(function (error){
					console.log("Error borrar receta:"+error);
				});
			}
			
			colCateg.doc(idCategSelec).delete()
			.then(function (){
				
				app.dialog.alert("Categoría borrada","Borrar Categoría");
				app.views.main.router.navigate("/principal/");
			})
			.catch(function (error){
			console.log("Error");
			});
	
		})
		.catch(function (error){
			console.log("Error"+error);
		});
	
	});
	
}

function fnAñadirIngrediente(){
	
	contIngred++;
	
	$$("#listaIngredientes").append(`
	
			<div class="row no-gap">
				
				<div class="list no-hairlines-md col-50 nomargin">
					<ul>
					<li class="item-content item-input item-input-outline fondoClaro">
					<div class="item-inner fondoClaro paddingR0">
						<div class="item-title item-label paddingB2">Ingrediente</div>
						<div class="item-input-wrap fondoInput">
						<input id="nombreIng`+contIngred+`" type="text" autocomplete="off"/>
						</div>
					</div>
					</li>
					</ul>
				</div>
				
				
				<div class="list no-hairlines-md col-25 nomargin">
					<ul>
					<li class="item-content item-input item-input-outline fondoClaro">
					<div class="item-inner fondoClaro">
						<div class="item-title item-label paddingB2">Cant.</div>
						<div class="item-input-wrap fondoInput">
						<input id="cantidad`+contIngred+`" type="text" autocomplete="off"/>
						</div>
					</div>
					</li>
					</ul>
				</div>
				
				<div class="list no-hairlines-md col-25 nomargin">
					<ul>
					<li class="item-content item-input item-input-outline fondoClaro nopaddingLInput">
					<div class="item-inner fondoClaro">
						<div class="item-title item-label paddingL10 paddingB2">Unid.</div>
						<div class="item-input-wrap input-dropdown-wrap fondoInput">
							<select id="unidad`+contIngred+`">
								<option value="unidad">Unidad/es</option>
								<option value="grs">grs</option>
								<option value="kgs">kgs</option>
								<option value="cc">cc</option>
								<option value="mlts">mlts</option>
								<option value="lts">lts</option>
								<option value="taza">Taza</option>
								<option value="cda">Cucharada/s</option>
								<option value="cdita">Cucharadita/s</option>
								<option value="vaso">Vaso/s</option>
								<option value="cn">c/n</option>
							</select>
						</div>
					</div>
					</li>
					</ul>
				</div>
				
			</div>
	
	
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

function fnCrearReceta(){
	
	var arrayNombres = [];
	
	recetasQuery = colRecetas.where("email", "==", emailUsuario);
	
	recetasQuery.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){ //REVISAR, NO HACE NADA
			
			arrayNombres.push(doc.data().nombre);
			
		});
		
		//fnSubirImagen();
		nombreReceta = $$("#nombreNuevaReceta").val();
		elab = $$("#elabReceta").val();
		categ = $$("#selectCateg").val();
		
		for(i=0; i<(arrayNombres.length); i++){
			
			if(nombreReceta == arrayNombres[i]){
				app.dialog.alert("El nombre de la receta ya fue utilizado");
				return;
			}
			
		}

		var datosReceta = {nombre: nombreReceta, imagen: "url", elaboracion: elab, email: emailUsuario, categoria: categ};
		colRecetas.add(datosReceta)
		.then((doc) => {
			
			idReceta = doc.id;
			
			for(i=1; i<=contIngred; i++){
			
				nombre = $$("#nombreIng"+i).val();
				cantidad = $$("#cantidad"+i).val();
				unidad = $$("#unidad"+i).val();
				
				datosIngrediente = { nombre: nombre , cantidad : cantidad, unidadmedida: unidad, receta : nombreReceta};
				
				colRecetas.doc(idReceta).collection("ingredientes").add(datosIngrediente)
				.then((doc) => {
					
				})
				.catch((error) => {
			
				console.error("Error: " +error);
				});
				
			}
			
			contIngred = 0;
			app.views.main.router.navigate("/principal/");
		})
		.catch((error) => {
			
			console.error("Error adding document: "  +error);
		});
		
	})
	.catch(function (error){
	console.log("Error: " +error);
	});
}

function fnCreaciondeReceta(){
	
	var query = colCateg.where("email", "==", emailUsuario).orderBy("nombre");
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			var nombre = doc.data().nombre;
			var id = doc.id;
			$$("#selectCateg").append("<option value='"+id+"'>"+nombre+"</option>");
			
		});
		
		$$("#btnAñadirIngrediente").on("click", fnAñadirIngrediente);
		$$("#btncrearReceta").on("click", fnCrearReceta);
		
	})
	.catch(function (error){
		console.log("Error: " +error);
	});
}

function fnMostrarRecetas(){

	var queryRecetas = colRecetas.where("categoria", "==", idCategSelec).where("email", "==", emailUsuario);
	queryRecetas.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			$$("#contenedorRecetas").append(`
			<div class='listaReceta colorbtnverde marginTB10'><a id="`+doc.data().nombre+`" href="/recetaElegida/" class="button contenedorImg linklistaReceta linkReceta"><div class="transLine"><p class='blanco noOpacity nomargin'>`+doc.data().nombre+`</p></div></a></div>
			`);
			//<img src="img/pizza.jpg" class="crop"> <p class="centerTextimg">`+doc.data().nombre+`</p>
		});
		
		$$(".linkReceta").on("click", fnTomarIdReceta);
		$$("#btnborrarCateg").on("click", fnBorrarCateg);
		$$("#titulonavbar").text(txtnombre);
		
	})
	.catch(function (error){
	console.log("Error: " +error);
	});

}

function fnRecetaElegida(){
	
	var nombreReceta = idRecetaSelec;
	var nombre = "";
	var elab = "";
	var docID = "";
	var query = colRecetas.where("nombre", "==", nombreReceta).where("email", "==", emailUsuario);
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			nombre = doc.data().nombre;
			elab = doc.data().elaboracion;
			docID = doc.id;
			idRecetaBorrar = doc.id;
		});
		
		$$("#titulonavbar").text(nombre);
		$$("#elabReceta").text(elab);
		
		colRecetas.doc(docID).collection("ingredientes").get()
		.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			$$("#IngredientesReceta").append(`
				<div class="row">
				<p class="col-65 marginTB10 fontRaleway">`+doc.data().nombre+`</p>
				<p class="col-15 aligntxtCenter marginTB10 fontRaleway">`+doc.data().cantidad+`</p>
				<p class="col-20 aligntxtLeft marginTB10 fontRaleway">`+doc.data().unidadmedida+`</p>
				</div>
			`);
		});
		
		$$("#btnborrarReceta").on("click", fnBorrarReceta);
		
		})
		.catch(function (error){
			console.log("Error: " +error);
		});
		
	})
	.catch(function (error){
		console.log("Error: " +error);
	});

	
}

function fnTomarIdReceta(){

	idRecetaSelec = this.id;

}

function fnrellenarEditReceta(){
	
	var nombreReceta = idRecetaSelec;
	var elab = "";
	var CategReceta = "";
	
	var query = colRecetas.where("nombre", "==", nombreReceta).where("email", "==", emailUsuario);
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			recetaId = doc.id;
			elab = doc.data().elaboracion;
			CategReceta = doc.data().categoria;
		});

			$$("#nombreEditarReceta").val(nombreReceta);
			$$("#editarElabReceta").val(elab);
			
			
			colRecetas.doc(recetaId).collection("ingredientes").get()
			.then(function (querySnapshot){
				querySnapshot.forEach(function(doc){
					
					IDingredientes.push(doc.id);
					contIngred++;

					$$("#ingredientesAeditar").append(`
					
					<div class="row no-gap">
						
						<div class="list no-hairlines-md col-50 nomargin">
							<ul>
							<li class="item-content item-input item-input-outline fondoClaro">
							<div class="item-inner fondoClaro paddingR0">
								<div class="item-title item-label paddingB2">Ingrediente</div>
								<div class="item-input-wrap fondoInput">
								<input id="nombreIngEdit`+contIngred+`" type="text" autocomplete="off"/>
								</div>
							</div>
							</li>
							</ul>
						</div>
						
						
						<div class="list no-hairlines-md col-25 nomargin">
							<ul>
							<li class="item-content item-input item-input-outline fondoClaro">
							<div class="item-inner fondoClaro">
								<div class="item-title item-label paddingB2">Cant.</div>
								<div class="item-input-wrap fondoInput">
								<input id="cantidadEdit`+contIngred+`" type="text" autocomplete="off"/>
								</div>
							</div>
							</li>
							</ul>
						</div>
						
						<div class="list no-hairlines-md col-25 nomargin">
							<ul>
							<li class="item-content item-input item-input-outline fondoClaro nopaddingLInput">
							<div class="item-inner fondoClaro">
								<div class="item-title item-label paddingL10 paddingB2">Unid.</div>
								<div class="item-input-wrap input-dropdown-wrap fondoInput">
									<select id="unidadEdit`+contIngred+`" autocomplete="off">
										<option value="unidad">Unidad/es</option>
										<option value="grs">grs</option>
										<option value="kgs">kgs</option>
										<option value="cc">cc</option>
										<option value="mlts">mlts</option>
										<option value="lts">lts</option>
										<option value="taza">Taza</option>
										<option value="cda">Cucharada/s</option>
										<option value="cdita">Cucharadita/s</option>
										<option value="vaso">Vaso/s</option>
										<option value="cn">c/n</option>
									</select>
								</div>
							</div>
							</li>
							</ul>
						</div>
						
					</div>
			
			
					`)
					
					$$("#nombreIngEdit"+contIngred).val(doc.data().nombre);
					$$("#cantidadEdit"+contIngred).val(doc.data().cantidad);
					$$("#unidadEdit"+contIngred).val(doc.data().unidadmedida);
					
				});
			
				var queryCateg = colCateg.where("email", "==", emailUsuario).orderBy("nombre");
				queryCateg.get()
				.then(function (querySnapshot){
					querySnapshot.forEach(function(doc){
				
						var nombre = doc.data().nombre;
						var id = doc.id;
						
						$$("#selectCategedit").append("<option value='"+id+"'>"+nombre+"</option>");
						
						if(id == CategReceta){
							console.log("Coincidencia: "+id+" | "+CategReceta);
							$$("#selectCategedit").val(id);
							
						}
					});
				})
				.catch(function (error){
					console.log("Error: " +error);
				});
			
			$$("#btnAñadirIngredienteEdit").on("click", fnAñadirIngredienteEdit);
			
			})
	})
	.catch(function (error){
		console.log("Error: " +error);
	});
	
	
}

function fnAñadirIngredienteEdit(){
	
	contIngred++;
	nuevoIngredienteUpdate++;
	$$("#ingredientesAeditar").append(`
	
			<div class="row no-gap">
				
				<div class="list no-hairlines-md col nomargin">
					<ul>
					<li class="item-content item-input item-input-outline fondoClaro">
					<div class="item-inner fondoClaro paddingR0">
						<div class="item-title item-label paddingB2">Ingrediente</div>
						<div class="item-input-wrap fondoInput">
						<input id="nombreIngEdit`+contIngred+`" type="text"/>
						</div>
					</div>
					</li>
					</ul>
				</div>
				
				
				<div class="list no-hairlines-md col nomargin">
					<ul>
					<li class="item-content item-input item-input-outline fondoClaro">
					<div class="item-inner fondoClaro">
						<div class="item-title item-label paddingB2">Cant.</div>
						<div class="item-input-wrap fondoInput">
						<input id="cantidadEdit`+contIngred+`" type="text"/>
						</div>
					</div>
					</li>
					</ul>
				</div>
				
				<div class="list no-hairlines-md col nomargin">
					<ul>
					<li class="item-content item-input item-input-outline fondoClaro nopaddingLInput">
					<div class="item-inner fondoClaro">
						<div class="item-title item-label paddingL10 paddingB2">Unid.</div>
						<div class="item-input-wrap input-dropdown-wrap fondoInput">
							<select id="unidadEdit`+contIngred+`">
								<option value="unidad">Unidad/es</option>
								<option value="grs">grs</option>
								<option value="kgs">kgs</option>
								<option value="cc">cc</option>
								<option value="mlts">mlts</option>
								<option value="lts">lts</option>
								<option value="taza">Taza</option>
								<option value="cda">Cucharada/s</option>
								<option value="cdita">Cucharadita/s</option>
								<option value="vaso">Vaso/s</option>
								<option value="cn">c/n</option>
							</select>
						</div>
					</div>
					</li>
					</ul>
				</div>
				
			</div>
	`)
}

function fnActualizarReceta(){
	
	var i = 0;
	var nuevnombre = $$("#nombreEditarReceta").val();
	var nuevelab = $$("#editarElabReceta").val();
	var j = 0;
	colRecetas.doc(recetaId).update
	({nombre: nuevnombre, elaboracion: nuevelab})
	.then(function(){
		console.log("Update Nombre y elab OK");
		console.log("contIngred: "+contIngred);
		contIngred -= nuevoIngredienteUpdate;
		for(i=1; i<=contIngred; i++, j++){
			
			nomb = $$("#nombreIngEdit"+i).val();
			cant = $$("#cantidadEdit"+i).val();
			unid = $$("#unidadEdit"+i).val();
			
			console.log("Nombre: "+nomb+" | Cantidad: "+cant+" | Unidad: "+unid);
			console.log("Id Ingrediente: "+IDingredientes[j]);
			
			colRecetas.doc(idRecetaSelec).collection("ingredientes").doc(IDingredientes[j]).update
			({nombre: nomb, cantidad: cant, unidadmedida: unid, receta: nuevnombre})
			.then(function(){
				console.log("Actualizado");
				
			})
			.catch(function (error){
	
				console.log("Error: " + error);
			})
		}
		
		if(nuevoIngredienteUpdate > 0){
			for(i; i<nuevoIngredienteUpdate; i++){
				
				nomb = $$("#nombreIngEdit"+i).val();
				cant = $$("#cantidadEdit"+i).val();
				unid = $$("#unidadEdit"+i).val();
				
				console.log("Nuevo ingrediente:");
				console.log("Nombre: "+nomb+" | Cantidad: "+cant+" | Unidad: "+unid);
				
				datosIngrediente = { nombre: nomb , cantidad : cant, unidadmedida: uni, receta : nuevnombre};
				
				colRecetas.doc(idRecetaSelec).collection("ingredientes").add(datosIngrediente)
				.then((doc) => {
					console.log("Ingrediente agregado en update");
				})
				.catch((error) => {
			
					console.error("Error: " +error);
				});
				
			}
		
		}
		contIngred = 0;
	})
	.catch(function (error){
				
		console.log("Error: " + error);
	})
	
	
}

function fnCambiarIcono(){
	
	var id = this.id
	$$("#IconoCrearCateg").attr("src", id);
	
	
}

function fnEditarIcono(){
	
	var id = this.id
	id = id.replace("edit","");
	$$("#IconoEditarCateg").attr("src", id);
}

function fnNavbarOculto(){
	
	if(($$("#upperNavbar").hasClass("visible"))==true){
		$$("#upperNavbar").removeClass("visible");
		$$("#upperNavbar").addClass("oculto");
	}
	
}

function fnNavbarVisible(){
	
	if(($$("#upperNavbar").hasClass("oculto"))==true){
		$$("#upperNavbar").removeClass("oculto");
		$$("#upperNavbar").addClass("visible");
	}
	
}

function fnEditarCateg(){
	var ids = [];
	var idicono =  "";
	var query = colCateg.where("email", "==", emailUsuario).where("nombre", "==", txtnombre);
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			ids.push(doc.id);
			idicono = doc.data().icono;
		});
		
		for(i=0; i<(ids.length); i++){
			
			if(ids[i] == idCategSelec){
				$$("#nombreEditarCateg").val(txtnombre);
			}
		}
		
		$$("#IconoEditarCateg").attr("src", idicono);
		
		$$("#btnactualizarCateg").on("click", fnActualizarCategs);
		$$(".popIconoEdit").on("click", fnEditarIcono);
	})
	.catch(function (error){
		console.log("Error");
	});
}

function fnIconobackVisible(){
	
	if(($$("#IconoBack").hasClass("oculto"))==true){
		
		$$("#IconoBack").removeClass("oculto");
		$$("#IconoBack").addClass("visible");
		
	}
	
}

function fnIconobackOculto(){
	
	if(($$("#IconoBack").hasClass("visible"))==true){
		
		$$("#IconoBack").removeClass("visible");
		$$("#IconoBack").addClass("oculto");
		
	}
}

function fnToolbarkOculto(){
	
	if(($$("#toolbarInferior").hasClass("visible"))==true){
		
		$$("#toolbarInferior").removeClass("visible");
		$$("#toolbarInferior").addClass("oculto");
		
	}
}

function fnToolbarkVisible(){
	
	if(($$("#toolbarInferior").hasClass("oculto"))==true){
		
		$$("#toolbarInferior").removeClass("oculto");
		$$("#toolbarInferior").addClass("visible");
		
	}
}

function fnBorrarReceta(){
	
	app.dialog.confirm("Esta seguro que desea borrar la receta?", "Borrar Receta", function(){
		
		
		colRecetas.doc(idRecetaBorrar).delete() //BORRAR INGREDIENTES
		.then(function (){
			
			app.dialog.alert("Receta borrada","Borrar Receta");
			app.views.main.router.navigate("/principal/");

		})
		.catch(function (error){
			console.log("Error:" + error);
		});
	});	
	
}

function fnBuscador(){
	
	var query = colCateg.where("email", "==", emailUsuario).orderBy("nombre");
	
	query.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			var nombre = doc.data().nombre;
			var id = doc.id;
			$$("#selectCategbuscar").append("<option value='"+id+"'>"+nombre+"</option>");
			
		});
		
		$$("#btnAñadirIngredienteBuscar").on("click", fnAñadirIngredienteBuscar);
		$$("#btnbuscar").on("click", fnBuscar);
		
	})
	.catch(function (error){
		console.log("Error: " +error);
	});
}

function fnAñadirIngredienteBuscar(){
	
	contIngred++;
	
	$$("#contenedorBuscarIngredientes").append(`
	
			<div class="row no-gap">
				
				<div class="list no-hairlines-md col nomargin">
					<ul>
					<li class="item-content item-input item-input-outline fondoClaro">
					<div class="item-inner fondoClaro paddingR0">
						<div class="item-title item-label paddingB2">Nombre</div>
						<div class="item-input-wrap fondoInput">
						<input id="nombreIngB`+contIngred+`" type="text" autocomplete="off"/>
						</div>
					</div>
					</li>
					</ul>
				</div>
				
			</div>
	`)
}

function fnBuscar(){
	
	var nombreRecetaBuscar = $$("#nombreBuscar").val();
	var categRecetaBuscar = $$("#selectCategbuscar").val();
	var ingredienteBuscar = [];
		ingredienteBuscar[0] = "";
	var resultadoIngredientes = [];
	var temp = "";
	var queryIngredientes = "";
	var queryBuscar = "";
	
	for(i=1; i<=contIngred; i++){
		temp = $$("#nombreIngB"+i).val();
		ingredienteBuscar.push(temp);
	}
	
	if((nombreRecetaBuscar == "")&&(categRecetaBuscar == "")&&(ingredienteBuscar[0] == "")){
		app.dialog.alert("Debe ingresar al menos un campo para buscar.");
		return;
	}
	
	for(i=0; i<(ingredienteBuscar.length); i++){
		colRecetas.doc().collection("ingredientes").where("nombre", "==", ingredienteBuscar[i]).get()
		.then(function (querySnapshot){
			querySnapshot.forEach(function (doc){
				
				resultadoIngredientes.push(doc.id);
				
			});
		})
		.catch(function (error){
			console.log("Error: "+error);
		});
	}	
	
	if((nombreRecetaBuscar != "")&&(categRecetaBuscar != "")){
		
		queryBuscar = colRecetas.where("categoria", "==", categRecetaBuscar).where("nombre", "==", nombreRecetaBuscar);
		
	}else if(nombreRecetaBuscar == ""){
		
		queryBuscar = colRecetas.where("categoria", "==", categRecetaBuscar);
		
	}else if(categRecetaBuscar == ""){
		
		queryBuscar = colRecetas.where("nombre", "==", nombreRecetaBuscar);
	}
	
	queryBuscar.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function (doc){
			
			var
		});
		
		
		
	});
	.catch(function(error){
		
	});
	
}

function fnTest(){
	
	
	var queryBuscar = colRecetas.where("categoria", "==", "Mdz0lzMizla7Sw3XsbXF");
	queryBuscar = colRecetas.where("nombre", "==", "Choripan");
	
	queryBuscar.get()
	.then(function (querySnapshot){
		querySnapshot.forEach(function(doc){
			
			console.log("Nombre: "+doc.data().nombre);
			console.log("id: "+doc.id);
			console.log("Categoría: "+doc.data().categoria);
			
		});
		
		
	});
	.catch(function (error){
		console.log("Error: " +error);
	});
}


