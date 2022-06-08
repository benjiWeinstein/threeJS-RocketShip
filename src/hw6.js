import {OrbitControls} from './OrbitControls.js'

// Scene Declartion
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

let LEFT_CURVE = false;
let MID_CURVE = true;
let RIGHT_CURVE = false;

// helper function for later on
function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

// Here we load the cubemap and skymap, you may change it

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  "src/skybox/right.png",
  "src/skybox/left.png",
  "src/skybox/top.png",
  "src/skybox/bottom.png",
  "src/skybox/front.png",
  "src/skybox/back.png",
]);
scene.background = texture;

// This defines the initial distance of the camera
const cameraTranslate = new THREE.Matrix4();
const {x,y,z} = {x: -29.496135114851047, y: 24.866340374947658, z: -28.166739254418264}
cameraTranslate.makeTranslation(x,y,z);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );


//Orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
let isOrbitEnabled = true;
// const toggle = (e) => {

  
// }

// document.addEventListener('keydown',toggle)
//controls.update() must be called after any manual changes to the camera's transform
controls.update();

// TODO: Texture Loading
// We usually do the texture loading before we start everything else, as it might take processing time
const moonLoader = new THREE.TextureLoader();
const moonTexture = moonLoader.load("src/textures/moon.jpg")

const earthLoader = new THREE.TextureLoader();
const earthTexture = earthLoader.load("src/textures/earth.jpg")

// TODO: Add Lighting

const pointlight = new THREE.PointLight(0xffffff, 1.2)
pointlight.position.set(60, 100, 100)
scene.add(pointlight)
const directionLight = new THREE.DirectionalLight(0xffffff, 0.9)
scene.add(directionLight)

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set( 100, 1000, 100 );
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
scene.add( spotLight );



// TODO: Spaceship
// You should copy-paste the spaceship from the previous exercise here
function getSpaceShip() {
  let shipGroup = new THREE.Group();
  shipGroup.name = "Ship";
  let geometry = new THREE.ConeGeometry(5, 15, 32);
  let material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
  const cone = new THREE.Mesh(geometry, material);
  cone.name = "Ship head";
  cone.applyMatrix4(new THREE.Matrix4().makeTranslation(5, 12.5, 5));

  geometry = new THREE.CylinderGeometry(5, 5, 15, 32);
  material = new THREE.MeshPhongMaterial({ color: 0xffaf00 });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.name = "Ship body";
  cylinder.applyMatrix4(new THREE.Matrix4().makeTranslation(5, -2.5, 5));

  const windows = new THREE.Group();
  geometry = new THREE.RingGeometry(3, 5, 32);
  material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const window1 = new THREE.Mesh(geometry, material);
  window1.applyMatrix4(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3));
  window1.applyMatrix4(new THREE.Matrix4().makeTranslation(5, 18, 10));

  const window2 = new THREE.Mesh(geometry, material);
  window2.applyMatrix4(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3));
  window2.applyMatrix4(new THREE.Matrix4().makeTranslation(5, 14, 10));

  windows.add(window1, window2);

  const thrusters = new THREE.Group();
  geometry = new THREE.RingGeometry(4, 6, 32);
  material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
  });
  const thruster1 = new THREE.Mesh(geometry, material);
  thruster1.applyMatrix4(
    new THREE.Matrix4().makeRotationX(degrees_to_radians(90))
  );
  thruster1.applyMatrix4(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3));
  thruster1.applyMatrix4(new THREE.Matrix4().makeTranslation(2.5, 5, 5));

  const thruster2 = new THREE.Mesh(geometry, material);
  thruster2.applyMatrix4(
    new THREE.Matrix4().makeRotationX(degrees_to_radians(90))
  );
  thruster2.applyMatrix4(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3));
  thruster2.applyMatrix4(new THREE.Matrix4().makeTranslation(7, 5, 5));

  geometry = new THREE.CircleGeometry(4, 32);
  material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
  });
  const burner1 = new THREE.Mesh(geometry, material);
  burner1.applyMatrix4(
    new THREE.Matrix4().makeRotationX(degrees_to_radians(90))
  );
  burner1.applyMatrix4(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3));
  burner1.applyMatrix4(new THREE.Matrix4().makeTranslation(2.5, 5, 5));

  const burner2 = new THREE.Mesh(geometry, material);
  burner2.applyMatrix4(
    new THREE.Matrix4().makeRotationX(degrees_to_radians(90))
  );
  burner2.applyMatrix4(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3));
  burner2.applyMatrix4(new THREE.Matrix4().makeTranslation(7, 5, 5));

  thrusters.add(thruster1, thruster2, burner1, burner2);

  function constructTriangle() {
    const group = new THREE.Group();
    geometry = new THREE.BufferGeometry();
    const geometryCopy = new THREE.BufferGeometry();
    const v1 = [0, 0, 0];
    const v2 = [10, 0, 0];
    const v3 = [10, 10, 0];
    material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([...v1, ...v2, ...v3]), 3)
    );
    const mesh1 = new THREE.Mesh(geometry, material);
    const material2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    geometryCopy.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([...v2, ...v1, ...v3]), 3)
    );
    const mesh2 = new THREE.Mesh(geometryCopy, material);
    group.add(mesh1, mesh2);
    return group;
  }
  function createTriangles() {
    const tri1 = constructTriangle();
    tri1.applyMatrix4(new THREE.Matrix4().makeTranslation(-6, 5, 5));

    const tri2 = constructTriangle();
    tri2.applyMatrix4(
      new THREE.Matrix4().makeRotationY(degrees_to_radians(180))
    );
    tri2.applyMatrix4(new THREE.Matrix4().makeTranslation(16, 5, 5));

    const tri3 = constructTriangle();
    tri3.applyMatrix4(
      new THREE.Matrix4().makeRotationY(degrees_to_radians(90))
    );
    tri3.applyMatrix4(new THREE.Matrix4().makeTranslation(5, 5, 16));

    const tri4 = constructTriangle();
    tri4.applyMatrix4(
      new THREE.Matrix4().makeRotationY(degrees_to_radians(270))
    );
    tri4.applyMatrix4(new THREE.Matrix4().makeTranslation(5, 5, -6));
    return { tri1, tri2, tri3, tri4 };
  }

  const { tri1, tri2, tri3, tri4 } = createTriangles();
  const wings = new THREE.Group();
  wings.add(tri1, tri2, tri3, tri4);
  const hull = new THREE.Group();
  hull.add(wings, cylinder, windows, thrusters);
  scene.add(hull);
  [cone, cylinder].forEach((item) =>
    item.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 15, 0))
  );

  shipGroup.add(cone, hull);
  return shipGroup
}
let shipGroup = getSpaceShip()
shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-5, 145, -4))
shipGroup.applyMatrix4(new THREE.Matrix4().makeScale(0.1,0.1,0.1))
scene.add(shipGroup)

