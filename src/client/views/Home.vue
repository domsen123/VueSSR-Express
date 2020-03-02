<template>
  <div>{{ msg }}</div>
</template>

<script>
  export default {
    name: 'Home',
    data: () => ({
      msg: 'Hello from lala !'
    }),
    mounted() {
      console.log('home')
    }
  }
</script>
