<template>
  <div class="home">
    <div class="container" id="homeContainer">
      <div class="canvas"></div>
      <div class="home_content">
        <button class="btn_lock">Pointer Lock</button>
        <div class="desktop-help" id="desktopInstruction">
          <div class="desktop-help__header">
            <h2>Instruction</h2>
            <img id="iconClose" class="icon__close" src = "../assets/Icons/close.png" alt="keys"/>
          </div>
          <img class="icon__keys" src = "../assets/Icons/buttons.png" alt="keys"/>
          <div>
            <p> W : move forward </p>
            <p> S : move backward </p>
            <p> A : rotate left </p>
            <p> D : rotate right </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "HomeView",
  components: {},
};

import "../js/Home.js";
import "../scss/style.scss";
</script>
