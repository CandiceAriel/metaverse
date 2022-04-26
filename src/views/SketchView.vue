<template>
  <div class="sketch">
    <div class="container" id="sketchContainer">
      <div class="sketch_canvas_container"></div>
      <div class="sketch_content">
        <button class="sketch_btn_lock">Pointer Lock</button>
        <!-- <div class="desktop-help_sketch" id="desktopInstruction">
          <div class="desktop-help_sketch__header">
            <h2> Instruction </h2>
            <img id="iconClose" class="icon__close" src = "../assets/Icons/close.png" alt="keys"/>
          </div>
          <img class="icon__keys" src = "../assets/Icons/buttons.png" alt="keys"/>
          <div>
            <p> W : move forward </p>
            <p> S : move backward </p>
            <p> A : rotate left </p>
            <p> D : rotate right </p>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "SketchView",
  components: {},
};

import "../js/SketchPlaceArea.js";
import "../scss/style.scss";
</script>
