import Stage from "./modules/stage.js";
import Model from "./modules/mesh.js";

let stage, mesh;

function rendering() {
  return new Promise((resolve) => {
    stage = new Stage();
    mesh = new Model(stage);

    const loop = () => {
      requestAnimationFrame(loop);
      stage.onLoop();
      mesh.onUpdata();
    };
    const resize = () => {
      stage.onResize();
    };

    const initStage = stage._init();
    const initMesh = mesh._init();
    const initLoop = loop();

    Promise.all([initStage, initMesh, initLoop])
      .then(() => {
        window.addEventListener("resize", resize);
        setTimeout(() => {
          resolve();
        }, 500);
      })
      .catch((error) => {
        console.error("An error occurred during initialization:", error);
      });
  });
}

function loading() {
  return new Promise((resolve) => {
    const load = document.querySelector(".c-loading");
    load.classList.add("is-hide");
    resolve();
  });
}

async function init() {
  await rendering();
  await loading();
}

window.addEventListener("DOMContentLoaded", init);

export {};
