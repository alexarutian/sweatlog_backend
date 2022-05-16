import { CreateSession } from "../child/createsession.js";
import { WorkoutInfo } from "../child/workoutinfo.js";
import { DoWorkout } from "../child/doworkout.js";

let { mapState, mapMutations, mapActions } = Vuex;

let Agenda = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="agenda-page">
    <div id="add-button" @click="toggleAddingSessionWindow">
    <i class="fa-solid fa-droplet"></i>
    <i class="fa-solid fa-plus"></i></div>
    <div v-if="statusLevel == 'error'">[[message]]</div>
    <div v-for="date in dateSessionList2" :class="{'agenda-item': true, 'today-date-agenda-item': todaysDate == date.dateValidator}">
      <p class="agenda-date-header">[[date.datestring]]</p>
      <div v-if="date.sessions.length > 0" v-for="session in date.sessions" class="agenda-workout">
        <div class="agenda-workout-left">
          <i class="fa-solid fa-droplet agenda-droplet"></i>
          <p @click="selectSession({ session})" @click="toggleSessionWorkoutDetailWindow">[[session.workout.name]]</p>
        </div>
        <div @click="submitDelete(session, date.dateString)"><i class="fa-regular fa-trash-can"></i></div>
      </div>
    </div>
  <div v-if="adding" id="create-session-modal" class="modal">
    <span class="close" @click="toggleAddingSessionWindow">&times;</span>  
    <createsession v-if="adding"></createsession>
  </div>
  <div v-if="adding" class="modal-overlay" @click="toggleAddingSessionWindow"></div>

  <div v-if="doing" class="full-page-box">
  <span class="close-full-page-box" @click="toggleDoingWorkoutWindow">&times;</span>  
  <doworkout v-if="doing"></doworkout>
  </div>

  <div v-if="detail" class="modal">
  <span class="close"
  @click="toggleSessionWorkoutDetailWindow">&times;</span>  
  <workoutinfo :workout="selected.workout"></workoutinfo>
  <button @click="toggleDoingWorkoutWindow" @click="toggleSessionWorkoutDetailWindow">START WORKOUT</button>
</div>
<div v-if="detail" class="modal-overlay"
@click="toggleSessionWorkoutDetailWindow"></div>

  <div v-if="choppingBlock" class="delete-confirmation" class="modal">
      <span class="close" @click="clearChoppingBlock">&times;</span> 
      <div>Are you sure you want to delete [[choppingBlock.name]]?</div> 
      <button @click="deleteItem">DELETE</button>
  </div>
  <div v-if="choppingBlock" @click="clearChoppingBlock" class="modal-overlay"></div>


</div>

  </div>
  `,

  components: {
    createsession: CreateSession,
    workoutinfo: WorkoutInfo,
    doworkout: DoWorkout,
  },
  data() {
    return {};
  },
  // BUTTONS - GO TO TODAY - GO TO LAST EVENT
  // add button shortcuts for add on each day, then another add at end of list auto-populated with next day out
  // collapsing date ranges if no workouts for more than x days
  methods: {
    ...mapMutations([
      "toggleAddingSessionWindow",
      "toggleSessionWorkoutDetailWindow",
      "selectSession",
      "toggleDoingWorkoutWindow",
      "loadChoppingBlock",
      "clearChoppingBlock",
    ]),
    ...mapActions(["deleteItem"]),
    submitDelete(s, datestring) {
      const obj = {
        resourceTypeStr: "sessions",
        id: s.id,
        name: s.workout.name + " on " + datestring,
      };
      this.loadChoppingBlock(obj);
    },
  },
  computed: {
    dateSessionList2() {
      console.log(this.sessions);
      let lst = [];
      for (const s of this.sessions) {
        let date = convertDateFromYYYYMMDDtoJSDate(s.date);
        let datestring = convertToDatestring(date);
        // does the list include this date already?
        if (lst.filter((e) => e.date === date).length > 0) {
          let index = lst.indexOf(date);
          lst[index].sessions.push(s);
        } else {
          let obj = { date, datestring, sessions: [s] };
          lst.push(obj);
        }
      }
      return lst;
    },
    todaysDate() {
      const today = new Date();
      return formatDatetoYYYYMMDD(today);
    },
    ...mapState({
      sessions: (state) => state.session.items,
      message: (state) => state.statusMessage,
      statusLevel: (state) => state.statusLevel,
      adding: (state) => state.session.addingSessionWindow,
      doing: (state) => state.workout.doingWorkoutWindow,
      detail: (state) => state.session.sessionWorkoutDetailWindow,
      selected: (state) => state.session.selectedSession,
      choppingBlock: (state) => state.choppingBlock,
    }),
  },
  created() {
    this.$store.dispatch("fetchSessions");
  },
};
export { Agenda };
