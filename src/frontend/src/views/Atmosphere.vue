<template>
  <div class="atmosphere-page container section">
    <h1 class="text-center">{{ $t("nav.atmosphere") }}</h1>
    <div class="content glass-panel p-4 mt-4">
      <p>
        Welcome to Siwar Huset, where traditional Arabian oriental aesthetics meet modern comfort.
      </p>
      <p>
        Our shop offers a small, cozy seating area perfectly designed for you to order your favorite coffee or tea, paired with our authentic traditional desserts. 
        Whether you are shopping for imported nuts and spices, or just want a relaxing break with a freshly baked manakeesh, our atmosphere will make you feel right at home.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Atmosphere'
}
</script>

<style scoped>
.content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  font-size: 1.125rem;
  line-height: 1.8;
}
</style>
