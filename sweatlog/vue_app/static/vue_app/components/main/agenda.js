import { WaterDrop } from "../child/waterdrop.js";
import { CreateSession } from "../child/createsession.js";
import { WorkoutInfo } from "../child/workoutinfo.js";

let { mapState, mapMutations } = Vuex;

let Agenda = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="agenda-page">
    <div id="page-top-options">
      <div @click="toggleAddingSessionWindow" class="page-top-option">SCHEDULE WORKOUT</div>
      <div class="page-top-option">Option 2</div>
      <div class="page-top-option">Option 3</div>
    </div>
    <div v-if="statusLevel == 'error'">[[message]]</div>
    <div v-for="date in dateSessionList" :class="{'agenda-item': true, 'today-date-agenda-item': todaysDate == date.dateValidator}">
      <p class="agenda-date-header">[[date.dateString]]</p>
      <div v-if="date.sessions.length > 0" v-for="session in date.sessions" class="agenda-workout">
        <waterdrop class="agenda-item-icon agenda-waterdrop"></waterdrop>
        <p @click="selectSessionWorkout({ workout: session.workout })" @click="toggleSessionWorkoutDetailWindow">[[session.workout.name]]</p>
      </div>
      <div v-if="date.sessions.length == 0" class="agenda-no-workout">
        <div class="agenda-item-icon agenda-plus">+</div>
        <p>Schedule workout</p>
      </div>
    </div>
    <div>Schedule another workout</div>
  <div v-if="adding" id="create-session-modal" class="modal">
    <span class="close" @click="toggleAddingSessionWindow">&times;</span>  
    <createsession v-if="adding"></createsession>
  </div>
  <div v-if="adding" class="modal-overlay" @click="toggleAddingSessionWindow"></div>

  <div v-if="detail" class="modal">
  <span class="close"
  @click="toggleSessionWorkoutDetailWindow">&times;</span>  
  <workoutinfo :workout="selected"></workoutinfo>
</div>
<div v-if="detail" class="modal-overlay"
@click="toggleSessionWorkoutDetailWindow"></div>
</div>

  </div>
  `,

  components: {
    waterdrop: WaterDrop,
    createsession: CreateSession,
    workoutinfo: WorkoutInfo,
  },
  data() {
    return {};
  },
  // BUTTONS - GO TO TODAY - GO TO LAST EVENT
  // add button shortcuts for add on each day, then another add at end of list auto-populated with next day out
  // collapsing date ranges if no workouts for more than x days
  methods: {
    ...mapMutations(["toggleAddingSessionWindow", "toggleSessionWorkoutDetailWindow", "selectSessionWorkout"]),
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
    ...mapState({
      sessions: (state) => state.session.sessions,
      message: (state) => state.statusMessage,
      statusLevel: (state) => state.statusLevel,
      adding: (state) => state.session.addingSessionWindow,
      detail: (state) => state.session.sessionWorkoutDetailWindow,
      selected: (state) => state.session.selectedSessionWorkout,
    }),
  },
  created() {
    this.$store.dispatch("fetchSessions");
  },
};
export { Agenda };
