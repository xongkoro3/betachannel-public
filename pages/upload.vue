<template>
  <v-layout>
    <v-flex text-xs-center>
      <div v-if="isSaving">
        <h2>Upload progress: {{progress.toFixed(2)}}%</h2>
      </div>
      <!--SUCCESS-->
      <div v-else-if="isSuccess">
        <!-- <h2>Uploaded {{ uploadedFiles.length }} video successfully.</h2> -->
        <h2>Uploaded video successfully.</h2>
        <p>
          <a href="javascript:void(0)" @click="goHome()">Home Page</a>
        </p>
        <p>
          <a href="javascript:void(0)" @click="reset()">Upload again</a>
        </p>
        <ul class="list-unstyled">
          <li v-for="item in uploadedFiles" :key="item.id">
            <img :src="item.url" class="img-responsive img-thumbnail" :alt="item.originalName" />
          </li>
        </ul>
      </div>
      <!--FAILED-->
      <div v-else-if="isFailed">
        <h2>Upload failed.</h2>
        <p>
          <a href="javascript:void(0)" @click="goHome()">Home Page</a>
        </p>
        <p>
          <a href="javascript:void(0)" @click="reset()">Try again</a>
        </p>
        <pre>{{ uploadError }}</pre>
      </div>
      <form enctype="multipart/form-data" novalidate v-else>
        <div class="dropbox">
          <input
            type="file"
            :name="uploadFieldName"
            :disabled="isSaving"
            @change="save($event.target.files[0])"
            accept="image/*|video/*"
            class="input-file"
          />
          <p>
            Drag your file(s) here to begin
            <br />or click to browse
          </p>
        </div>
      </form>
    </v-flex>
  </v-layout>
</template>

<style lang="scss">
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>

<!-- Javascript -->
<script>
import { mapGetters } from "vuex";
import firebase from "~/plugins/firebase";

export default {
  middleware: ["check-auth", "auth"],
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos"
    };
  },
  computed: {
    ...mapGetters({
      progress: "upload/uploadProgress",
      state: "upload/uploadState"
    }),
    isSaving() {
      return this.state === firebase.storage.TaskState.RUNNING;
    },
    isSuccess() {
      return this.state === firebase.storage.TaskState.SUCCESS;
    },
    isFailed() {
      return this.state === firebase.storage.TaskState.ERROR;
    }
  },
  methods: {
    reset() {
      this.$router.push("/upload");
      window.location.reload(true);
    },
    gohome() {
      this.$router.push("/");
    },
    save(file, metadata) {
      this.$store.dispatch("upload/uploadVideo", {
        channelId: "test",
        file,
        metadata
      });
    }
  }
};
</script>
