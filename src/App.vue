<template>
  <nav>
    <a :href="$router.resolve({ name: 'home' }).href" class="nav-menu">Home</a>
    <a :href="$router.resolve({ name: 'about' }).href" class="nav-menu"
      >About</a
    >
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

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

body{
  margin: 0; 
  height: 100vh;
}
</style>
