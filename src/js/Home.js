import * as THREE from "three";

import { OBJLoader } from "../../public/js/obj.js";
import { MTLLoader } from "../../public/js/mtl.js";
import { FBXLoader } from "../../public/js/FBXLoader.js";
import { PointerLockControls } from "../../public/js/PointerLockControls.js";
import { OrbitControls } from "../../public/js/OrbitControls.js";
import { Clock } from "../../public/js/Clock.js";

const canvas = document.getElementsByClassName("canvas");
const btnLock = document.getElementsByClassName("btn_lock");
const dekstopHelp = document.getElementsByClassName("desktop-help");

$( document ).ready(function() {
  $(".icon-close").click(function(ev){
    $(".desktop-help").hide();
    console.log('icon clicked');
  })
});


let camera, scene, renderer,mesh, goal, keys, follow;
let ambientLight, pointLight;
let clock, control, orbitctrl;

let blockPlane;
let pointer, raycaster, selectedObj;

//custom obj and materials
let emptyRoom, bathroomMtl, coffeeTable;
let showroom1;
let livingRoomModel, livingRoomMtl;

//material
let wallmaterials;

let mouseX = 0,
  mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

var time = 0;
let prevTime = performance.now();
var newPosition = new THREE.Vector3();
var matrix = new THREE.Matrix4();

var stop = 1;
var DEGTORAD = 0.01745327;
var temp = new THREE.Vector3;
var dir = new THREE.Vector3;
var a = new THREE.Vector3;
var b = new THREE.Vector3;
var coronaSafetyDistance = 0.3;
var velocity = 0.0;
// var speed = 0.0;

