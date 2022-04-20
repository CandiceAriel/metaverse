<template>
  <div class="home">
    <div class="container" id="homeContainer">
      <div class="home_canvas_container"></div>
      <div class="home_content">
        <button class="btn_lock">Pointer Lock</button>
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
import "../css/style.css";
</script>
