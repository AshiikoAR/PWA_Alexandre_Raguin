<template>
  <div id="app">
    <MainComponent/>
  </div>
</template>

<script>
import MainComponent from './components/MainComponent.vue';
import './assets/styles.css';

export default {
  name: 'App',
  components: {
    MainComponent
  }
};
</script>