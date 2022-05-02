//CAPNGANJ Bubblehash fxhash generative token
//April, 2022

//imports
import { Features } from './Features';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import NX from './nx.png';
import NY from './ny.png';
import NZ from './nz.png';
import PX from './px.png';
import PY from './py.png';
import PZ from './pz.png';


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

//cube environment map.  Starting with some sample three textures; intending to generate these on the fly TODO
const urls = [PX,NX,PY,NY,PZ,NZ];
const cuber = new THREE.CubeTextureLoader().load(urls, () => {this.loaded = true});
cuber.mapping = THREE.CubeRefractionMapping;

//scene & camera
let scene = new THREE.Scene();
scene.background = cuber;

let renderer = new THREE.WebGLRenderer( { 
  antialias: true,
  alpha: true
} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set( 0, 0, 4 );

//lights
const p1 = new THREE.PointLight( 0xcccccc, 1);
p1.position.set( 5, 5, 5);
scene.add(p1);
const p2 = new THREE.PointLight( 0xcccccc, 1);
p2.position.set( -5, 3, -5);
scene.add(p2);
const p3 = new THREE.PointLight( 0xcccccc, 1);
p3.position.set( -5, 1, 5);
scene.add(p3);
const p4 = new THREE.PointLight( 0xcccccc, 1);
p4.position.set( 5, 1, -5);
scene.add(p4);
const hem = new THREE.HemisphereLight( 0xcccccc, 0xdedede, 0.666);
scene.add(hem);

// controls
let controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping=true;
controls.dampingFactor = 0.2;
controls.autoRotate= true;
controls.maxDistance = 10;
controls.minDistance = 2;



//bubble geometry
const b = new THREE.IcosahedronGeometry(1.5,10);
const t = new THREE.TorusGeometry(1.5,0.25, 25, 100);

//phong
const m = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  envMap: cuber,
  refractionRatio: 0.9,
  reflectivity: 0.99,
  opacity: 0.5,
  transparent: true
});
let matShader;
m.onBeforeCompile = function(shader){

  //try 2 - replace the shader chunk
  shader.vertexShader = shader.vertexShader
    .replace('#include <project_vertex>', document.getElementById( 'vertexShaderFragment' ).textContent)
    .replace('#include <common>', '#include <common>' + document.getElementById('vertexShaderCommonFragment').textContent);

  shader.uniforms.time = { value: 0.01 };
  shader.uniforms.scale = { value: 1.0 };
  shader.uniforms.displacement = { value: feet.scale.dispValue };
  shader.uniforms.speed = { value: feet.speed.vertexValue };
  matShader = shader;
}

const mesh = new THREE.Mesh(b, m);
scene.add(mesh);


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

  
  if (matShader) {
    matShader.uniforms.time.value = performance.now() / 1000;
  }
  

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  requestAnimationFrame( animate );
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
