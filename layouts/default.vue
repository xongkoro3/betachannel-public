<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-tile v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <img height="30" width="30" src="../assets/bc.png" />
      <v-spacer />
      <span v-if='user'>Hello, {{ user.displayName || ''}}</span>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>person_outline</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid ma-0 pa-0>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-tile v-if="!user" @click="onSignin">
          <v-list-tile-action>
            <v-icon light>subject</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Sign In</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-else @click="onLogout">
          <v-list-tile-action>
            <v-icon light>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-title> Sign Out</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app absolute>
      <v-layout class="flex justify-center grow">
      <span>&copy; BetaChannel 2019</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "apps",
          title: "Welcome",
          to: "/"
        },
        {
          icon: "bubble_chart",
          title: "Upload",
          to: "/upload"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "bc"
    };
  },
  computed: {
    ...mapGetters({
        user: "getCurrentUser"
    })
  },
  methods: {
    onSignin() {
      this.$router.push("/admin/auth");
    },
    onLogout() {
      this.user = null;
      this.$store.dispatch("logout");
      this.$router.push("/admin/auth");
      window.location.reload(true);
    }
  }
};
</script>