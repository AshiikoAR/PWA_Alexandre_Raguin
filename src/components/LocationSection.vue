<template>
  <div class="location-section">
    <p>Latitude &times; Longitude : {{ latitude }} / {{ longitude }}</p>
    <p>Adresse : {{ address }}</p>
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