<template>
  <body style="display: flex; margin: 0"></body>
</template>

<script>
import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { FontLoader } from "three/examples/fonts/helvetiker_bold.typeface.json";
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
      pointlights: [],
      amountOfLights: 3,
      boxSize: 30,
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
      const intensity = 3;
      console.log(color);
      const light = new THREE.PointLight(color, intensity, 20);
      light.castShadow = true;
      light.shadow.bias = -0.005; // reduces self-shadowing on double-sided objects

      let geometry = new THREE.SphereGeometry(1.5, 12, 6);
      let material = new THREE.MeshBasicMaterial({ color: color });
      material.color.multiplyScalar(intensity);
      let sphere = new THREE.Mesh(geometry, material);
      light.add(sphere);

      const texture = new THREE.CanvasTexture(this.generateTexture());
      texture.magFilter = THREE.NearestFilter;
      texture.wrapT = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;
      texture.rotation = 90;
      texture.repeat.set(1, 5.5);

      geometry = new THREE.CylinderGeometry(3, 3, 32, 8);
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
      for (let i = 0; i < this.amountOfLights; i++) {
        this.pointlights.push(this.createLight(this.colourGenerator()));
      }
      this.pointlights.forEach((pointlight) => {
        this.scene.add(pointlight);
      });
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
      const geometry = new THREE.BoxGeometry(
        this.boxSize,
        this.boxSize,
        this.boxSize
      );

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
    setUpText() {
      var loader = new THREE.FontLoader();

      loader.load(
        "https://cdn.rawgit.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          var textGeo = new THREE.TextGeometry("DEAN MATHIESON", {
            font: font,

            size: 2,
            height: 1,
            curveSegments: 12,
          });

          var textMaterial = new THREE.MeshPhongMaterial({ color: 0xff00cc });

          var mesh = new THREE.Mesh(textGeo, textMaterial);
          mesh.position.set(-10, 0, 10);

          this.scene.add(mesh);
        }
      );
    },
    generateTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 16;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.font = 10 + "pt Arial";
      context.fillText("DEAN MATHIESON", 0, canvas.height / 2 + 4);
      return canvas;
    },
    render() {
      let time = performance.now() * 0.001;
      this.pointlights.forEach((pointlight) => {
        pointlight.position.x = Math.sin(time * 0.6) * 9;
        pointlight.position.y = Math.sin(time * 0.7) * 9 + 6;
        pointlight.position.z = Math.sin(time * 0.8) * 9;
        pointlight.rotation.x = time;
        pointlight.rotation.z = time;

        time += 50000;
      });
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
    colourGenerator() {
      let random = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
      if (random) return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    },
  },
  mounted() {
    this.setUpCamera();
    this.setUpLights();
    this.setUpRenderer();
    this.setUpControls();
    // this.setUpStats();
    this.setUpMesh();
    this.setUpText();
    this.setUpResizeHandler();
    this.animate();
  },
};
</script>
