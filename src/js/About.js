import * as THREE from "three";

import { OBJLoader } from "../../public/js/obj.js";

const aboutcontainer = document.getElementsByClassName(
  "about_canvas_container"
);
console.log(aboutcontainer);

let camera, scene, renderer;
let ambientLight, pointLight;

let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let sillaCoffeeTable, sillaCoffeeTable2;

//ADD CAMERA
camera = new THREE.PerspectiveCamera( 1000, window.innerWidth / window.innerHeight, 2, 100 );
camera.position.set( -5, 50, 5 );

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

// load model
const objLoader = new OBJLoader()
function loadModel(){
  objLoader.load(
    'model/obj/3d-model.obj',
    (object) => {
          // (object.children[0] as THREE.Mesh).material = material
          // object.traverse(function (child) {
          //     if ((child as THREE.Mesh).isMesh) {
          //         (child as THREE.Mesh).material = material
          //     }
          // })
      sillaCoffeeTable = object;
      scene.add(sillaCoffeeTable);
      object.position.x = 0;
      object.position.y = 1.5;
      object.scale.set( 0.03, 0.03, 0.03 );
      object.rotateY( Math.PI / 1);
      object.rotateZ( Math.PI / 1);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(error)
    },
  );
}

var render = function() {
  requestAnimationFrame(render);
  camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;

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

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;

}

// run functions
checkCanvas();
loadModel();
render();

window.addEventListener( 'resize', onWindowResize );
//document.addEventListener( 'mousemove', onDocumentMouseMove );