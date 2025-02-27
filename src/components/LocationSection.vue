<template>
  <div class="location-section">
    <span>
      <h1>Latitude &times; Longitude</h1>
      <p>{{ latitude }} / {{ longitude }}</p>
    </span>
    <span>
      <h1>Adresse (approximative)</h1>
      <p>{{ address }}</p>
    </span>
  </div>
</template>

<script>
export default {
  name: 'LocationSection',
  props: {
    latitude: Number,
    longitude: Number,
    address: String
  }
};
</script>