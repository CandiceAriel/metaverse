<template>
  <div class="home">
    <div class="container" id="homeContainer">
      <div class="canvas"></div>
      <div class="home_content">
        <button class="btn_lock">Pointer Lock</button>
        <!-- INSTRUCTION CARD -->
        <div class="desktop-help" id="desktopInstruction">
          <div class="desktop-help-header">
            <img id="iconClose" class="icon-close" src = "../assets/Icons/close.png" alt="keys"/>
            <div>
              <h2><strong>INSTRUCTION</strong></h2>
            </div>
          </div>
          <div class="desktop-help-content">
            <img class="icon-keys" src = "../assets/Icons/buttons.png" alt="keys"/>
            <p> <strong>W</strong> : move forward </p>
            <p> <strong>S</strong> : move backward </p>
            <p> <strong>A</strong> : rotate left </p>
            <p> <strong>D</strong> : rotate right </p>
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
