import { OrbitControls } from "./OrbitControls.js";

let LEFT_CURVE = false;
let MID_CURVE = true;
let RIGHT_CURVE = false;
let POINTS = 0;

// Scene Declartion
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let myDialog = document.createElement("dialog");
document.body.appendChild(myDialog)
let text = document.createTextNode("WELCOME TO THE GAME!! \n \n Try get as many points as you can! (click to start)");
myDialog.addEventListener('click', () => {
  myDialog.close()
  animate()
})
myDialog.appendChild(text);
myDialog.showModal()



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);


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
const { x, y, z } = {
  x: -29.496135114851047,
  y: 24.866340374947658,
  z: -28.166739254418264,
};
cameraTranslate.makeTranslation(x, y, z);
camera.applyMatrix4(cameraTranslate);

renderer.render(scene, camera);

//Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;
controls.update();

// TODO: Texture Loading
// We usually do the texture loading before we start everything else, as it might take processing time
const moonLoader = new THREE.TextureLoader();
const moonTexture = moonLoader.load("src/textures/moon.jpg");

const earthLoader = new THREE.TextureLoader();
const earthTexture = earthLoader.load("src/textures/earth.jpg");

// TODO: Add Lighting
const pointlight = new THREE.PointLight(0xffffff, 1.2);
pointlight.position.set(60, 100, 100);
scene.add(pointlight);
const directionLight = new THREE.DirectionalLight(0xffffff, 0.9);
scene.add(directionLight);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 1000, 100);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
scene.add(spotLight);

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
  return shipGroup;
}
let shipGroup = getSpaceShip();
shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-5, 145, -4));
shipGroup.applyMatrix4(new THREE.Matrix4().makeScale(0.1, 0.1, 0.1));
scene.add(shipGroup);

// TODO: Planets
// You should add both earth and the moon here
let earthGeometry = new THREE.SphereGeometry(15, 32, 16);
let earthMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: earthTexture,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.applyMatrix4(new THREE.Matrix4().makeRotationX(degrees_to_radians(-49)));
earth.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(10)));
scene.add(earth);

let moonGeometry = new THREE.SphereGeometry(3.75, 32, 16);
let moonMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: moonTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.applyMatrix4(new THREE.Matrix4().makeTranslation(100, 5, 100));
scene.add(moon);

//helpers
let gridHelper, axesHelper, lightHelper;
function addHelpers() {
  gridHelper = new THREE.GridHelper(200, 50);
  axesHelper = new THREE.AxesHelper(100);
  lightHelper = new THREE.PointLightHelper(pointlight);
  scene.add(axesHelper, gridHelper, lightHelper);
}
addHelpers();
function removeHelpers() {
  scene.remove(axesHelper, gridHelper, lightHelper);
}

// TODO: Bezier Curves
function createCurve(x, y, z) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(
      shipGroup.position.x,
      shipGroup.position.y,
      shipGroup.position.z
    ),
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(moon.position.x, moon.position.y, moon.position.z)
  );
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
  const line = new THREE.Line(lineGeo, lineMat);
  return { line, curve };
}
let res = createCurve(0, 5, 40);
const line1 = res.line;
const curve1 = res.curve;
scene.add(line1);
res = createCurve(50, 0, 50);
const line2 = res.line;
const curve2 = res.curve;
scene.add(line2);
res = createCurve(90, -20, 50);
const line3 = res.line;
const curve3 = res.curve;
scene.add(line3);

var curveIndx = 1;
var framerate = 0.0005;
const maxFrame = 0.001;
const minFrame = 0.0001;

// Plane in order to keep ship in line when switching lanes
//const lineToMoon = new THREE.Line3((0,0,0), (100,5,100))
//scene.add(lineToMoon)
//const plane = new THREE.Plane((20, 1, 20))
//scene.add(plane)

const planeGeometry = new THREE.PlaneGeometry(600, 600);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(45)));
scene.add(plane);

// TODO: Camera Settings
// Set the camera following the spaceship here

// TODO: Add collectible stars
const starGeometry = new THREE.SphereGeometry(0.5, 32, 16);
const goodStarMaterial = new THREE.MeshPhongMaterial({
  color: 0x08ff00,
  name: 1,
});
const badStarMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  name: -1,
});

const star1 = new THREE.Mesh(starGeometry, goodStarMaterial);
star1.applyMatrix4(
  new THREE.Matrix4().makeTranslation(
    curve1.getPoint(0.2).x,
    curve1.getPoint(0.2).y,
    curve1.getPoint(0.2).z
  )
);
scene.add(star1);

const star2 = new THREE.Mesh(starGeometry, badStarMaterial);
star2.applyMatrix4(
  new THREE.Matrix4().makeTranslation(
    curve1.getPoint(0.25).x,
    curve1.getPoint(0.25).y,
    curve1.getPoint(0.25).z
  )
);
scene.add(star2);

const star3 = new THREE.Mesh(starGeometry, goodStarMaterial);
star3.applyMatrix4(
  new THREE.Matrix4().makeTranslation(
    curve3.getPoint(0.35).x,
    curve3.getPoint(0.35).y,
    curve3.getPoint(0.35).z
  )
);
scene.add(star3);

const star4 = new THREE.Mesh(starGeometry, goodStarMaterial);
star4.applyMatrix4(
  new THREE.Matrix4().makeTranslation(
    curve2.getPoint(0.513).x,
    curve2.getPoint(0.513).y,
    curve2.getPoint(0.513).z
  )
);
scene.add(star4);

const star5 = new THREE.Mesh(starGeometry, goodStarMaterial);
star5.applyMatrix4(
  new THREE.Matrix4().makeTranslation(
    curve1.getPoint(0.42).x,
    curve1.getPoint(0.42).y,
    curve1.getPoint(0.42).z
  )
);
scene.add(star5);

