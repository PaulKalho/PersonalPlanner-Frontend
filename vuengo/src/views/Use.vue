<template>
  <div class="HomeView">
    <div class="container">
      <hr>
      <div class="has-text-right">
        <router-link to="app/done">Done > </router-link>
      </div>
      <hr>
      <div class="columns">
        <div class="column">
          <button @click="isActiveTask = !isActiveTask" class="button is-link">Add ToDo</button>
          <form v-on:submit.prevent="addTask">

            <div class="modal" :class="{'is-active' : isActiveTask}">

              <div class="modal-background"></div>
              <div class="modal-card">
                <header class="modal-card-head">
                  <p class="modal-card-title">Add Task</p>
                  <button type="button" class="delete" aria-label="close" @click="isActiveTask = !isActiveTask"></button>
                </header>
                
                <section class="modal-card-body">
                        <div class="field">
                            <label class="label">Description</label>
                            <div class="controls">
                            <!-- VModel ist wichtig für <script> untern -->
                            <input class="input" type="text" v-model="description"> 
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Status</label>
                            <div class="control">
                              <div class="select">
                                <select v-model="status">
                                  <option value="todo">To do</option>
                                  <option value="done">Done</option>
                                </select>
                              </div>
                            </div>
                        </div>

                        <div class="field">
                          <label class="label">Deadline</label>
                          <div class="columns is-1">
                            <div class="column">
                            <div v-if="noDeadline">
                              <Datepicker @selected="noDeadline = false" v-model="state.dateDeadline" name="deadline"></Datepicker>
                            </div>
                            <div v-else>
                              <Datepicker v-model="state.date" name="deadline"></Datepicker>

                            </div>
                            </div>
                            <div class="column">
                              <label class="checkbox">
                                <p class="title is-6" >Keine Deadline <input @click="noDeadline = !noDeadline" :checked="noDeadline" type="checkbox"></p>
                                
                              </label>
                            </div>

                          </div>
                        </div>
                        <div class="field">
                            <label class="label">Gruppe</label>
                            <div class="control">
                              <div class="select">
                                <select v-model="grpwahl">
                                  <option :value=null>Keine</option>
                                  <option v-for="group in groups" v-bind:key="group.id" :value="group.id">{{ group.description }}</option>                            
                                </select>
                              </div>
                            </div>
                        </div> 
                        
                </section>
                <footer class="modal-card-foot">
                  <button type="submit" class="button is-link is-fullwidth">Submit</button>
                </footer>
              </div>
            </div>
          </form>
        </div>
        <div class="column">
          <button @click="isActiveGroup = !isActiveGroup" class="button is-link is-pulled-right">Add Group</button>
          <form v-on:submit.prevent="addGroup">
            <div class="modal" :class="{'is-active' : isActiveGroup}">
              <div class="modal-background"></div>
              <div class="modal-card">
                <header class="modal-card-head">
                  <p class="modal-card-title">Add Group</p>
                  <button type="button" class="delete" aria-label="close" @click="isActiveGroup = !isActiveGroup"></button>
                </header>
                <section class="modal-card-body">
                  <div class="field">
                      <label class="label">Description</label>
                        <div class="controls">
                          <!-- VModel ist wichtig für <script> untern -->
                          <input class="input" type="text" v-model="descGroup"> 
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                  <button type="submit" class="button is-link is-fullwidth">Submit</button>
                </footer>
              </div>
            </div>
          </form>
        </div>
      </div>
      <hr>
      <div class="field">
        <div class="columns">
            <div class="column is-full">
                <h2 class="title">To Do</h2>
                <button class="button is-link is-small is-pulled-right" @click="sort('date')">Sortieren</button>
                <hr>
                <div class="todo">
                    <div v-for="group in groups" v-bind:key="group.id">
                      <table class="table is-fullwidth">
                        <thead>
                          <th style="width: 5%">Delete</th>
                          <th style="width: 75%" class="has-text-left"><h1 class="title is-5">{{group.description}} </h1></th>
                          <th>Edit</th>

                          <th @click="sort('date')" style="width: 15%">Bis</th>
                          <th style="width: 5%" class="has-text-right"><button class="delete is-small is-danger " @click="deleteGroup(group.id)"></button> </th>
                        </thead>
                        <br>
                        <tbody class="is-fullwidth" v-for="task in sortedTasks" v-bind:key="task.id">
                          <td style="width: 5%" v-if="task.status === 'todo' && task.group === group.id"><button @click="deleteTask(task.id)" class="delete is-small" ></button></td>
                          <td style="width: 75%" class="has-text-left" v-if="task.status === 'todo' && task.group === group.id">{{task.description + ", " + getGroupName(task.group)}}</td>
                          <td v-if="task.status === 'todo' && task.group === group.id"><font-awesome-icon @click="
                          isActiveEdit = !isActiveEdit, 
                          editTas = task, 
                          this.descriptionEdit = task.description,
                          this.statusEdit = task.status,
                          state.date = task.date ? new Date(formatDate(task.date, 2)) : null,
                          this.grpwahlEdit = task.group,
                          this.noDeadline = task.date ? false : true
                          " 
                          icon="fa-regular fa-pen-to-square" /> </td>
                          <td style="width: 15%" v-if="task.status === 'todo' && task.group === group.id">{{formatDate(task.date)}}</td>
                          <td style="width: 5%" class="has-text-right" v-if="task.status === 'todo' && task.group === group.id"> 
                            <!-- <a @click="setStatus(task.id, 'done')">Done</a> -->
                            <label class="checkbox">
                              <input type="checkbox" @change="setStatus(task.id, 'done')">
                            </label>
                          </td>
                          
                        </tbody>
                      </table>
                      
                    
                      <br>
                    </div>
                    <!-- MODAL EDIT -->
                    <form v-on:submit.prevent="editTask(editTas)">
                      <div class="modal" :class="{'is-active' : isActiveEdit}">
                        <div class="modal-background"></div>
                        <div class="modal-card">
                          <header class="modal-card-head">
                            <p class="modal-card-title">Edit Task: " {{ editTas.description }} "</p>
                            <button type="button" class="delete" aria-label="close" @click="isActiveEdit = !isActiveEdit"></button>
                          </header>
                          <section class="modal-card-body">
                            <div class="field">
                              <label class="label">Description</label>
                              <div class="controls">
                                <!-- VModel ist wichtig für <script> untern -->
                                <input class="input" type="text" v-model="descriptionEdit"> 
                              </div>
                            </div>

                            <div class="field">
                                <label class="label">Status</label>
                                <div class="control">
                                  <div class="select">
                                    <select v-model="statusEdit">
                                      <option value="todo">To do</option>
                                      <option value="done">Done</option>
                                    </select>
                                  </div>
                                </div>
                            </div>

                            <div class="field">
                              <label class="label">Deadline</label>
                              <div class="columns is-1">
                                <div class="column">
                                <div v-if="noDeadline">
                                  <Datepicker @selected="noDeadline = false" v-model="state.dateDeadline" name="deadline"></Datepicker>
                                </div>
                                <div v-else>
                                  <Datepicker v-model="state.date" name="deadline"></Datepicker>

                                </div>
                                </div>
                                <div class="column">
                                  <label class="checkbox">
                                    <p class="title is-6" >Keine Deadline <input @click="noDeadline = !noDeadline" :checked="noDeadline" type="checkbox"></p>
                                    
                                  </label>
                                </div>

                              </div>
                            </div>
                            <div class="field">
                                <label class="label">Gruppe</label>
                                <div class="control">
                                  <div class="select">
                                    <select v-model="grpwahlEdit">
                                      <option :value=null>Keine</option>
                                      <option v-for="group in groups" v-bind:key="group.id" :value="group.id">{{ group.description }}</option>                            
                                    </select>
                                  </div>
                                </div>
                            </div> 
                            
                          </section>
                          <footer class="modal-card-foot">
                            <button type="submit" class="button is-link is-fullwidth">Submit</button>
                          </footer>
                        </div>
                      </div>
                    </form>
          
                    <!-- KEINE GRUPPPE --> 
                    <div v-if="groups"> 
                      <table class="table is-striped is-hoverable is-fullwidth">
                        <thead>
                          <th style="width: 5%">Delete</th>
                          <th class="has-text-left"><h1 class="title is-5">Keine Gruppe:</h1></th>
                          <th>Edit</th>
                          <th @click="sort('date')" style="width: 15%">Bis</th>
                          
                          <th class="has-text-right"><button class="delete is-small is-danger " @click="deleteGroup(group.id)"></button> </th>

                        </thead>
                        <br>
                        <tbody class="table is-striped is-hoverable" v-for="task in tasks" v-bind:key="task.id">
                          <td style="width: 5%" v-if="task.status === 'todo' && task.group === null"><button @click="deleteTask(task.id)" class="delete is-small" ></button></td>
                          <td class="has-text-left" v-if="task.status === 'todo' && task.group === null">{{task.description + ", " + getGroupName(task.group)}}</td>
                          <td style="width: 15%" v-if="task.status === 'todo' && task.group === null">{{formatDate(task.date)}}</td>
                          <td class="has-text-right" v-if="task.status === 'todo' && task.group === null">
                            <!-- <a @click="setStatus(task.id, 'done')">Done</a> -->
                            <label class="checkbox">
                              <input type="checkbox" @change="setStatus(task.id, 'done')">
                            </label>
                          </td>
                        </tbody>
                      </table>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios'
