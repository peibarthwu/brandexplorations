import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xffffff, 0, 300);
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("three").appendChild(renderer.domElement);

//scene.add(cube);

//svg
const loader = new SVGLoader();

const extrudeSettings = {
  steps: 2,
  depth: 150,
  bevelEnabled: false,
};

// load a SVG resource
loader.load(
  // resource URL
  "a17.svg",
  // called when the resource is loaded
  function (data) {
    const paths = data.paths;
    const group = new THREE.Group();
    const width = 0;
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      const material = new THREE.MeshBasicMaterial({
        color: path.color,
        side: THREE.DoubleSide,
        depthWrite: true,
      });

      const shapes = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI;
        group.add(mesh);
      }
    }
    const box = new THREE.Box3().setFromObject(group);
    console.log(box);
    // var sizeX = box.getSize().x;
    group.position.set(-63, 40, 0);

    scene.add(group);
  },
  // called when loading is in progresses
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

camera.position.z = 100;
// camera.rotation.y = 2;

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  // 	cube.rotation.x += 0.01;
  // 	cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

var params = {
  color: "#000000",
  fog_depth: 300,
};
var gui = new dat.GUI();
var folder = gui.addFolder("Parameters");

folder.addColor(params, "color").onChange(function () {
  scene.background = new THREE.Color(params.color);
  scene.fog.color = new THREE.Color(params.color);
});

folder
  .add(params, "fog_depth", 0, 1000)
  .step(1)
  .onChange(function (value) {
    scene.fog.far = value;
  });
