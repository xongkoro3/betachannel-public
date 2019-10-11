<template>
  <v-layout column justify-center align-center>
    <video-player :videos="loadedVideos"></video-player>
  </v-layout>
</template>

<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#config-web-app -->

<script>
</script>

<script>
import VideoPlayer from "~/components/VideoPlayer.vue";

export default {
  components: {
    VideoPlayer
  },
  mounted() {
    if(this.$route.query.email) {
      this.$store.dispatch('verifyEmail');
    };
  },
  computed: {
    loadedVideos() {
      return this.$store.getters.loadedVideos;
    }
  }
};
</script>