import Datepicker from 'vuejs3-datepicker'


export default {
  name: 'Use',
  components: {
    Datepicker
  },
  data() {
          
    return {
      groups: [],
      tasks: [],
      description: '',
      status: 'todo',
      grpwahl: null,
      isActiveTask: false,
      isActiveGroup: false,
      isActiveEdit: false,
      noDeadline: false,
      currentSort: 'date',
      currentSortDir: 'asc',
      editTas: [],
      test: '',
      state: {
        date: new Date(2022,8,8),
        dateDeadline: null 
        
      }
    }
  },
  mounted() {
    this.getTasks()
    this.getGroups()
    
  },
  computed: {
    sortedTasks: function() {
      return this.tasks.sort((a, b) => {
        
        var aa = a,
            bb = b

        if(a.date && b.date) {
          //Hier wird das Date in YYYYMMDD umgewandelt damit verglichen werden kann
          //Leider unschön aber es lässt sich bei django kein js Date Object eintragen, sondern nur im format yyyy-mm-dd
          var aa = a.date.split('-').join(''),
              bb = b.date.split('-').join('')
          
          a.date = aa
          b.date = bb
        }

        console.log(a[this.currentSort])
        console.log(b[this.currentSort])

        let modifier = 1;
        if(this.currentSortDir === 'desc') modifier = -1
        if(a[this.currentSort] === null) return 1 
        if(b[this.currentSort] === null) return -1
        if(a[this.currentSort] < b[this.currentSort])  return -1 * modifier
        if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier
        
      })
    }
  },
  methods: {
    sort(s) {  
      if(this.currentSort === s) {
        this.currentSortDir = this.currentSortDir === 'asc'?'desc':'asc'
      }
      this.currentSort = s
    },
    getGroupName(id) {
      const obj = this.groups.find(group => group.id === id) 
      if(!obj) {
        return "Keine Gruppe"
      }else {
        return obj.description
      }
    },
    async editTask(task) {
      /* Task param is the task obj */

      const date = this.state.date
      var mm = date.getMonth() + 1
      var dd = date.getDate()
      var yyyy = date.getFullYear()

      let dateFormat = yyyy + "-" + (mm>9 ? '' : '0' ) + mm + "-" + (dd > 9 ? '' : '0')+ dd
        
      if(this.noDeadline) {
        console.log("No Deadline")
        dateFormat = null
      }


      const newdata = {
        description: this.descriptionEdit,
        status: this.statusEdit,
        group: task.group,
        date: dateFormat
        //DATUM / DEADLINE
      }

      console.log(this.test)

      await axios
        .put('/api/v1/tasks/' + task.id + "/", newdata)
        .then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
        })

      console.log(task.id)
      
    },
    formatDate(date, type = 1) {
      // Diese Funktion formatiert das Datum. Es gibt 2 Typen
      // Type 1 = Formatierung für das Anzeigen in der Tabelle
      // Type 2 = Formatierung um ein Date Objekt zu erzeugen -> Wird in Edit Task Modal verwendet 

      let fix

      if(type === 1) {
        fix = '.'
      }else if(type === 2) {
        fix = ','
      }

      if(date) {
        const year = date.substring(0,4)
        const month = date.substring(4,6)
        const day = date.substring(6,8)
        if(type === 1) {
          return day + fix + month + fix + year
        }else {
          return year + fix + month + fix + day
        }
      }else {
        if(type === 1) {
          return "Keine Deadline"
        }else {
          return null
        }
      }
      
    },
    async getTasks() {
      await axios
        .get('/api/v1/tasks/')
        .then(response => { 
          this.tasks = response.data
          //console.log(this.tasks)
        })
    },
    
    async getGroups() {
      await axios
            .get('/api/v1/groups/')
            .then(response => {
                this.groups = response.data
                console.log(this.groups)
            })
    },
    async addTask() {
      if(this.description) {
        

        const date = this.state.date
        var mm = date.getMonth() + 1
        var dd = date.getDate()
        var yyyy = date.getFullYear()

        let dateFormat = yyyy + "-" + (mm>9 ? '' : '0' ) + mm + "-" + (dd > 9 ? '' : '0')+ dd
        
        if(this.noDeadline) {
          console.log("No Deadline")
          dateFormat = null
        }

        const data = {
          description: this.description,
          status: this.status,
          group: this.grpwahl,
          date: dateFormat,
        }

        //console.log(this.data)

        await axios
          .post('http://127.0.0.1:8000/api/v1/tasks/', data)
          .then(response => {
            let newTask = {
              'id': response.data.id,
              'description': this.description,
              'group': this.grpwahl,
              'status': this.status,
              'date': dateFormat
            }
            
            this.tasks.push(newTask)
            console.log(this.tasks)
            this.description = ''
            this.status = 'todo'
            this.isActiveTask = false
          }).catch(error => {
            console.log(error)
          })
          
      }
    },
    async addGroup() {
      if(this.descGroup) {

        const group = {
          description: this.descGroup,
        }

        await axios
          .post('http://127.0.0.1:8000/api/v1/groups/', group)
          .then(response => {
            let groupData = {
              'id': response.data.id,
              'description': this.descGroup
            }

            this.groups.push(groupData)
            console.log(response)

            this.descGroup = ''
          })
          .catch(error => {
            console.log(error)
          })
        
      }
    },
    setStatus(task_id, status) {
      
      const task = this.tasks.filter(task => task.id === task_id)[0]
      const description = task.description

      const data = {
        status: status,
        description: description
      }

      axios
        .put('/api/v1/tasks/' + task_id + '/' , data)
        .then(response => {
          task.status = status
        })
    },
    deleteTask(task_id) {
      const task = this.tasks.filter(task => task.id === task_id)[0]
      
      axios
        .delete('api/v1/tasks/' + task_id + '/')
        .then(() => {
            this.tasks = this.tasks.filter(task => task.id != task_id)
        }).catch(err => {
          console.log(err)
        })
    },
    deleteGroup(group_id) {
      const obj = this.groups.filter(group => group.id === group_id)[0]

      axios
        .delete('api/v1/groups/' + group_id + '/')
        .then(response => {
          this.groups = this.groups.filter(group => group.id != group_id)
        }).catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss">

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0.8;
  float: right;
  transform: translateX(100%);
}

.select, select{
  width: 100%;
}

.card{
  margin-bottom: 20px;
}

.done{
  opacity: 0.3;
}

.red {
  color: red;
}

</style>
