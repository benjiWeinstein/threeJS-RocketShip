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

// TODO: Texture Loading
// We usually do the texture loading before we start everything else, as it might take processing time

// TODO: Add Lighting

// TODO: Spaceship
// You should copy-paste the spaceship from the previous exercise here
function getSpaceShip() {
  const shipGroup = new THREE.Group();
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
const shipGroup = getSpaceShip()
scene.add(shipGroup)

// TODO: Planets
// You should add both earth and the moon here

// TODO: Bezier Curves

// TODO: Camera Settings
// Set the camera following the spaceship here

// TODO: Add collectible stars

// TODO: Add keyboard event
// We wrote some of the function for you
const handle_keydown = (e) => {
  if (e.code == "ArrowLeft") {
    // TODO
  } else if (e.code == "ArrowRight") {
    // TODO
  }
};
document.addEventListener("keydown", handle_keydown);

function animate() {
  requestAnimationFrame(animate);

  // TODO: Animation for the spaceship position

  // TODO: Test for star-spaceship collision

  renderer.render(scene, camera);
}
animate();
