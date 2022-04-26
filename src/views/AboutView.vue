<template>
  <div class="about">
    <div class="container" id="aboutContainer">
      <div class="about_canvas_container"></div>
      <div class="about_content">
        <h1>Hello</h1>
      </div>
    </div>
  </div>
</template>

<script type="module">
// @ is an alias to /src
export default {
  name: "AboutView",
  components: {},
};

import "../js/About.js";
import "../../public/js/obj.js";
import "../scss/style.scss";
</script>
