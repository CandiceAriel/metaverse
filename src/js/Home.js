import * as THREE from "three";

import { OBJLoader } from "../../public/js/obj.js";
import { MTLLoader } from "../../public/js/mtl.js";
import { PointerLockControls } from "../../public/js/PointerLockControls.js";
import { Clock } from "../../public/js/Clock.js";

const homecontainer = document.getElementsByClassName("home_canvas_container");
console.log(homecontainer);

let camera, scene, renderer;
let ambientLight, pointLight;
let clock, control;

let bathroomModel, bathroomMtl, bathroomMtl2;
let cube, blockPlane;
let mouseIsDown = false;

let mouseX = 0,
  mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let xSpeed = 0.5;
let zSpeed = 0.5;

/* global _ */
let moveBackward = false;
let moveForward = false;
let moveLeft = false;
let moveRight = false;

let delta;

function init() {
  //ADD CAMERA
  //camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 500 );
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (mouseY - camera.position.x) * 0.05;
  // camera.position.z = 50;

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
      //domEl = renderer.domElement;
    } else {
      setTimeout(checkCanvas, 1000);
    }
  }

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
        bathroomModel.position.x = cube.position.x + 10;
        bathroomModel.position.y = blockPlane.position.y + 1;
        bathroomModel.position.z = cube.position.z - 7;
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
        object.position.x = cube.position.x - 10;
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

  function addCube() {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // camera.add(cube);
    // cube.position.set (0, -1, -1.5);

    cube.position.x = 0;
    cube.position.y = -0.9;
    cube.position.z = -1.2;
  }

  function createFloor() {
    let pos = { x: 0, y: -5, z: 3 };
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

  $("div").on("mousedown mouseup", function mouseState(e) {
    if (e.type == "mousedown") {
      //code triggers on hold
      mouseIsDown = true;
      setTimeout(function () {
        if (mouseIsDown) {
          control.lock();
          console.log("hold");
        }
      }, 7000);
    } else if (e.type == "mouseup") {
      mouseIsDown = false;
      console.log("click");
    }
  });

  function addObj() {
    createFloor();
    loadMaterial();
    loadMaterial2();
    addCube();
  }

  document.addEventListener("keydown", onDocumentKeyDown);
  document.addEventListener("keyup", onKeyUp);

  checkCanvas();
  addObj();
}
//
var render = function () {
  requestAnimationFrame(render);

  //rener scene and camera
  renderer.render(scene, camera);
};

//--------
//EVENT HANDLERS
function onWindowResize() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  renderer.setSize(canvasWidth, canvasHeight);

  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
}

//Character/user move
function onDocumentKeyDown(event) {
  let speed = 0.5;
  var keyCode = event.which;

  // 87 = 'W'; 83 = 'S'; 65 = 'A'; 68 = 'D'
  if (keyCode == 87) {
    cube.position.z -= zSpeed;
    control.moveForward(speed);
    moveForward = true;
  } else if (keyCode == 83) {
    cube.position.z += zSpeed;
    control.moveForward(-speed);
    moveBackward = true;
  } else if (keyCode == 65) {
    cube.position.x -= xSpeed;
    control.moveRight(-speed);
    moveLeft = true;
    //directionOffset = Math.PI / 2; //a
  } else if (keyCode == 68) {
    cube.position.x += xSpeed;
    control.moveRight(speed);
    moveRight = true;
    //directionOffset = Math.PI / 2; //d
  } else if (keyCode == 32) {
    cube.position.set(0, 0, 0);
  }

  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
}

function onKeyUp(event) {
  var keyCode = event.which;

  // 87 = 'W'; 83 = 'S'; 65 = 'A'; 68 = 'D'
  if (keyCode == 87) {
    moveForward = false;
  } else if (keyCode == 83) {
    moveBackward = false;
  } else if (keyCode == 65) {
    moveLeft = false;
  } else if (keyCode == 68) {
    moveRight = false;
  }
}

// run functions
init();
render();

window.addEventListener("resize", onWindowResize);
