<template>
  <div class="admin-auth-page">
    <div class="auth-container">
      <form @submit.prevent="onSubmit">
        <AppControlInput v-if="isLogin == false" v-model="url">Website URL</AppControlInput>
        <AppControlInput v-if="isLogin == false" v-model="org">Organization</AppControlInput>
        <div v-if="isLogin == false">
          <AppControlInput type="email" name="email" v-bind:login="isLogin" v-model="email">E-Mail Address</AppControlInput>
          <span style="display: inline-block">{{url|trimDomainName}}</span>
        </div>
        <div v-else>
          <AppControlInput type="email" name="email" v-bind:login="isLogin" v-model="email">E-Mail Address</AppControlInput>
        </div>
        <AppControlInput type="password" v-model="password">Password</AppControlInput>
        <AppButton type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</AppButton>
        <AppButton
          type="button"
          btn-style="inverted"
          style="margin-left: 10px"
          @click="isLogin = !isLogin"
        >Switch to {{ isLogin ? 'Signup' : 'Login' }}</AppButton>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminAuthPage",
  layout: "admin",
  data() {
    return {
      isLogin: true,
      email: "",
      password: "",
      url: "",
      org: ""
    };
  },
  filters: {
    trimDomainName: function(val) {
      val = val.replace("www.", "@");
      return val;
    }
  },
  methods: {
    onSubmit() {
      if (this.isLogin) {
        this.$store
          .dispatch("signinUser", {
            isLogin: this.isLogin,
            email: this.email,
            password: this.password
          })
          .then(() => {
            this.$router.push("/upload");
          });
      } else {
        this.$store
          .dispatch("emailUser", {
            email: this.email + this.$options.filters.trimDomainName(this.url),
            password: this.password
          })
          .then(() => {
            this.$router.push("/upload");
          });
      }
    }
  }
};
</script>

<style scoped>
.admin-auth-page {
  padding: 20px;
}

.auth-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 2px #ccc;
  width: 300px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>