//initialize
function init() {
  //ADD CAMERA
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1.0;
  const far = 1000.0;

  camera = new THREE.PerspectiveCamera(
    fov,
    aspect,
    near,
    far
  );
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y = 0;
  camera.position.z = -10;
  //camera.lookAt (new THREE.Vector3(-4,0,0));

  clock = new Clock();
  control = new PointerLockControls(camera, render.domElement);

  //SCENE
  //create new scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("lightgray");

  //add ambient light
  ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  //add point light
  pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);
  console.log(camera.position)

  //RAYCASTER
  raycaster = new THREE.Raycaster();
  pointer= new THREE.Vector2();

  //RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  //CHECK IF ELEMENTS CONTAINER RENDERED
  //ADD RENDERE TO CANVAS
  function checkCanvas() {
    if (canvas.length > 0) {
      canvas[0].appendChild(renderer.domElement);
      //addOrbitControl();
    } else {
      setTimeout(checkCanvas, 1000);
    }
  }

  function checkButton() {
    if (btnLock.length > 0) {
      btnLock[0].addEventListener('click', () => {
        control.lock();
      })
    } else {
      setTimeout(checkButton, 1000);
    }
  }

  const onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");

      // if (dekstopHelp.length > 0){
      //   console.log("Ada")
      //   if(dekstopHelp[0].style.display === 'none' ){
      //     dekstopHelp[0].style.display = "block"
      //   } else {
      //     dekstopHelp[0].style.display = "none"
      //   }
        
      // } else {
      //   console.log("None")
      //   //dekstopHelp.style.display = "none"
      // }
    }
  };

  //load textures and materials

  // const mtlLoader2 = new MTLLoader();
  // function loadMaterial2() {
  //   mtlLoader2.load("model/mtl/3d-model.mtl", function (material) {
  //     material.preload();
  //     bathroomMtl2 = material;
  //     loadModel2(bathroomMtl2);
  //   });
  // }

  const mtlLoader = new MTLLoader();
  
  function loadMaterial() {
    mtlLoader.load("model/mtl/3d-model.mtl", function (materials) {
      materials.preload();
      bathroomMtl = materials;
      loadModel(bathroomMtl);
    });
  }


  //load materials.
  //output : object collections of materials. Categorized by Mesh for example : Walls, tiles, furniture surface, decoration, etc.
  const textureLoader = new THREE.TextureLoader();
    livingRoomMtl = {
      
      hexagonaltiles : new THREE.MeshBasicMaterial({
        map: textureLoader.load("model/mtl/Textures/tiles_unwrap.png")
      }),
      mapletiles : new THREE.MeshBasicMaterial({
        map: textureLoader.load("model/mtl/Textures/Maple.png")
      }), 
      maplehoney : new THREE.MeshBasicMaterial({
        map: textureLoader.load("model/mtl/Textures/Maple_honey.png")
      }), 
    }

    wallmaterials = {
      walltexture : new THREE.MeshBasicMaterial({
        map: textureLoader.load("model/mtl/Textures/Walls_Materials.png")
      }),
    }

  // load model
  // X cord : left and right
  const fbxLoader = new FBXLoader();
  const objLoader = new OBJLoader();

  function loadModel() {
    //objLoader.setMaterials(bathroomMtl);
    var group = new THREE.Group();
    var objPositionY = blockPlane.position.y + 0.5;

    //living room
    objLoader.load(
      "model/obj/Preview Living Room_OBJ.obj",
      (object) => {
        livingRoomModel = object;
        scene.add(livingRoomModel);
        livingRoomModel.position.x = camera.position.x;
        livingRoomModel.position.y = blockPlane.position.y + 1.5;
        livingRoomModel.position.z = camera.position.z - 25;
        livingRoomModel.scale.set(0.02, 0.02, 0.02);
        
        //object.rotateY(Math.PI / 8);
        console.log(livingRoomModel);

        //set textures per mesh/object
        livingRoomModel.getObjectByName("Walls").material = wallmaterials.walltexture;
        livingRoomModel.getObjectByName("Tiles").material = livingRoomMtl.hexagonaltiles;

        //low tables
        livingRoomModel.getObjectByName("Cylinder001").material = livingRoomMtl.maplehoney;
        livingRoomModel.getObjectByName("Cylinder043").material = livingRoomMtl.maplehoney;
        
        //bookshelf
        livingRoomModel.getObjectByName("Box045").material = livingRoomMtl.maplehoney;
        livingRoomModel.getObjectByName("Box039").material = livingRoomMtl.maplehoney;
        livingRoomModel.getObjectByName("Box040").material = livingRoomMtl.maplehoney;
        livingRoomModel.getObjectByName("Box041").material = livingRoomMtl.maplehoney;
        livingRoomModel.getObjectByName("Box042").material = livingRoomMtl.maplehoney;
        livingRoomModel.getObjectByName("Box043").material = livingRoomMtl.maplehoney;
        livingRoomModel.getObjectByName("Box044").material = livingRoomMtl.maplehoney;
      },
      onProgress,
      (error) => {
        console.log(error);
      }
    );
    //

    //billboard
    objLoader.load(
      "model/obj/emptyroom.obj",
      (object) => {
        emptyRoom = object;
        emptyRoom.position.x = camera.position.x - 15;
        emptyRoom.position.y = objPositionY ;
        emptyRoom.position.z = camera.position.z - 3;
        
        // Scale(X, Y, Z)
        emptyRoom.scale.set(1, 1, 1);

        emptyRoom.rotateY(Math.PI / 2);
        
        scene.add(emptyRoom);
        
      },
      onProgress,
      (error) => {
        console.log(error);
      }
    );

    //glassroom
    objLoader.load(
      "model/obj/emptyroom.obj",
      (object) => {
        showroom1 = object;
        object.position.x = camera.position.x - 15;
        object.position.y = objPositionY ;
        object.position.z = emptyRoom.position.z - 15;
        
        // Scale(X, Y, Z)
        object.scale.set(1, 1, 1);

        object.rotateY(Math.PI / 2);

        const newMaterial = object.getObjectByName("wall_4_Cube.005").material.clone();
        newMaterial.transparent = true;
        newMaterial.opacity = 0.5;
        object.getObjectByName("wall_4_Cube.005").material = newMaterial;

        group.add(showroom1);
        scene.add(group);
        
      },
      onProgress,
      (error) => {
        console.log(error);
      }
    );

    //coffee table
    objLoader.load(
      "model/obj/SillaCoffeeTable.obj",
      (object) => {
        coffeeTable = object;

        coffeeTable.position.x = showroom1.position.x + 1;
        coffeeTable.position.y = blockPlane.position.y + 1.5 ;
        coffeeTable.position.z = showroom1.position.z;
        // Scale(X, Y, Z)
        object.scale.set(0.025, 0.025, 0.025);

        group.add(coffeeTable);
        
      },
      onProgress,
      (error) => {
        console.log(error);
      }
    );

  }

  function createFloor() {
    let pos = { x: 0, y: -5, z: 3 };
    let scale = { x: 2000, y: 2, z: 2000 };

    blockPlane = new THREE.Mesh(
      new THREE.BoxBufferGeometry(),
      new THREE.MeshPhongMaterial({ material: livingRoomMtl.maplehoney })
    );

    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);
  }

  function addObj() {
    createFloor();
    loadModel();
    //loadModel2();
    //loadModelLiving();
  }

  checkCanvas();
  checkButton();
  addObj();

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}
//
var render = function () {
  //render scene and camera
  renderer.render(scene, camera);
};

