import * as THREE from "three";

import { OBJLoader } from "../../public/js/obj.js";
import { MTLLoader } from "../../public/js/mtl.js";
import { ConeBufferGeometry } from "three";


const homecontainer = document.getElementsByClassName(
  "home_canvas_container"
);
console.log(homecontainer);

let camera, scene, renderer;
let ambientLight, pointLight;

let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let xSpeed = 0.5;
let zSpeed = 0.5;
let ySpeed = 0.0001;

let bathroomModel, bathroomMtl;
let cube;

function init(){
  //ADD CAMERA
  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 500 );
  camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( mouseY - camera.position.x ) * .05;

  //SCENE
  //create new scene 
  scene = new THREE.Scene();
  scene.background = new THREE.Color("lightgray");

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
    if (homecontainer.length > 0) {
      homecontainer[0].appendChild(renderer.domElement);
    } else {
      setTimeout(checkCanvas, 1000);
    }
  }

  const onProgress = function ( xhr ) {

    if ( xhr.lengthComputable ) {

      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

    }

  };

  const mtlLoader = new MTLLoader();
  function loadMaterial(){
    mtlLoader	.load( 'model/mtl/3d-model.mtl', function ( materials ) {

      materials.preload();
      bathroomMtl = materials;
      loadModel(bathroomMtl);
    
    })
  }

  // load model
  // X cord : left and right
  const objLoader = new OBJLoader()
  function loadModel(bathroomMtl){
    objLoader.setMaterials(bathroomMtl);
    objLoader.load(
      'model/obj/3d-model.obj',
      (object) => {
            // (object.children[0] as THREE.Mesh).material = material
            // object.traverse(function (child) {
            //     if ((child as THREE.Mesh).isMesh) {
            //         (child as THREE.Mesh).material = material
            //     }
            // })
        bathroomModel = object;
        scene.add(bathroomModel);
        object.position.x = -0.015;
        object.position.y = -2;
        object.position.z = -5;
        object.scale.set( 0.04, 0.04, 0.04 );
        object.rotateY( Math.PI / 1);
      },
      onProgress,
      (error) => {
        console.log(error)
      },
    );
  }

  function addCube(){
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    // camera.add(cube);
    // cube.position.set (0, -1, -1.5);

    cube.position.x = -0.015;
    cube.position.y = -1;
    cube.position.z = -2;
  }

  document.addEventListener("keydown", onDocumentKeyDown);

  checkCanvas();
  loadMaterial();
  addCube();
  render();
}

//
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

}

function onDocumentKeyDown( event ) {

  var keyCode = event.which;
    if (keyCode == 87) {
        cube.position.z -= zSpeed;
    } else if (keyCode == 83) {
        cube.position.z += zSpeed ;
    } else if (keyCode == 65) {
        cube.position.x -= xSpeed;
    } else if (keyCode == 68) {
        cube.position.x += xSpeed;
    } else if (keyCode == 32) {
        cube.position.set(0, 0, 0);
    }mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;
  console.log(cube.position);
}

// run functions
init();
render();

window.addEventListener( "resize", onWindowResize );