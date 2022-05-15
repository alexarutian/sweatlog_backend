import { CreateSession } from "../child/createsession.js";
import { WorkoutInfo } from "../child/workoutinfo.js";
import { DoWorkout } from "../child/doworkout.js";

let { mapState, mapMutations } = Vuex;

let Agenda = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="agenda-page">
    <div id="add-button" @click="toggleAddingSessionWindow">
    <i class="fa-solid fa-droplet"></i>
    <i class="fa-solid fa-plus"></i></div>
    <div v-if="statusLevel == 'error'">[[message]]</div>
    <div v-for="date in dateSessionListFiltered" :class="{'agenda-item': true, 'today-date-agenda-item': todaysDate == date.dateValidator}">
      <p class="agenda-date-header">[[date.dateString]]</p>
      <div v-if="date.sessions.length > 0" v-for="session in date.sessions" class="agenda-workout">
        <i class="fa-solid fa-droplet agenda-droplet"></i>
        <p @click="selectSession({ session})" @click="toggleSessionWorkoutDetailWindow">[[session.workout.name]]</p>
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
    ]),
  },
  computed: {
    lastDay() {
      const s = this.sessions;
      if (s) {
        const lastSession = s[s.length - 1];
        return convertDateFromYYYYMMDDtoJSDate(lastSession.date);
      }
      return undefined;
    },

    dateSessionList() {
      // create object - array of objects - each has a date and 0 or more sessions
      // e.g. date and session and anything without a session renders as an empty date

      const today = new Date();
      const daysUntilLastSession = Math.floor((this.lastDay - today) / (1000 * 60 * 60 * 24));
      let lst = getFutureDates(today, daysUntilLastSession);
      for (const d of lst) {
        let sessionList = [];
        for (const s of this.sessions) {
          if (d.dateValidator == s.date) {
            sessionList.push(s);
          }
        }
        d.sessions = sessionList;
      }
      return lst;
    },
    todaysDate() {
      const today = new Date();
      return formatDatetoYYYYMMDD(today);
    },
    dateSessionListFiltered() {
      return this.dateSessionList.filter((i) => i.sessions.length > 0);
    },
    ...mapState({
      sessions: (state) => state.session.items,
      message: (state) => state.statusMessage,
      statusLevel: (state) => state.statusLevel,
      adding: (state) => state.session.addingSessionWindow,
      doing: (state) => state.workout.doingWorkoutWindow,
      detail: (state) => state.session.sessionWorkoutDetailWindow,
      selected: (state) => state.session.selectedSession,
    }),
  },
  created() {
    this.$store.dispatch("fetchSessions");
  },
};
export { Agenda };
