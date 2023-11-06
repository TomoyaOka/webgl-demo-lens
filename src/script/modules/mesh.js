import { PlaneGeometry, MeshNormalMaterial, MeshBasicMaterial, BoxGeometry, Mesh, SphereGeometry, TextureLoader, ShaderMaterial, DoubleSide, WebGLCubeRenderTarget, RGBAFormat, LinearMipMapLinearFilter, sRGBEncoding, CubeCamera } from "three";
import vertexShader from "../shader/vertex.glsl?raw";
import fragmentShader from "../shader/fragment.glsl?raw";

import vertexShader1 from "../shader/vertex1.glsl?raw";
import fragmentShader1 from "../shader/fragment1.glsl?raw";
import * as THREE from "three";

import { gsap, Power4 } from "gsap";

export default class Model {
  constructor(stage) {
    this.stage = stage;
    this.geometry;
    this.material;
    this.mesh;

    this.savePattern01 = [];
    this.savePattern02 = [];
    this.savePattern03 = [];

    this.group = [];
    this.OBJ = new THREE.Group();

    this.loader = new TextureLoader();
  }

  _init() {
    // this.createLens();
    this._objects();
    this.createField();

    this.animation();
  }

  createLens() {
    this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipMapLinearFilter,
      encoding: THREE.sRGBEncoding,
    });

    this.cubeCamera = new CubeCamera(0.1, 10, this.cubeRenderTarget);

    this.geometry = new BoxGeometry(0.2, 0.2, 0.2);
    this.material = new ShaderMaterial({
      extensions: {
        derivatives: `#extension
        GL_OES_standard_derivatives : enable`,
      },
      uniforms: {
        tCube: {
          value: 0.0,
        },
      },
      side: DoubleSide,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    const mesh = new Mesh(this.geometry, this.material);
    return mesh;
    // this.stage.scene.add(this.mesh);
  }

  _objects() {
    const length = 10;
    const gap = 0.3;

    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        for (let k = 0; k < length; k++) {
          let mesh = this.createLens();

          //default
          mesh.position.x = (i - 5) * gap;
          mesh.position.y = (j - 5) * gap;
          mesh.position.z = (k - 5) * gap;

          if (i > 2 && i < 7 && j > 2 && j < 7) {
            mesh.visible = false;
          }
          if (k > 2 && k < 7 && i > 2 && i < 7) {
            mesh.visible = false;
          }
          if (k > 2 && k < 7 && j > 2 && j < 7) {
            mesh.visible = false;
          }

          //save
          this.savePattern01.push({
            x: (i - 5) * gap,
            y: (j - 5) * gap,
            z: (k - 5) * gap,
          });
          this.savePattern02.push({
            x: (i - 5) * (gap - 0.1),
            y: (j - 5) * (gap - 0.1),
            z: (k - 5) * (gap - 0.1),
          });
          this.savePattern03.push({
            x: (i - 5) * (gap + 0.8),
            y: (j - 5) * (gap + 0.8),
            z: (k - 5) * (gap + 0.8),
          });

          this.group.push(mesh);
          this.OBJ.add(mesh);
        }
      }
    }
    this.stage.scene.add(this.OBJ);
  }

  createField() {
    const texture = this.loader.load("./background.jpg");

    this.planeGeometry = new SphereGeometry(10, 32, 32);
    this.planeMaterial = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true });
    this.plane = new Mesh(this.planeGeometry, this.planeMaterial);
    this.stage.scene.add(this.plane);
  }

  onUpdata() {
    this.cubeCamera.update(this.stage.renderer, this.stage.scene);
    this.group.forEach((obj) => {
      obj.material.uniforms.tCube.value = this.cubeRenderTarget.texture;
    });

    this.OBJ.rotation.x += 0.001;
    this.OBJ.rotation.y += 0.001;
  }

  animation() {
    const p1 = document.querySelector(".js-pattern01");
    const p2 = document.querySelector(".js-pattern02");
    const p3 = document.querySelector(".js-pattern03");

    p1.addEventListener("click", () => {
      p1.classList.add("is-active");
      p2.classList.remove("is-active");
      p3.classList.remove("is-active");
      this.group.forEach((obj, index) => {
        gsap.to(obj.position, {
          x: this.savePattern01[index].x,
          y: this.savePattern01[index].y,
          z: this.savePattern01[index].z,
          ease: Power4.easeOut,
          duration: 3,
        });
      });
    });

    p2.addEventListener("click", () => {
      p1.classList.remove("is-active");
      p3.classList.remove("is-active");
      p2.classList.add("is-active");
      this.group.forEach((obj, index) => {
        gsap.to(obj.position, {
          x: this.savePattern02[index].x,
          y: this.savePattern02[index].y,
          z: this.savePattern02[index].z,
          ease: Power4.easeOut,
          duration: 3,
        });
      });
    });

    p3.addEventListener("click", () => {
      p1.classList.remove("is-active");
      p2.classList.remove("is-active");
      p3.classList.add("is-active");
      this.group.forEach((obj, index) => {
        gsap.to(obj.position, {
          x: this.savePattern03[index].x,
          y: this.savePattern03[index].y,
          z: this.savePattern03[index].z,
          ease: Power4.easeOut,
          duration: 3,
        });
      });
    });
  }
}
