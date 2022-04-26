import * as THREE from "three";

import { OBJLoader } from "../../public/js/obj.js";
import { MTLLoader } from "../../public/js/mtl.js";
import { PointerLockControls } from "../../public/js/PointerLockControls.js";
import { render } from "vue";

const sketchcontainer = document.getElementsByClassName("sketch_canvas_container");
const btnLockSketch = document.getElementsByClassName("sketch_btn_lock");

var camera, scene, renderer, mesh, goal, keys, follow, ctrl;
let ambientLight, pointLight;
let bathroomModel, bathroomMtl, bathroomMtl2;

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
var speed = 0.0;
let mouseX = 0,
  mouseY = 0;

var delta;

function init() {
  camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.5, 1000 );
  //camera.position.set( 0, 0, 0 );
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y = 0.16;
  camera.position.z = 1;

  scene = new THREE.Scene();
  scene.background = new THREE.Color("lightgray");

  ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);
  scene.add(camera);

  //add point light
  pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  //camera.lookAt( scene.position );

  function addCube(){
    var geometry = new THREE.BoxBufferGeometry( 0.2, 0.2, 0.2 );
    var material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = 0;
    mesh.position.z = camera.position.z - 2;

    goal = new THREE.Object3D;
    follow = new THREE.Object3D;
    follow.position.z = -coronaSafetyDistance;
    mesh.add(camera);
    mesh.add( follow );

    goal.add( camera );
    scene.add( mesh );
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
        bathroomModel.position.x = mesh.position.x + 5;
        bathroomModel.position.y = mesh.position.y - 0.5;
        bathroomModel.position.z = camera.position.z - 7;
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

  // FLOOR
  var gridHelper = new THREE.GridHelper( 40, 40 );
  scene.add( gridHelper );

  // const floorGeometry = new THREE.PlaneGeometry( 40, 40 );
  // const floorMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
  // const floor = new THREE.Mesh( floorGeometry, floorMaterial );
  // floor.position.y = 0.0;
	// floor.rotation.x = - Math.PI / 2;
  // scene.add( floor );
  // END FLOOR

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  ctrl = new PointerLockControls(camera, renderer.domElement);

  function checkCanvas() {
    if (sketchcontainer.length > 0) {
      sketchcontainer[0].appendChild(renderer.domElement);
    } else {
      setTimeout(checkCanvas, 1000);
    }
  }

  keys = {
    a: false,
    s: false,
    d: false,
    w: false
  };

  document.body.addEventListener( 'keydown', function(e) {

    const key = e.code.replace('Key', '').toLowerCase();
    if ( keys[ key ] !== undefined )
      keys[ key ] = true;

  });
  document.body.addEventListener( 'keyup', function(e) {

    const key = e.code.replace('Key', '').toLowerCase();
    if ( keys[ key ] !== undefined )
      keys[ key ] = false;

  });

  renderer.render( scene, camera );

  function checkButton() {
    if (btnLockSketch.length > 0) {
      btnLockSketch[0].addEventListener('click', () => {
        console.log("clicked");
        ctrl.lock();
    })
    } else {
      setTimeout(checkButton, 1000);
    }
  }

  checkCanvas();
  checkButton();
  addCube();
  loadMaterial();
}
//

function animate() {

  requestAnimationFrame( animate );

  speed = 0.0;

  if ( keys.w )
    speed = -0.02;
  else if ( keys.s )
    speed = 0.02;

  velocity += ( speed - velocity ) * .3;
  mesh.translateZ( velocity );
  ctrl.moveForward(velocity);

  if ( keys.a ){
    mesh.rotateY(0.03);
  }else if ( keys.d ){
    mesh.rotateY(-0.03);
  }
  
 
  a.lerp(mesh.position, 0.4);
  b.copy(goal.position);

  dir.copy( a ).sub( b ).normalize();
  const dis = a.distanceTo( b ) - coronaSafetyDistance;
  goal.position.addScaledVector( dir, dis );
  goal.position.lerp(temp, 0.06);
  temp.setFromMatrixPosition(follow.matrixWorld);

  camera.lookAt( mesh.position );

  renderer.render( scene, camera );

}

function onWindowResize() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  renderer.setSize(canvasWidth, canvasHeight);

  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
}

// run functions
init();
animate();

window.addEventListener("resize", onWindowResize);