const star6 = new THREE.Mesh(starGeometry, badStarMaterial);
star6.applyMatrix4(
  new THREE.Matrix4().makeTranslation(
    curve1.getPoint(0.45).x,
    curve1.getPoint(0.45).y,
    curve1.getPoint(0.45).z
  )
);
scene.add(star6);

const star7 = new THREE.Mesh(starGeometry, goodStarMaterial);
star7.applyMatrix4(
  new THREE.Matrix4().makeTranslation(
    curve3.getPoint(0.48).x,
    curve3.getPoint(0.48).y,
    curve3.getPoint(0.48).z
  )
);
scene.add(star7);

const star8 = new THREE.Mesh(starGeometry, badStarMaterial);
star8.applyMatrix4(
  new THREE.Matrix4().makeTranslation(
    curve3.getPoint(0.415).x,
    curve3.getPoint(0.415).y,
    curve3.getPoint(0.415).z
  )
);
scene.add(star8);

const star9 = new THREE.Mesh(starGeometry, goodStarMaterial);
star9.applyMatrix4(
  new THREE.Matrix4().makeTranslation(
    curve1.getPoint(0.9).x,
    curve1.getPoint(0.9).y,
    curve1.getPoint(0.9).z
  )
);
scene.add(star9);

let stars = [star1, star2, star3, star4, star5, star6, star7, star8, star9];

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
      } else {
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
      } else {
        LEFT_CURVE = false;
        MID_CURVE = true;
      }
    }
  } else if (e.code == "ArrowUp") {
    if (framerate <= maxFrame) {
      framerate = framerate + 0.0001;
    }
  } else if (e.code == "ArrowDown") {
    if (framerate >= minFrame) {
      framerate = framerate - 0.0001;
    }
  } else if (e.key == "o") {
    isOrbitEnabled = !isOrbitEnabled;
  } else if (e.key == "c") {
    console.log("Camera", camera.position);
    console.log("Earth", earth.position);
    console.log("Ship", shipGroup.position);
    console.log("moon", moon.position);
    console.log("bezier 50%", curve1.getPoint(0.5));
    console.log("bezier 50%", curve1.arcLengthDivisions);
    const fullLength =
      curve1.getLength() + curve2.getLength() + curve3.getLength();
    curve1.arcLengthDivisions =
      ((curve2.getLength() + curve3.getLength()) / fullLength) * 300;
    curve2.arcLengthDivisions =
      ((curve1.getLength() + curve3.getLength()) / fullLength) * 300;
    curve3.arcLengthDivisions =
      ((curve1.getLength() + curve2.getLength()) / fullLength) * 3;
    console.log({ curve1: curve1, curve2: curve2, curve3: curve3 });
  }
};
document.addEventListener("keydown", handle_keydown);

//controls.update() must be called after any manual changes to the camera's transform
let frame = 0;
let id;
controls.update();

renderer.render(scene, camera);

function animate() {
  id = requestAnimationFrame(animate);

  controls.enabled = isOrbitEnabled;
  controls.update();
  frame = frame + framerate;
  shipGroup.applyMatrix4(
    new THREE.Matrix4().makeTranslation(
      -shipGroup.position.x,
      -shipGroup.position.y,
      -shipGroup.position.z
    )
  );

  plane.applyMatrix4(
    new THREE.Matrix4().makeTranslation(
      -plane.position.x,
      -plane.position.y,
      -plane.position.z
    )
  );
  plane.applyMatrix4(
    new THREE.Matrix4().makeTranslation(
      curve2.getPoint(frame).x,
      curve2.getPoint(frame).y,
      curve2.getPoint(frame).z
    )
  );

  // TODO: Animation for the spaceship position
  if (LEFT_CURVE) {
    //plane.intersectLine(curve3, intersection);
    shipGroup.applyMatrix4(
      new THREE.Matrix4().makeTranslation(
        curve3.getPointAt(frame).x,
        curve3.getPointAt(frame).y,
        curve3.getPointAt(frame).z
      )
    );
  }
  if (MID_CURVE) {
    shipGroup.applyMatrix4(
      new THREE.Matrix4().makeTranslation(
        curve2.getPointAt(frame).x,
        curve2.getPointAt(frame).y,
        curve2.getPointAt(frame).z
      )
    );
  }
  if (RIGHT_CURVE) {
    shipGroup.applyMatrix4(
      new THREE.Matrix4().makeTranslation(
        curve1.getPointAt(frame).x,
        curve1.getPointAt(frame).y,
        curve1.getPointAt(frame).z
      )
    );
  }

  // TODO: Test for star-spaceship collision
  for (const element of stars) {
    if (
      Math.abs(element.position.x - shipGroup.position.x) <= 0.25 &&
      Math.abs(element.position.y - shipGroup.position.y) <= 0.25 &&
      Math.abs(element.position.z - shipGroup.position.z) <= 0.25
    ) {
        element.visible = false;
        // TODO: Create counter for score of each score collected
                // name of material is eoth 1 or -1 depending on good or bad star
        POINTS += element.material.name;
    }
  }

  if (
    Math.abs(moon.position.x - shipGroup.position.x) <= 0.25 &&
    Math.abs(moon.position.y - shipGroup.position.y) <= 0.25 &&
    Math.abs(moon.position.z - shipGroup.position.z) <= 0.25
  ) {
    cancelAnimationFrame(id)
    let finishDialog = document.createElement("dialog");
    document.body.appendChild(finishDialog)
    text = document.createTextNode(`MAZEL TOV! YOU MADE IT WITH ${POINTS} POITNS!! Refresh to try again!`);
    finishDialog.appendChild(text);
    finishDialog.showModal();


  }




  renderer.render(scene, camera);
}
// animate();
