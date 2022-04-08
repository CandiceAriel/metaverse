import * as THREE from "three";
import { OrbitControls } from "../../public/js/OrbitControls.js";

import { OBJLoader } from "../../public/js/obj.js";
import { MTLLoader } from "../../public/js/mtl.js";

const aboutcontainer = document.getElementsByClassName(
  "about_canvas_container"
);
console.log(aboutcontainer);

let camera, scene, renderer;
let ambientLight, pointLight;

let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let sillaCoffeeTable,sillaCoffeeTable2, bathroomMtl;


function init(){
  //ADD CAMERA
  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
  //camera.position.set( -2.3,0,8 );
  console.log(camera.position.x);

  //SCENE
  //create new scene 
  scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  //add ambient light
  ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
  scene.add( ambientLight );

  //add point light
  pointLight = new THREE.PointLight( 0xffffff, 0.8 );
  camera.add( pointLight );
  scene.add( camera );

  //RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setAnimationLoop(animation);

  //CHECK IF CANVAS CONTAINER RENDERED
  //ADD RENDERE TO CANVAS
  function checkCanvas() {
    if (aboutcontainer.length > 0) {
      aboutcontainer[0].appendChild(renderer.domElement);
    } else {
      setTimeout(checkCanvas, 1000);
    }
  }

  //ADD OBJECT 1
  const mtlLoader = new MTLLoader();
  function loadMaterial(){
    mtlLoader	.load( 'model/mtl/SillaCoffeeTable.mtl', function ( materials ) {

      materials.preload();
      bathroomMtl = materials;
      loadModel2(bathroomMtl);
    
    })
  }

  // load model
  const objLoader = new OBJLoader()
  function loadModel(bathroomMtl){
    objLoader.setMaterials(bathroomMtl);
    objLoader.load(
      'model/obj/SillaCoffeeTable.obj',
      (object) => {
            // (object.children[0] as THREE.Mesh).material = material
            // object.traverse(function (child) {
            //     if ((child as THREE.Mesh).isMesh) {
            //         (child as THREE.Mesh).material = material
            //     }
            // })
        sillaCoffeeTable = object;
        scene.add(sillaCoffeeTable);
        object.position.x = -5;
        object.position.y = 0;
        object.position.z = -10;
        object.scale.set( 0.04, 0.04, 0.04 );
        object.rotateY( Math.PI / 1);
        // object.rotateZ( Math.PI / 1);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      },
    );
  }

  //ADD OBJECT 2
  const mtlLoader2 = new MTLLoader();
  function loadMaterial2(){
    mtlLoader2	.load( 'model/mtl/SillaCoffeeTable.mtl', function ( materials ) {

      materials.preload();
      bathroomMtl = materials;
      loadModel(bathroomMtl);
    
    })
  }

  // load model
  const objLoader2 = new OBJLoader()
  function loadModel2(bathroomMtl){
    objLoader2.setMaterials(bathroomMtl);
    objLoader2.load(
      'model/obj/SillaCoffeeTable.obj',
      (object2) => {
            // (object.children[0] as THREE.Mesh).material = material
            // object.traverse(function (child) {
            //     if ((child as THREE.Mesh).isMesh) {
            //         (child as THREE.Mesh).material = material
            //     }
            // })
        sillaCoffeeTable2 = object2;
        scene.add(sillaCoffeeTable2);
        sillaCoffeeTable2.position.x = 5;
        sillaCoffeeTable2.position.y = 0;
        sillaCoffeeTable2.position.z = -10;
        sillaCoffeeTable2.scale.set( 0.04, 0.04, 0.04 );
        sillaCoffeeTable2.rotateY( Math.PI / 1);
        sillaCoffeeTable2.rotateY( Math.PI / 1.1);
        // object.rotateZ( Math.PI / 1);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      },
    );
  }

  const controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render ); // use if there is no animation loop
				controls.minDistance = 2;
				controls.maxDistance = 10;
				controls.target.set( 0, 0, - 0.2 );
				controls.update();

  //RUN FUNCTIONS
  checkCanvas();
  loadMaterial();
  loadMaterial2();
}

var render = function() {
  requestAnimationFrame(render);
  // camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );
  renderer.render(scene, camera);
}

//--------
//EVENT HANDLERS
function onWindowResize() {

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  renderer.setSize( canvasWidth, canvasHeight );

  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();

  render();

}

function onPointerDown( event ) {

  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;
  console.log(sillaCoffeeTable2.position);

}

// run functions
init();
render();

window.addEventListener( 'resize', onWindowResize );
document.addEventListener( 'pointerdown', onPointerDown );
//document.addEventListener( 'mousemove', onDocumentMouseMove );