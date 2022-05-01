//CAPNGANJ Bunny on Shrooms fxhash generative token
//April, 2022

//imports
import { Features } from './Features';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Bunny from './bunnyUV.obj';


//1) - generate fxhash features - global driving parameters
//new featuresClass
let feet = new Features();
window.$fxhashData = feet;

// FX Features
window.$fxhashFeatures = {
  "Palette" : feet.color.name,
  "Scale" : feet.scale.tag,
  "Speed": feet.speed.tag,
  "Brightness": feet.brightness.tag,
  "Depth": feet.permutations.tag
};
console.log(window.$fxhashFeatures);
console.log(feet);

//vars related to fxhash preview call
//loaded tracks whether texture has loaded;
//previewed tracks whether preview has been called
let loaded = false;
let previewed = false;

//from fxhash webpack boilerplate
// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
//console.log("fxhash features", window.$fxhashFeatures);


//2) Initialize three.js scene and start the render loop
//all data driving geometry and materials and whatever else should be generated in step 2

//scene & camera
let scene = new THREE.Scene();

let renderer = new THREE.WebGLRenderer( { 
  antialias: true,
  alpha: true
} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set( 0, 3, 4 );

//lights
//const amb = new THREE.AmbientLight(0xffffff);
//scene.add(amb);

// controls
let controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping=true;
controls.dampingFactor = 0.2;
controls.autoRotate= true;
controls.maxDistance = 10;
controls.minDistance = 2;


//shader uniforms!
let uniforms = {
  //used by both vertex and fragment
  time: { value: 1.0 },

  //vertex only
  scale: { value: 1.0 },
  displacement: { value: feet.scale.dispValue },
  speed: { value: feet.speed.vertexValue },

  //fragment only
  fragSpeed: { value: feet.speed.fragmentValue },
  uvScale: { value: [feet.scale.value, feet.scale.value]},
  brightness: { value: feet.brightness.value },
  permutations: { value: feet.permutations.value },
  iterations: { value: 1.0 },
  color1: { value: [feet.color.uno.r/255,feet.color.uno.g/255,feet.color.uno.b/255]},
  color2: { value: [feet.color.dos.r/255,feet.color.dos.g/255,feet.color.dos.b/255]},
  color3: { value: [feet.color.tres.r/255,feet.color.tres.g/255,feet.color.tres.b/255]},
};

//bunny model load
const objLoader = new OBJLoader();
objLoader.load(Bunny, (bunny) => {

  //placeholder material for testing
  //const material2 = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

  //first shot at a shader material
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent 
  });
  
  //add mesh to scene <3
  const mesh = new THREE.Mesh(bunny.children[0].geometry, material);
  mesh.scale.set(20,20,20);
  mesh.position.y -= 2;
  scene.add(mesh);

  //loaded flag for fxhash capture
  loaded = true;
})


//set the background color 
let bod = document.body;
bod.style.backgroundColor = feet.color.background;


//set up resize listener and let it rip!
window.addEventListener( 'resize', onWindowResize );
animate();


// threejs animation stuff
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

  requestAnimationFrame( animate );

  uniforms[ 'time' ].value = performance.now() / 1000;

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();

}


function render() {

  renderer.render( scene, camera );

  if(previewed == false && loaded == true){
    fxpreview();
    previewed = true;
  } 

  //mesh.rotation.y += 0.001;

}
