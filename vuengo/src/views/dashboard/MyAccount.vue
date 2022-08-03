<template>
    <div class="container">
        <div class="columns is-multiline">
            <div class="column is-12">
                <div class="box">
                    <h1 class="title">My Account</h1>
                    <div class="field">
                        <label class="label">Account-Info:</label>
                        <p><b>E-Mail: </b>{{  this.$store.state.user.username }}</p>
                        <p><b>UserId: </b>{{  this.$store.state.user.id }}</p>
                    </div>
                </div>    
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'MyAccount',
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
            localStorage.removeToken('token')
            this.$store.commit('removeToken')

            this.$router.push('/')
            this.$forceUpdate()
        }
    }
}
</script>
