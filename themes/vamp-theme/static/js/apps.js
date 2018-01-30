const questions = [
  {
    q: 'How often do you deploy to production per week?',
    a: [
      'Less then once per week',
      'A couple of times per week',
      'Multiple times every day'
    ]
  },
  {
    q: 'How automated are your deploys?',
    a: [
      'Barely, we deploy things manually',
      'Automated, with some manual testing',
      'One button deploys'
    ]
  },{
    q: 'How transparent is deployment and production for you?',
    a: [
      'We have some basic measurement and mainly infrequent reporting',
      'I have a dashboard with real time production KPI\'s and deployment stats',
      'I have a real time production and deployment dashboard with automated criteria and deployment scenario\'s linked with customer success criteria'
    ]
  }
]

const levels = [
  { name: 'Starting with DevOps', score: 1 },
  { name: 'Learning & Adapting', score: 2 },
  { name: 'Predictable & Scaled', score: 3 },
  { name: 'Data Driven', score: 4 }
]

const maturityCalculator = new Vue({
  el: '#app-maturity-calculator',
  delimiters: ["((","))"],
  mounted: function (el) {
    this.prepQuestions()
  },
  data: {
    questions: [],
    levels: levels,
    step: 0,
    showResults: false
  },
  methods: {
    prepQuestions: function () {
      this.questions = questions.map(function (question) {
        return {
          q: question.q,
          a: question.a.map(function (answer, index) {
            return {
              text: answer,
              value: index
            }
          }),
          selected: 0
        }
      })
    },
    next: function () {
      if (this.lastQuestion) {
        this.showResults = true
      } else {
        this.step = (this.step + 1) === this.questions.length ? this.step : this.step + 1
      }
    },
    previous: function () {
      this.step = this.step === 0 ? this.step : this.step -1
    },
    startAgain: function () {
      this.showResults = false
      this.prepQuestions()
      this.step = 0
    },
    isBold: function (level) {
      return {
        'font-weight-bold': level === this.score
      }
    },
    getWinner: function () {
      return this.levels.filter(function (level) {
        return level.score < this.score
      })
    }
  },
  computed: {
    question: function () {
      return this.questions.length > 0 ? this.questions[this.step].q : 0
    },
    answers: function () {
      return this.questions.length > 0 ? this.questions[this.step].a : 0
    },
    lastQuestion: function () {
      return this.progress === this.max
    },
    progress: function () {
      return this.step + 1
    },
    max: function () {
      return this.questions.length// the result page adds the 1
    },
    score: function () {
      return this.questions.map(function (question) {
        return question.selected
      }).reduce(function (prev, cur) {
        return prev + cur
      }, 0)
    }
  }
})
