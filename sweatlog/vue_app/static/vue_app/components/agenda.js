let Agenda = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="agenda-page">AGENDA PAGE
    <div v-for="date in dateSessionList" class="agenda-item">
      <p :class="{'agenda-date-header': true, 'today-date-header': todaysDate == date.dateValidator}">[[date.dateString]]</p>
      <p v-if="date.sessions.length > 0" v-for="session in date.sessions" class="agenda-workout">[[session.workout.name]]</p>
      <p v-if="date.sessions.length == 0" class="agenda-no-workout">No workouts yet...</p>
    </div>
  </div>
  `,

  components: {},
  data() {
    return {};
  },
  // render out date list to furthest out session?
  // BUTTONS - GO TO TODAY - GO TO LAST EVENT
  // add button shortcuts for add on each day, then another add at end of list auto-populated with next day out
  // collapsing date ranges if no workouts for more than x days
  methods: {
    // action runs this function, then mutation will set value to component
    async getScheduledSessions() {
      const response = await getJSONFetch("/webapp/get_scheduled_sessions", {});
      this.sessions = response.scheduled_sessions;
    },
  },
  computed: {
    sessions() {
      return this.$store.state.sessions;
    },
    lastDay() {
      const s = this.$store.state.sessions;
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
      const daysUntilLastSession = Math.floor(
        (this.lastDay - today) / (1000 * 60 * 60 * 24)
      );
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
  },
  created() {
    this.$store.dispatch("fetchSessions");
  },
};
export { Agenda };
