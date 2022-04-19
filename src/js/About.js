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
let xSpeed = 0.5;
let zSpeed = 0.5;

let sillaCoffeeTable, sillaMaterial,bathroomModel, bathroomMtl;
let cube, floor;


function init(){
  //ADD CAMERA
  camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .5;
  //camera.position.y = 5;
  camera.position.z = 5;
  // camera.position.x = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

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

  const onProgress = function ( xhr ) {

    if ( xhr.lengthComputable ) {

      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

    }

  };

  function createFloor() {
    let pos = { x: 0, y: -5, z: 5 };
    let scale = { x: 100, y: 2, z: 100 };
  
    const geometry = new THREE.PlaneGeometry( 8,8 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    floor = new THREE.Mesh(geometry, material)
    //floor.receiveShadow = true
    floor.rotation.x = - Math.PI / 2;
    floor.position.y = -1;
    
    scene.add(floor)
    console.log(floor.position);
  }


  //ADD OBJECT 1
  const mtlLoader = new MTLLoader();
  function loadMaterial(){
    mtlLoader	.load( 'model/mtl/SillaCoffeeTable.mtl', function ( materials ) {

      materials.preload();
      sillaMaterial = materials;
      loadModel(sillaMaterial);
    
    })
  }

  // load model
  const objLoader = new OBJLoader()
  function loadModel(sillaMaterial){
    objLoader.setMaterials(sillaMaterial);
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
        //object.position.x = -5;
        object.position.y = -1;
        //object.position.z = -10;
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
    mtlLoader2	.load( 'model/mtl/3d-model.mtl', function ( materials ) {

      materials.preload();
      bathroomMtl = materials;
      loadModel2(bathroomMtl);
    
    })
  }

  // load model
  // X cord : left and right
  const objLoader2 = new OBJLoader()
  function loadModel2(bathroomMtl){
    objLoader2.setMaterials(bathroomMtl);
    objLoader2.load(
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
        bathroomModel.position.x = -1;
        bathroomModel.position.y = floor.position.y - 0.01;
        bathroomModel.position.z = -3;
        bathroomModel.scale.set( 0.04, 0.04, 0.04 );
        bathroomModel.rotateY( Math.PI / 1);
        
      },
      onProgress,
      (error) => {
        console.log(error)
      },
    );
  }
  

  function addCube(){
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    // camera.add(cube);
    // cube.position.set (0, -1, -1.5);

    cube.position.x = -2;
    cube.position.y = floor.position.y + 0.1;
    cube.position.z = 2;
  }

  function addObjects(){
    //loadMaterial();
    loadMaterial2();
    addCube();
  }

  //RUN FUNCTIONS
  checkCanvas();
  createFloor();
  addObjects();

  document.addEventListener("keydown", onDocumentKeyDown);
}

var render = function() {
  requestAnimationFrame(render);
  // camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y += ( - mouseY - camera.position.y ) * .05;

	//camera.lookAt( scene.position );
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

//Character/user move
function onDocumentKeyDown( event ) {
  let speed = 0.5;
  //let actualSpeed = speed * delta;
  var keyCode = event.which;
    // 87 = 'W'; 83 = 'S'; 65 = 'A'; 68 = 'D'
    if (keyCode == 87) {
        cube.position.z -= zSpeed;
        //lockctrl.moveForward(speed);
    } else if (keyCode == 83) {
        cube.position.z += zSpeed ;
        //lockctrl.moveForward(-speed);
    } else if (keyCode == 65) {
        cube.position.x -= xSpeed;
        //lockctrl.moveRight(-speed);
    } else if (keyCode == 68) {
        cube.position.x += xSpeed;
        //lockctrl.moveRight(speed);
    } else if (keyCode == 32) {
        cube.position.set(0, 0, 0);
    }mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;
  console.log(cube.position);
}

// run functions
init();
render();

window.addEventListener( 'resize', onWindowResize );
//document.addEventListener( 'mousemove', onDocumentMouseMove );