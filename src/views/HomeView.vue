<template>
  <div class="home">
    <div class="container" id="homeContainer">
      <div class="home_canvas_container"></div>
      <div class="home_content">
        <button class="btn_lock">Pointer Lock</button>
        <div class="desktop-help" id="desktopInstruction">
          <div class="desktop-help__header">
            <img id="iconClose" class="icon__close" src = "../assets/Icons/close.png" alt="keys"/>
          </div>
          <img class="icon__keys" src = "../assets/Icons/buttons.png" alt="keys"/>
          <div>
            <p> W : move forward </p>
            <p> S : move backward </p>
            <p> A : move left </p>
            <p> D : move right </p>
            <p> Q : rotate left </p>
            <p> E : rotate right </p>
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
import "../css/style.scss";
</script>
