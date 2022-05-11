<template>
  <!-- <nav>
    <a :href="$router.resolve({ name: 'home' }).href" class="nav-menu">Home</a>
     <a :href="$router.resolve({ name: 'sketchArea' }).href" class="nav-menu">Sketch</a>
  </nav> -->
  <router-view />
</template>

<style lang="scss">

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

  .nav-menu :active {
    color: #42b983;
  }
}
</style>
