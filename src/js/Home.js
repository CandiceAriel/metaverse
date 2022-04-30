import * as THREE from "three";

import { OBJLoader } from "../../public/js/obj.js";
import { MTLLoader } from "../../public/js/mtl.js";
import { PointerLockControls } from "../../public/js/PointerLockControls.js";
import { OrbitControls } from "../../public/js/OrbitControls.js";
import { Clock } from "../../public/js/Clock.js";

const homecontainer = document.getElementsByClassName("home_canvas_container");
const btnLock = document.getElementsByClassName("btn_lock");

$( document ).ready(function() {
  $(".icon__close").click(function(ev){
    $(".desktop-help").hide();
    console.log('icon clicked');
  })
});


let camera, scene, renderer,mesh, goal, keys, follow;
let ambientLight, pointLight;
let clock, control, orbitctrl;

let bathroomModel, bathroomMtl, bathroomMtl2;
let livingRoomModel, livingRoomMtl;
let cube, blockPlane;
let mouseIsDown = false;

let mouseX = 0,
  mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let xSpeed = 0.5;
let zSpeed = 0.5;
let rSpeed = 1.5;

let moveForward = false;
let moveBackward = false;
let rotateRight = false;
let rotateLeft = false;

var time = 0;
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
  //camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 500 );
  camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += -1;
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

  //RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setAnimationLoop(animation);

  //CHECK IF ELEMENTS CONTAINER RENDERED
  //ADD RENDERE TO CANVAS
  function checkCanvas() {
    if (homecontainer.length > 0) {
      homecontainer[0].appendChild(renderer.domElement);
      //orbitctrl = new OrbitControls( camera, renderer.domElement);
      //domEl = renderer.domElement;
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

  control.addEventListener( 'unlock', function () {

   console.log ("unlock")
   camera.position.x = 0;
   camera.position.y = 0;
  
  } );

  const onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };

  const mtlLoader = new MTLLoader();
  function loadMaterial() {
    mtlLoader.load("model/mtl/3d-model.mtl", function (materials) {
      materials.preload();
      bathroomMtl = materials;
      loadModel(bathroomMtl);
    });
  }

  // load model
  // X cord : left and right
  const objLoader = new OBJLoader();
  function loadModel(bathroomMtl) {
    objLoader.setMaterials(bathroomMtl);
    objLoader.load(
      "model/obj/3d-model.obj",
      (object) => {
        // (object.children[0] as THREE.Mesh).material = material
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         (child as THREE.Mesh).material = material
        //     }
        // })
        bathroomModel = object;
        scene.add(bathroomModel);
        bathroomModel.position.x = camera.position.x + 15;
        bathroomModel.position.y = blockPlane.position.y + 1;
        bathroomModel.position.z = camera.position.z - 10;
        bathroomModel.scale.set(0.04, 0.04, 0.04);
        bathroomModel.rotateY(Math.PI / 2);
        //bathroomModel.rotateX( Math.PI / 1);
      },
      onProgress,
      (error) => {
        console.log(error);
      }
    );
  }

  const mtlLoader2 = new MTLLoader();
  function loadMaterial2() {
    mtlLoader2.load("model/mtl/3d-model.mtl", function (material) {
      material.preload();
      bathroomMtl2 = material;
      loadModel2(bathroomMtl2);
    });
  }

  const objLoader2 = new OBJLoader();
  function loadModel2(bathroomMtl2) {
    objLoader2.setMaterials(bathroomMtl2);
    objLoader2.load(
      "model/obj/3d-model.obj",
      (object) => {
        // (object.children[0] as THREE.Mesh).material = material
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         (child as THREE.Mesh).material = material
        //     }
        // })
        scene.add(object);
        object.position.x = camera.position.x - 13;
        object.position.y = blockPlane.position.y + 1;
        object.position.z = bathroomModel.position.z;
        object.scale.set(0.04, 0.04, 0.04);
        object.rotateY(Math.PI / -2);
      },
      onProgress,
      (error) => {
        console.log(error);
      }
    );
  }

  // const mtlLoaderLiving = new MTLLoader();
  // function loadMaterial2() {
  //   mtlLoader2.load("model/mtl/3d-model.mtl", function (material) {
  //     material.preload();
  //     bathroomMtl2 = material;
  //     loadModelLiving(livingRoomMtl);
  //   });
  // }

  const objLoaderLiving = new OBJLoader();
  function loadModelLiving() {
    //objLoaderLiving.setMaterials(livingRoomMtl);
    objLoaderLiving.load(
      "model/obj/Preview Living Room_OBJ.obj",
      (object) => {
        scene.add(object);
        object.position.x = camera.position.x;
        object.position.y = blockPlane.position.y + 1;
        object.position.z = camera.position.z - 30;
        object.scale.set(0.02, 0.02, 0.02);
        //object.rotateY(Math.PI / 8);
      },
      onProgress,
      (error) => {
        console.log(error);
      }
    );
  }

  function addCube() {
    const geometry = new THREE.ConeGeometry( 0.05, 0.5 );
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    //scene.add(cube);

    cube.position.x = 0;
    cube.position.y = blockPlane.position.y + 3;
    cube.position.z = camera.position.z - 2;

    goal = new THREE.Object3D;
    // follow = new THREE.Object3D;
    // follow.position.z = -coronaSafetyDistance;
    // cube.add(camera);
    // cube.add( follow );

    // goal.add( camera );
    //scene.add( cube );
  }

  function createFloor() {
    let pos = { x: 0, y: -4, z: 3 };
    let scale = { x: 100, y: 2, z: 100 };

    blockPlane = new THREE.Mesh(
      new THREE.BoxBufferGeometry(),
      new THREE.MeshPhongMaterial({ color: 0x139436 })
    );
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);
  }

  function addObj() {
    createFloor();
    loadMaterial();
    loadMaterial2();
    loadModelLiving();
    addCube();
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

var animate = function () {
  requestAnimationFrame(animate);
  
  let speed = 0.0;

 
  if ( keys.w )
    speed = -0.5
  else if ( keys.s )
    speed = 0.5;

  velocity += (speed - velocity) * .3;
  //cube.translateZ(velocity)
  control.moveForward( - velocity)

  if ( keys.a ){
    camera.rotateY (0.2)

  }else if ( keys.d ){
    camera.rotateY(-0.2);
  }

  //camera.lookAt(cube.position)

  a.lerp(cube.position, 0.4);
  b.copy(goal.position);

  dir.copy( a ).sub( b ).normalize();
  // const dis = a.distanceTo( b ) - coronaSafetyDistance;
  // goal.position.addScaledVector( dir, dis );
  // goal.position.lerp(temp, 0.06);
  // temp.setFromMatrixPosition(follow.matrixWorld);

  //orbitctrl.update();
  
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


//Character/user move
function onDocumentKeyDown(event) {
  let speed = 0.2;
  var keyCode = event.which;

  // 87 = 'W'; 83 = 'S'; 65 = 'A'; 68 = 'D'
   if (keyCode == 83) {
    //cube.position.z += zSpeed;
    control.moveForward(-speed);
  } else if (keyCode == 65) {
    //cube.position.x -= xSpeed ;
    control.moveRight(-speed);
  } else if (keyCode == 68) {
    //cube.position.x += xSpeed;
    control.moveRight(speed);
  } else if (keyCode == 81){
    //cube.position.x -= xSpeed - camera.position.z;
    camera.rotateY (Math.PI / 2) //a
  }else if (keyCode == 69){
    //cube.position.x -= xSpeed - camera.position.z;
    camera.rotateY (Math.PI / -2) //a
  }else if (keyCode == 32) {
    cube.position.set(0, -1, camera.position.z - 1);
    camera.position.set(0, 0, 0);
  } else if ( keycode == 27) {
    unlocked == true;
  }

  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
}

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

// run functions
init();
animate();

window.addEventListener("resize", onWindowResize);