// TODO: Planets
// You should add both earth and the moon here
let earthGeometry = new THREE.SphereGeometry(15, 32, 16);
let earthMaterial = new THREE.MeshPhongMaterial({color:0xffffff, map:earthTexture});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.applyMatrix4(new THREE.Matrix4().makeRotationX(degrees_to_radians(-49)))
earth.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(10)))
scene.add(earth);


let moonGeometry = new THREE.SphereGeometry(3.75, 32, 16);
let moonMaterial = new THREE.MeshPhongMaterial({color:0xffffff, map:moonTexture});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.applyMatrix4(new THREE.Matrix4().makeTranslation(100, 5, 100))
scene.add(moon);


//helpers
let gridHelper, axesHelper, lightHelper;
function addHelpers() {
	gridHelper = new THREE.GridHelper(200,50)
	axesHelper = new THREE.AxesHelper( 100 );
	lightHelper = new THREE.PointLightHelper(pointlight)
	scene.add( axesHelper,gridHelper,lightHelper );
}
addHelpers()
function removeHelpers() {
	scene.remove( axesHelper,gridHelper,lightHelper );
}


// TODO: Bezier Curves
function createCurve(x,y,z){
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3( shipGroup.position.x, shipGroup.position.y, shipGroup.position.z ),
    new THREE.Vector3( x, y, z ),
    new THREE.Vector3( moon.position.x, moon.position.y, moon.position.z )
  );
  const points = curve.getPoints( 50 );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  
  const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
  
  // Create the final object to add to the scene
  const curveObject = new THREE.Line( geometry, material );
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
  const line = new THREE.Line(lineGeo, lineMat);
  return {line, curve}
}
let res = createCurve(0,5,40)
const line1 = res.line 
const curve1 = res.curve
scene.add(line1)
res = createCurve(50,0,50)
const line2 = res.line 
const curve2 = res.curve
scene.add(line2)
res = createCurve(90,-20,50)
const line3 = res.line 
const curve3 = res.curve
scene.add(line3)

var curveIndx = 1;
var framerate = 0.0005
const maxFrame = 0.001
const minFrame = 0.0001






// TODO: Camera Settings
// Set the camera following the spaceship here

// TODO: Add collectible stars

// TODO: Add keyboard event
// We wrote some of the function for you
const handle_keydown = (e) => {
  if (e.code == "ArrowLeft") {
    // TODO
    if (curveIndx > 0) {
      curveIndx = curveIndx - 1;
      if (curveIndx == 0) {
        MID_CURVE = false;
        LEFT_CURVE = true;
      }
      else {
        RIGHT_CURVE = false;
        MID_CURVE = true;
      }
    }

  } else if (e.code == "ArrowRight") {
    // TODO
    if (curveIndx < 2) {
      curveIndx = curveIndx + 1;
      if (curveIndx == 2) {
        MID_CURVE = false;
        RIGHT_CURVE = true;
      }
      else {
        LEFT_CURVE = false;
        MID_CURVE = true;
      }
    }
  } else if (e.code == "ArrowUp") {
      if (framerate <= maxFrame) {
        framerate = framerate + 0.0001
      }
  } else if (e.code == "ArrowDown") {
      if (framerate >= minFrame) {
        framerate = framerate - 0.0001
      }
  } else if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
  else if (e.key == "c"){
		console.log('Camera',camera.position)
		console.log('Earth',earth.position)
		console.log('Ship',shipGroup.position)
		console.log('moon',moon.position)
		console.log('bezier 50%',curve1.getPoint(0.5))
		console.log('bezier 50%',curve1.getPoint(0.01))
    


    
	}
};
document.addEventListener("keydown", handle_keydown);

//controls.update() must be called after any manual changes to the camera's transform
let frame = 0
controls.update();

function animate() {
  requestAnimationFrame(animate);

	controls.enabled = isOrbitEnabled;
	controls.update();
  frame = frame + framerate
  shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-shipGroup.position.x,-shipGroup.position.y,-shipGroup.position.z))

  if (LEFT_CURVE) shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(curve3.getPoint(frame).x,curve3.getPoint(frame).y,curve3.getPoint(frame).z))
  if (MID_CURVE) shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(curve2.getPoint(frame).x,curve2.getPoint(frame).y,curve2.getPoint(frame).z))
  if (RIGHT_CURVE) shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(curve1.getPoint(frame).x,curve1.getPoint(frame).y,curve1.getPoint(frame).z))

  // shipGroup.position = curve1.getPoint(frame)


  // TODO: Animation for the spaceship position

  // TODO: Test for star-spaceship collision

  renderer.render(scene, camera);
}
animate();
