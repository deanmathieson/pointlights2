<template>
  <body style="display: flex; margin: 0">
    <div class="buttonCont" style="z-index: 99999">
      <button
        :style="{
          backgroundColor: colours[1].hex,
          border: '3px solid ' + colours[2].hex,
          color: '#000',
          zIndex: '99999',
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
    <div
      class="
        modal
        invisible
        p-4
        max-w-max
        w-full
        max-w-prose
        flex flex-col
        space-y-4
      "
      ref="mainModal"
      :style="{
        backgroundColor: colours[0].rgba,
        border: '3px solid ' + colours[2].hex,
      }"
    >
      <header>
        <p class="text-4xl">
          <span>🧔🏻</span><span> Welcome to my website</span>
          <span class="inline-block">🧔🏻 </span>
        </p>
      </header>
      <section>
        <img class="max-h-48 visible md:w-4" src="~/assets/dean.jpg" />
      </section>
      <section>
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
      <section class="w-full">
        <h2 class="text-2xl text-center underline pb-4">Skills</h2>
        <div class="skills flex flex-row flex-wrap justify-center">
          <button
            class="border-2 rounded-3xl bg-black opacity-0 text-white"
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
    <div
      class="modal invisible max-w-max w-full max-w-prose p-4"
      :style="{
        backgroundColor: colours[0].rgba,
        border: '3px solid ' + colours[2].hex,
      }"
      ref="contactModal"
    >
      <div>
        <p class="text-4xl">
          <span>📧</span><span> Contact me</span>
          <span class="inline-block reversed">📧 </span>
        </p>
      </div>
      <form
        name="contactus"
        method="post"
        netlify
        netlify-honeypot="bot-field"
        class="w-full flex flex-col space-y-4"
      >
        <input type="hidden" name="form-name" value="contactus" />
        <div class="opacity-0">
          <label class="text-lg" for="name">Name:</label>
          <input class="text-black" type="text" name="name" required />
        </div>
        <div class="opacity-0">
          <label class="text-lg" for="email">Email:</label>
          <input class="text-black" type="email" name="email" required />
        </div>
        <div class="opacity-0">
          <label class="text-lg" for="message">Message:</label>
          <textarea class="text-black" name="message" required></textarea>
        </div>
        <button
          :style="{
            backgroundColor: colours[1].hex,
            border: '3px solid ' + colours[2].hex,
            color: '#000',
          }"
          ref="sendBtn"
          type="submit"
          value="Send message"
          @mouseenter="sendEnter"
          @mouseleave="sendLeave"
        >
          Send
        </button>
      </form>
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
      mainColor: "#1de9b6",
      secondaryColor: "#ffc107",
      colours: [
        { hex: "#1de9b6", rgba: "RGBA(29,233,182,0.7)" },
        { hex: "#ffc107", rgba: "RGBA(255,193,7,.7)" },
        { hex: "#e91e63", rgba: "RGBA(233,30,99,1)" },
      ],
      buttons: [{ name: "Info" }, { name: "Contact" }],
      skills: [
        { name: "javascript" },
        { name: "html5" },
        { name: "css" },
        { name: "nuxt" },
        { name: "flutter" },
        { name: "vue" },
        { name: "three.js" },
        { name: "gsap" },
      ],
      tl: [],
      zIndex: 20,
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
      texture.flipX = false;
      texture.flipY = false;
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
        this.pointlights.push(this.createLight(this.colours[i].hex));
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
        "https://cdn.skypack.dev/three/examples/fonts/helvetiker_bold.typeface.json",
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
      context.font = 10 + "pt Roboto";
      context.fillText("DEAN MATHIESON", 0, canvas.height / 2 + 4);
      return canvas;
    },
    render() {
      let time = performance.now() * 0.001;
      this.pointlights.forEach((pointlight) => {
        pointlight.position.x = Math.sin(time * 0.6) * (9 * this.ratio);
        pointlight.position.y = Math.sin(time * 0.7) * 9 + 10;
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
        backgroundColor: this.colours[2].hex,
        borderColor: this.colours[1].hex,
        duration: 0.8,
      });
    },
    buttonExitAnimation(i) {
      gsap.to(this.$refs.buttons[i], {
        backgroundColor: this.colours[1].hex,
        borderColor: this.colours[2].hex,
        duration: 0.8,
      });
    },
    buttonClick(i) {
      let modals = [this.$refs.mainModal, this.$refs.contactModal];
      this.zIndex++;
      modals[i].style.zIndex = this.zIndex;
      //showing modal
      this.tl.forEach((tl) => {
        if (tl._time > 0) {
          if (this.tl[i] === tl) {
            tl.duration(2);
            if (tl.animating) {
              tl.pause();
              tl.play();
            } else {
              tl.reverse();
              tl.animating = true;
            }
          } else {
            tl.duration(0.5);
            tl.reverse();
            tl.animating = true;
          }
        }
      });
      if (this.tl[i]._time === 0) this.tl[i].play();
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
    setUpModalAnimations() {
      let modals = [this.$refs.mainModal, this.$refs.contactModal];
      for (let i = 0; i < this.$refs.buttons.length; i++) {
        let buttonLocation = this.$refs.buttons[i].getBoundingClientRect();
        this.tl[i] = gsap.timeline();
        this.tl[i].fromTo(
          modals[i],
          {
            top: buttonLocation.top,
            left: buttonLocation.left,
            zIndex: this.zIndex,
          },
          {
            visibility: "visible",
            top: "50%",
            left: "50%",
          }
        );
        modals[i].children.forEach((item) => {
          item.children.forEach((child) => {
            this.tl[i].fromTo(
              child,
              {
                x: 50,
                y: 5,
                opacity: 0,
              },
              {
                y: 0,
                x: 0,
                opacity: 1,
                onComplete: () => {
                  this.tl[i].animating = false;
                },
              }
            );
            if (child.children.length > 0) {
              child.children.forEach((child) => {
                this.tl[i].fromTo(
                  child,
                  {
                    x: 50,
                    y: 5,
                    opacity: 0,
                  },
                  {
                    y: 0,
                    x: 0,
                    opacity: 1,
                    onComplete: () => {
                      this.tl[i].animating = false;
                    },
                  }
                );
              });
            }
          });
        });
        this.tl[i].modal = modals[i];
        this.tl[i].duration(2);
        this.tl[i].pause();
      }
    },
    sendEnter() {
      gsap.to(this.$refs.sendBtn, {
        backgroundColor: this.colours[2].hex,
        borderColor: this.colours[1].hex,
        duration: 0.8,
      });
    },
    sendLeave() {
      gsap.to(this.$refs.sendBtn, {
        backgroundColor: this.colours[1].hex,
        borderColor: this.colours[2].hex,
        duration: 0.8,
      });
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
    this.setUpModalAnimations();
    this.animate();
  },
};
</script>
<style>
* {
  font-family: "Roboto", sans;
}
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
  flex-wrap: wrap;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  flex-direction: column;
  font-weight: bold;
  border-radius: 10px;
}
.modal > * > * {
  opacity: 0;
}
form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
form label {
  width: 40%;
}
form input,
form textarea {
  width: 60%;
  padding: 5px;
}
form div {
  display: flex;
  justify-content: space-around;
}
.reversed {
  -moz-transform: scale(-1, 1);
  -webkit-transform: scale(-1, 1);
  -o-transform: scale(-1, 1);
  -ms-transform: scale(-1, 1);
  transform: scale(-1, 1);
}
button {
  font-weight: bold;
}
header {
  text-align: center;
}
</style>