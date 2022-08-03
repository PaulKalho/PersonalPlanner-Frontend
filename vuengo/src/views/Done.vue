<template>
    <div class="container">
    <router-link to="../app">Back</router-link>

    <h2 class="subtitle">Done</h2>

                <div class="todo">
                    <transition-group name="list" mode="out-in" tag="card">
                        <div v-for="task in tasks" v-bind:key="task.id">
                            <div class="card">
                                <div class="card-content">{{task.description}}</div>
                                <footer class="card-footer">
                                    <a class="card-footer-item" @click="setStatus(task.id, 'todo')">To-Do</a>
                                    <a class="card-footer-item red" @click="deleteTask(task.id)">Delete</a>
                                </footer>
                            </div>
                        </div>
                    </transition-group>
                </div>
    </div>
</template>
<script>
import axios from 'axios'


export default {
    name: 'Done',

    data() {
        return{
            tasks: [],
            description: '',
            status: 'Done'
        }
    },
    mounted() {
        this.getTasks()
    },
    methods: {
        async getTasks() {
            await axios
              .get('api/v1/tasks')
              .then(response => {
                this.tasks = response.data.filter((task) => {
                  return(task.status === 'done')
                })
              })
        },

        setStatus(task_id, status) {
      
          const task = this.tasks.filter(task => task.id === task_id)[0]
          const description = task.description

          const data = {
            status: status,
            description: description
          }

          axios
            .put('api/v1/tasks/' + task_id + '/' , data)
            .then( () => {
              task.status = status
              this.tasks = this.tasks.filter(task => task.status == 'done')

            })

    },
    deleteTask(task_id) {
      const task = this.tasks.filter(task => task.id === task_id)[0]
      
      axios
        .delete('api/v1/tasks/' + task_id + '/')
        .then(response => {
            this.tasks = this.tasks.filter(task => task.id != task_id)
        }).catch(err => {
          console.log(err)
        })
    }
    }
}
</script>

