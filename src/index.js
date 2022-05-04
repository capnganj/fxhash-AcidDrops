//CAPNGANJ Bubblehash fxhash generative token
//April, 2022

//imports
import { Features } from './Features';
import { Textures } from './Textures';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


//1) - generate fxhash features - global driving parameters
//new featuresClass
let feet = new Features();
window.$fxhashData = feet;

// FX Features
window.$fxhashFeatures = {
  "Palette" : feet.color.name,
  "Scale" : feet.scale.tag,
  "Speed": feet.speed.tag,
  "Density": feet.density.tag
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
var cuber;

//p5 textures generation
let txt = new Textures(feet, (dataUrls) => {
  //console.log("callback", dataUrl);
  cuber = new THREE.CubeTextureLoader().load(dataUrls, () => {});
  cuber.mapping = THREE.CubeRefractionMapping;
  init();
});


//global vars 
var matShader, controls, renderer, scene, camera;

function init() {
  //scene & camera
  scene = new THREE.Scene();
  //scene.background = cuber;

  renderer = new THREE.WebGLRenderer( { 
    antialias: true,
    alpha: true
  } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
  camera.position.set( 0, 0, 4 );

  //lights
  const p1 = new THREE.PointLight( feet.color.cero, 0.5);
  p1.position.set( 5, 10, 5);
  scene.add(p1);
  const p2 = new THREE.PointLight( feet.color.uno, 0.5);
  p2.position.set( -5, 10, -5);
  scene.add(p2);
  const p3 = new THREE.PointLight( feet.color.dos, 0.5);
  p3.position.set( -5, 5, 5);
  scene.add(p3);
  const p4 = new THREE.PointLight( feet.color.tres, 0.5);
  p4.position.set( 5, 5, -5);
  scene.add(p4);
  const p5 = new THREE.PointLight( feet.color.quatro, 0.5);
  p5.position.set( 5, -5, 5);
  scene.add(p5);
  const p6 = new THREE.PointLight( feet.color.cinco, 0.5);
  p6.position.set( -5, -5, -5);
  scene.add(p6);
  const p7 = new THREE.PointLight( feet.color.sies, 0.5);
  p7.position.set( -5, -1, 5);
  scene.add(p7);
  const p8 = new THREE.PointLight( feet.color.siete, 0.5);
  p8.position.set( 5, -1, -5);
  scene.add(p8);
  const amb = new THREE.AmbientLight( 0xcccccc, 0.35);
  scene.add(amb);

  // controls
  controls = new OrbitControls( camera, renderer.domElement );
  controls.enableDamping=true;
  controls.dampingFactor = 0.2;
  controls.autoRotate= true;
  controls.autoRotateSpeed = 1.0;
  controls.maxDistance = 10;
  controls.minDistance = 3;



  //bubble geometry
  const b = new THREE.IcosahedronGeometry(1.5, 15);

  //phong
  const m = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    envMap: cuber,
    refractionRatio: 0.85,
    reflectivity: 1.0,
    shininess: 100,
    opacity: 0.75,
    transparent: true,
    //flatShading: true
  });
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

  const axis = new THREE.AxesHelper(3);
  //scene.add(axis);


  //set the background color 
  let bod = document.body;
  bod.style.backgroundColor = feet.color.background;

  //set up resize listener and let it rip!
  window.addEventListener( 'resize', onWindowResize );
  animate();
}


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