function hoverMesh(){
   // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

  if ( intersects.length > 0 ) {
    
    // const newMaterial = intersects[0].object.material.clone();
    // newMaterial.transparent = true;
    // newMaterial.opacity = 0.5;
		// intersects[ 0 ].object.material = newMaterial;
    
  }
}

var animate = function () {
  requestAnimationFrame(animate);
  const time = performance.now();
  const delta = ( time - prevTime ) / 5000;
  
  let speed = 0.0;

 
  if ( keys.w )
    speed = -0.2;
  else if ( keys.s )
    speed = 0.2;

  velocity += (speed - velocity) * .2;
  //cube.translateZ(velocity)
  control.moveForward( - velocity )
  control.minPolarAngle = Math.PI/2;
  control.maxPolarAngle = Math.PI/2;

  if ( keys.a ){
    camera.rotateY (0.1)

  }else if ( keys.d ){
    camera.rotateY(-0.1);
  }

  //camera.lookAt(cube.position)

  // a.lerp(camera.position, 0.4);
  // b.copy(goal.position);

  // dir.copy( a ).sub( b ).normalize();
  // const dis = a.distanceTo( b ) - coronaSafetyDistance;
  // goal.position.addScaledVector( dir, dis );
  // goal.position.lerp(temp, 0.06);
  // temp.setFromMatrixPosition(follow.matrixWorld);
  
  //resetMaterials();
  hoverMesh();
  render();
}

//--------
//EVENT HANDLERS
function onWindowResize() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  renderer.setSize(canvasWidth, canvasHeight);

  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
}

keys = {
  a: false,
  s: false,
  d: false,
  w: false,
  q: false,
  e: false
};

function onKeyDown(e) {
  let speed = 0.2;
  
  const key = e.code.replace('Key', '').toLowerCase();
    if ( keys[ key ] !== undefined )
      keys[ key ] = true;

  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
}

function onKeyUp(e) {
  const key = e.code.replace('Key', '').toLowerCase();
    if ( keys[ key ] !== undefined )
      keys[ key ] = false;
}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onClickEvent( event ){
  raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

  if ( intersects.length > 0 ) {
    selectedObj = intersects[ 0 ].object
   
  }
  console.log(selectedObj);
}


// run functions
init();
animate();

window.addEventListener("resize", onWindowResize);
window.addEventListener( "pointermove", onPointerMove );
window.addEventListener("click", onClickEvent);
