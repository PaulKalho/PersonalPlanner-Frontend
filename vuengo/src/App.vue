<template>
  <div>
    <Navbar />
    <router-view/>
  </div>
</template>

<script>
  import Navbar from '@/components/layout/Navbar'
  import axios from 'axios'
  
  export default {
    name: 'App',
    components: {
      Navbar
    },
    beforeCreate() {
      this.$store.commit('initializeStore')

      console.log("user: " + this.$store.state.user)
    
      if(this.$store.state.token) {
        axios.defaults.headers.common['Authorization'] = "Token " + this.$store.state.token
      }else{
        axios.defaults.headers.common['Authorization'] = ""
      }
    }
  }
</script>

<style lang="scss">
@import '../node_modules/bulma';
</style>
