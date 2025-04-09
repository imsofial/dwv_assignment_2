import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { OrbitControls } from './lib/OrbitControls.js';

const SERVER_URL = "http://localhost:5000/get";


let scene, camera, renderer, controls, earth, sunLight;
let markers = [];
let clock = new THREE.Clock();
let fetchedData = [];
let colorSlider, pauseButton, colorLabel;
let isPaused = false;

async function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.autoClear = false;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0x000000, 10);
    scene.add(ambientLight);

    sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    createEarth();
    createUI();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;

    animate();
    setInterval(fetchAndDisplayData, 1000);
}

async function fetchAndDisplayData() {
    if (isPaused) return;
    try {
        const response = await fetch(SERVER_URL);
        const data = await response.json();

        fetchedData = fetchedData.concat(data);
        const latestData = fetchedData.slice(-1);

        latestData.forEach(item => {
            const latitude = item.latitude;
            const longitude = item.longitude;
            const lat = THREE.MathUtils.degToRad(latitude);
            const lon = THREE.MathUtils.degToRad(longitude);
            const radius = 1.01;
            const x = radius * Math.cos(lat) * Math.sin(lon);
            const y = radius * Math.sin(lat);
            const z = radius * Math.cos(lat) * Math.cos(lon);

            const geometry = new THREE.SphereGeometry(0.01, 8, 8);
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
            const colorIndex = Math.floor((colorSlider.value / 360) * colors.length);
            const selectedColor = colors[colorIndex];

            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(selectedColor),
                emissive: new THREE.Color(selectedColor),
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.8
            });

            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(x, y, z);
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            scene.add(sphere);
            setTimeout(() => scene.remove(sphere), 10000);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function createEarth() {
    const textureLoader = new THREE.TextureLoader();
    earth = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshPhongMaterial({
            map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
            normalMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'),
            specularMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'),
            emissiveMap: textureLoader.load('./assets/earth_lights.gif'),
            emissive: new THREE.Color(0xffffff),
            emissiveIntensity: 0.5,
            normalScale: new THREE.Vector2(0.85, 0.85)
        })
    );
    scene.add(earth);
}

function createUI() {
    colorLabel = document.createElement("label");
    colorLabel.innerText = "Color Adjustment:";
    colorLabel.style.position = "absolute";
    colorLabel.style.top = "10px";
    colorLabel.style.left = "10px";
    colorLabel.style.color = "white";
    document.body.appendChild(colorLabel);

    colorSlider = document.createElement("input");
    colorSlider.type = "range";
    colorSlider.min = "0";
    colorSlider.max = "360";
    colorSlider.step = "1";
    colorSlider.value = "60";
    colorSlider.style.position = "absolute";
    colorSlider.style.top = "30px";
    colorSlider.style.left = "10px";
    document.body.appendChild(colorSlider);

    pauseButton = document.createElement("button");
    pauseButton.innerText = "Pause";
    pauseButton.style.position = "absolute";
    pauseButton.style.top = "60px";
    pauseButton.style.left = "10px";
    pauseButton.onclick = () => {
        isPaused = !isPaused;
        pauseButton.innerText = isPaused ? "Resume" : "Pause";
    };
    document.body.appendChild(pauseButton);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();