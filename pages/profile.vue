<template>
<v-container class="grey lighten-5">
  <v-row class="pa-md-8 mx-lg-auto" align="center">
    <v-form
      ref="form"
    >
      <v-text-field
        v-model="text"
        label="Text"
        required
      ></v-text-field>

      <v-text-field
        v-model="link"
        label="Link"
        required
      ></v-text-field>

      <v-select
        v-model="color"
        :items="colors"
        :rules="[v => !!v || 'Item is required']"
        label="Color"
        required
      ></v-select>

      <v-btn
        color="success"
        class="mr-4"
        @click="save"
      >
        Save Changes
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click="reset"
      >
        Reset Form
      </v-btn>

    </v-form>
  </v-row>
</v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "profile",
  middleware: ["auth"],
  data: function() {
    return {
        text: "",
        link: "",
        color: "",
        colors: ["red", "green"]
    }
  },
  methods: {
      save() {
        this.$store
          .dispatch("updateButton", {
            uid: this.user.uid,
            text: this.text,
            link: this.link,
            color: this.color
          })
          .then(() => {
            // this.$router.push("/upload");
          });
      },
      reset() {

      }
  },
  computed: {
    ...mapGetters({
        user: "getCurrentUser"
    })
  }
}
</script>