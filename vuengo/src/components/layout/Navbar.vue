<template>
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <router-link to="/" class="navbar-item">
                <strong>Home</strong>
            </router-link>
            <a @click="isActive = !isActive"  :class="{ 'is-active' : isActive }" role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div id="collapse" :class="{ 'is-active' : isActive}" class="navbar-menu">
            <div class="navbar-end" >
                <div class="navbar-item" v-if="this.$store.state.isAuthenticated">
                    <router-link to="/app">App</router-link>
                </div>
                <div class="navbar-item" >
                    <div class="buttons" v-if="!this.$store.state.isAuthenticated">
                        <router-link to="/sign-up" class="button is-success"><strong>SignUp</strong></router-link>
                        <router-link to="/log-in" class="button is-light">Log In</router-link>
                    </div>
                    <div class="buttons" v-else>
                        <router-link to="/dashboard/my-account" class="button is-light"><strong>My Account</strong></router-link>
                        <button @click="logout()" class="button is-danger">Log Out</button>
                    </div>
                </div>
                
            </div>
        </div>
    </nav>
</template>

<script>

import axios from 'axios'

export default {
    name: 'Navbar',
    data() {
        return {
            isActive: false,
            showNavbar: true,
        }
    },
    methods: {
        async logout() {
            await axios
                .post("/api/v1/token/logout/")
                .then(response => {
                    console.log("Logged out")
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })

            axios.defaults.headers.common['Authorization'] = ''
            localStorage.removeItem('token')
            this.$store.commit('removeToken')

            this.$router.push('/')
        }
    }
}

</script>

<style lang="scss">

</style>