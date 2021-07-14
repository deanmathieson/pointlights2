<template>
  <body style="display: flex; margin: 0">
    <div class="buttonCont z-20">
      <button
        :style="{
          backgroundColor: secondaryColor,
          border: '3px solid ' + mainColor,
          color: mainColor,
        }"
        v-for="(button, i) in buttons"
        :key="i"
        @mouseenter="buttonEntryAnimation(i)"
        @mouseleave="buttonExitAnimation(i)"
        @click="buttonClick(i)"
        ref="buttons"
      >
        {{ button.name }}
      </button>
    </div>
    <div class="modal z-10 invisible p-10 m-10" ref="mainModal">
      <header>
        <p class="text-4xl">
          🚀 Welcome to my website
          <span
            style="
              -moz-transform: scale(-1, 1);
              -webkit-transform: scale(-1, 1);
              -o-transform: scale(-1, 1);
              -ms-transform: scale(-1, 1);
              transform: scale(-1, 1);
            "
            class="inline-block"
            >🚀
          </span>
        </p>
      </header>

      <section class="m-4 pt-8">
        <h2 class="text-2xl">Manifesto</h2>
        <p>I am a Front-End Developer with a passion for my trade.</p>
        <p>
          I am a practical, creative thinker who follows the motto "work
          smarter".
        </p>
        <p>
          I am an innovative and enthusiastic developer who enjoys engaging and
          encouraging colleagues to maximise potential.
        </p>
      </section>
      <section class="p-4 w-full">
        <h2 class="text-2xl">Skills</h2>
        <div class="skills flex flex-row">
          <button
            class="border-2 rounded-3xl bg-black"
            v-for="(skill, i) in skills"
            :key="i"
            ref="skillsBtn"
            @mouseenter="skillsAnimation(i)"
          >
            <span
              class="letter"
              :class="'letter' + i"
              v-for="(letter, i) in skill.name"
              :key="i"
              ref="letters"
              >{{ letter }}</span
            >
          </button>
        </div>
      </section>
    </div>
    <div class="modal z-10 invisible p-10 m-10" ref="contactModal">
      <header>
        <p class="text-4xl">CONTACT ME</p>
      </header>
    </div>
  </body>
</template>

<script>
import * as THREE from "three";
import gsap from "gsap";

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
      pointlights: [],
      amountOfLights: 3,
      boxSize: 30,
      ratio: window.innerWidth / window.innerHeight,
      mainColor: "#000",
      secondaryColor: "#fff",
      buttons: [{ name: "Info" }, { name: "Contact" }],
      skills: [
        { name: "javascript" },
        { name: "html5" },
        { name: "css" },
        { name: "nuxt" },
        { name: "flutter" },
        { name: "vue" },
      ],
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
      texture.rotation = 180;
      texture.repeat.set(1, 5.5);

      geometry = new THREE.SphereGeometry(3, 32, 8);
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
        (this.boxSize * window.innerWidth) / window.innerHeight,
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
        "https://cdn.rawgit.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json",
        (font) => {
          var textGeo = new THREE.TextGeometry("DEAN  MATHIESON", {
            font: font,
            size: 0.8 * this.ratio,
            height: 0.1,
          });

          var textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
          var mesh = new THREE.Mesh(textGeo, textMaterial);
          mesh.name = "textmesh";

          let x = -(1 * this.ratio),
            y = 5,
            z = 15;

          mesh.position.set(x, y, z);

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
        pointlight.position.x = Math.sin(time * 0.6) * (9 * this.ratio);
        pointlight.position.y = Math.sin(time * 0.7) * (9 / this.ratio) + 10;
        pointlight.position.z = Math.sin(time * 0.8) * 9;
        pointlight.rotation.x = time;
        pointlight.rotation.z = time;
        let textmesh = this.scene.getObjectByName("textmesh");
        if (textmesh) {
          let rotation = this.camera.rotation;
          textmesh.rotation.x = rotation._x;
          textmesh.rotation.y = rotation._y;
          textmesh.rotation.z = rotation._z;
        }
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
      let random = "";
      while (random.length !== 7) {
        random = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
      }
      return random;
    },
    buttonEntryAnimation(i) {
      gsap.to(this.$refs.buttons[i], {
        backgroundColor: this.mainColor,
        borderColor: this.secondaryColor,
        color: this.secondaryColor,
        duration: 0.8,
      });
    },
    buttonExitAnimation(i) {
      gsap.to(this.$refs.buttons[i], {
        backgroundColor: this.secondaryColor,
        borderColor: this.mainColor,
        color: this.mainColor,
        duration: 0.8,
      });
    },
    buttonClick(i) {
      let buttonLocation = this.$refs.buttons[i].getBoundingClientRect();
      let modal = i === 0 ? this.$refs.mainModal : this.$refs.contactModal;
      let visible = modal.showing ? "hidden" : "visible";
      let modals = [this.$refs.mainModal, this.$refs.contactModal];
      if (!modal.showing)
        gsap.fromTo(
          modal,
          {
            top: buttonLocation.top,
            left: buttonLocation.left,
          },
          {
            visibility: visible,
            top: "50%",
            left: "50%",
            opacity: 1,
          }
        );
      else {
        gsap.fromTo(
          modal,
          { top: "50%", left: "50%" },
          {
            top: buttonLocation.top,
            left: buttonLocation.left,
            opacity: 0,
          }
        );
      }
      //modal tidy up
      modals.forEach((mod) => {
        if (mod.showing && mod !== modal) {
          gsap.fromTo(
            mod,
            { top: "50%", left: "50%" },
            {
              top: buttonLocation.top,
              left: buttonLocation.left,
              opacity: 0,
            }
          );
          mod.showing = !mod.showing;
        }
      });
      modal.showing = !modal.showing;
    },
    skillsAnimation(i) {
      let delay = 0.2;
      this.$refs.skillsBtn[i].children.forEach((letter) => {
        if (!letter.animating) {
          gsap.fromTo(
            letter,
            { color: "#fff" },
            {
              color: this.colourGenerator(),
              delay: delay,
              yoyo: true,
              duration: 1,
              repeat: 1,
              onStart: () => (letter.animating = true),
              onComplete: () => (letter.animating = false),
            }
          );
          delay = delay + 0.2;
        }
      });
      if (!this.$refs.skillsBtn[i].animating) {
        gsap.fromTo(
          this.$refs.skillsBtn[i],
          {
            borderColor: "#fff",
          },
          {
            borderColor: this.colourGenerator(),
            yoyo: true,
            duration: 2,
            repeat: 1,
            onStart: () => (this.$refs.skillsBtn[i].animating = true),
            onComplete: () => (this.$refs.skillsBtn[i].animating = false),
          }
        );
      }
    },
  },

  mounted() {
    this.setUpCamera();
    this.setUpLights();
    this.setUpRenderer();
    this.setUpControls();
    this.setUpStats();
    this.setUpMesh();
    this.setUpText();
    this.setUpResizeHandler();
    this.animate();
  },
};
</script>
<style scoped>
.buttonCont {
  position: absolute;
  top: 0;
  right: 0;
}
button {
  border-radius: 3px;
  font-size: large;
  padding: 5px 10px;
  margin: 10px;
  text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.59);
}
.modal {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  max-width: 600px;
  max-height: 600px;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-direction: column;
}
</style>