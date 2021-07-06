<template>
  <body style="display: flex; margin: 0"></body>
</template>

<script>
import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default {
  data() {
    return {
      camera: "",
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      stats: new Stats(),
      controls: "",
      pointlight: "",
      pointlight2: "",
    };
  },
  methods: {
    setUpCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(0, 10, 40);
      this.scene.add(new THREE.AmbientLight(0x111122));
    },
    setUpRenderer() {
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
      document.body.appendChild(this.renderer.domElement);
    },
    createLight(color) {
      const intensity = 1.5;

      const light = new THREE.PointLight(color, intensity, 20);
      light.castShadow = true;
      light.shadow.bias = -0.005; // reduces self-shadowing on double-sided objects

      let geometry = new THREE.SphereGeometry(0.3, 12, 6);
      let material = new THREE.MeshBasicMaterial({ color: color });
      material.color.multiplyScalar(intensity);
      let sphere = new THREE.Mesh(geometry, material);
      light.add(sphere);

      const texture = new THREE.CanvasTexture(this.generateTexture());
      texture.magFilter = THREE.NearestFilter;
      texture.wrapT = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.set(1, 4.5);

      geometry = new THREE.SphereGeometry(2, 32, 8);
      material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        alphaMap: texture,
        alphaTest: 0.5,
      });

      sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      light.add(sphere);

      // custom distance material
      const distanceMaterial = new THREE.MeshDistanceMaterial({
        alphaMap: material.alphaMap,
        alphaTest: material.alphaTest,
      });
      sphere.customDistanceMaterial = distanceMaterial;

      return light;
    },
    setUpLights() {
      this.pointlight = this.createLight(0x0088ff);
      this.pointlight2 = this.createLight(0xff8888);
      this.scene.add(this.pointlight, this.pointlight2);
    },
    setUpControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target.set(0, 10, 0);
      this.controls.update();
    },
    setUpStats() {
      document.body.appendChild(this.stats.dom);
    },
    setUpMesh() {
      const geometry = new THREE.BoxGeometry(30, 30, 30);

      const material = new THREE.MeshPhongMaterial({
        color: 0xa0adaf,
        shininess: 10,
        specular: 0x111111,
        side: THREE.BackSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 10;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    },
    generateTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 2;
      canvas.height = 2;

      const context = canvas.getContext("2d");
      context.fillStyle = "white";
      context.fillRect(0, 1, 2, 1);

      return canvas;
    },
    render() {
      let time = performance.now() * 0.001;

      this.pointlight.position.x = Math.sin(time * 0.6) * 9;
      this.pointlight.position.y = Math.sin(time * 0.7) * 9 + 6;
      this.pointlight.position.z = Math.sin(time * 0.8) * 9;

      this.pointlight.rotation.x = time;
      this.pointlight.rotation.z = time;

      time += 10000;

      this.pointlight2.position.x = Math.sin(time * 0.6) * 9;
      this.pointlight2.position.y = Math.sin(time * 0.7) * 9 + 6;
      this.pointlight2.position.z = Math.sin(time * 0.8) * 9;

      this.pointlight2.rotation.x = time;
      this.pointlight2.rotation.z = time;

      this.renderer.render(this.scene, this.camera);

      this.stats.update();
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    setUpResizeHandler() {
      window.addEventListener("resize", this.onWindowResize);
    },
  },
  mounted() {
    this.setUpCamera();
    this.setUpLights();
    this.setUpRenderer();
    this.setUpControls();
    this.setUpStats();
    this.setUpMesh();
    this.setUpResizeHandler();
    this.animate();
  },
};
</script>
