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
      'We have some basic measurement and infrequent reporting',
      'I have a dashboard with real time production KPI\'s',
      'I have a real time dashboard linked with customer success criteria'
    ]
  },{
    q: 'Who are involved in the software release pipeline and decision making?',
    a: [
      'Developers check in code; testers pick this up, QA and business validate. The devops engineer puts it live',
      'When developers check in code it is automatically tested. Only the final go-live is done manually',
      'Teams deploy independently. Success is transparent to all stakeholders. Business is involved in deployment decisions'
    ]
  },{
    q: 'My organisational state is best described as...',
    a: [
      'Development, test and operations have some basic form of cooperation',
      'Our teams make small and quick deployments. Each team has the mandate to deploy and roll back. Testing is automated',
      'We have cross functional teams with business integrated. Development happens in these teams with minimal dependencies'
    ]
  }
]

const levels = [
  { name: 'Starting with DevOps', index: 1, lower: 0, upper: 2 },
  { name: 'Learning & Adapting', index: 2, lower: 3, upper: 5 },
  { name: 'Predictable & Scaled', index: 3, lower: 6, upper: 8 },
  { name: 'Data Driven', index: 4, lower: 9, upper: 10 }
]

const levelDescriptions = [
  {
    title: 'Starting with DevOps',
    description: 'Congratulations! Great that you are planning and starting the DevOps transition. It will not be easy unfortunately. You are trying to think how to migrate away from your monolith and how to do this without interrupting your current pipelines and without incurring tons of costs.',
    solution: 'Vamp helps you migrate to a microservices and cloud native platform. It will help you with automated staged deployments to production and make it data driven, counter weighting the increased volume and complexity of microservices.',
    bullets: [
      { img: 0, text: 'Migration from on-prem to cloud native'},
      { img: 1, text: 'Running a multi cloud environment'},
      { img: 2, text: 'Automated and data driven canary releasing for CI/CD pipelines'}
    ]
  },
  {
    title: 'Learning & Adapting',
    description: 'Congratulations! You are very much aware of the challenges with microservices used by multiple teams. This adds complexity that increases rapidly when scaling up.',
    solution: 'Vamp helps you run a multi cloud environment, temporary or multi homed. Vamp will help you manage your technical inter-dependencies of microservices by automating the extension of your CI/CD pipeline into production.',
    bullets: [
      { img: 0, text: 'Migration from on-prem to cloud native' },
      { img: 1, text: 'Running a multi cloud environment'},
      { img: 2, text: 'Automated and data driven canary releasing for CI/CD pipelines'},
      { img: 3, text: 'Cost optimize your cloud native production environment'}
    ]
  },
  {
    title: 'Predictable & Scaled',
    description: 'Congratulations! You have some scar tissue from running microservices in production. Launching and managing microservices day-to-day on the bases of the right data and health metrics is really challenging.',
    solution: 'Vamp helps you to optimize the cost of your cloud native stack and optimize the extension of your CI/CD pipeline by adding data driven staged deployments. If a release causes a production issue, an automated policy responds to that real time.',
    bullets: [
      { img: 4, text: 'Data driven canary releasing for CI/CD pipelines with technical KPI\'s'},
      { img: 1, text: 'Running a multi cloud environment'},
      { img: 2, text: 'Real time production decisions based on application health KPI\'s'},
      { img: 3, text: 'Cost optimize your cloud native production environment'}
    ]
  },
  {
    title: 'Data Driven',
    description: 'Congratulations! You have come a long way in the cloud native domain. Are you considering to make changes to your cloud native stack? Is your business or product owner asking how the newly released software is performing?',
    solution: 'Vamp helps you connect business KPI\'s to any rollout. Vamp extends your CI/CD pipeline into production by adding business and operation data driven deployments. If your new release performs according to business metrics and technical KPI\'s, Vamp automatically promotes the release to a larger audience.',
    bullets: [
      { img: 4, text: 'Data driven canary releasing for CI/CD pipelines with technical and business KPI\'s'},
      { img: 1, text: 'Running a multi cloud environment'},
      { img: 2, text: 'Real time production decisions based on application health KPI\'s'},
      { img: 3, text: 'Cost optimize your cloud native production environment'}
    ]
  }
]

const bulletImages = [
  '/img/vendor/051-cloud-computing.svg',
  '/img/vendor/051-internet.svg',
  '/img/vendor/051-analytics.svg',
  '/img/vendor/051-money-bag.svg',
  '/img/vendor/051-target.svg'
]

Vue.config.devtools = true

const maturityCalculator = new Vue({
  el: '#app-maturity-calculator',
  delimiters: ["((","))"],
  mounted: function (el) {
    this.prepQuestions()
  },
  data: {
    questions: [],
    levels: levels,
    levelDescriptions: levelDescriptions,
    bulletImages: bulletImages,
    step: 0,
    showResults: false,
    emailAddress: '',
    showSubscribeSuccess: false,
    showSubscribeError: false,
    showSubscribeErrorMessage: ''

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
      if (this.step === 0) this.trackEvent('maturity-calculator', 'started')
      if (this.lastQuestion) {
        this.$root.$emit('bv::show::modal','emailmodal')
      } else {
        this.step = this.step === this.questions.length ? this.step : this.step + 1
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
    isActive: function (i) {
      return {
        'level-block-active bounceIn': this.levels[i].name === this.currentLevel.name,
        'level-block-color-0': i === 0,
        'level-block-color-1': i === 1,
        'level-block-color-2': i === 2,
        'level-block-color-3': i === 3
      }
    },
    getCurrentLevel: function (score) {
      for(var i = 0; i < levels.length; i++) {
        const level = levels[i]
        if (score >= level.lower && score <= level.upper ) {
          this.currentLevel = level.name
        }
      }
    },
    showEmailModal: function () {
      this.$root.$emit('bv::show::modal','emailmodal')
    },
    hideEmailModal: function () {
      this.$root.$emit('bv::hide::modal','emailmodal')
    },
    goToResults: function () {
      this.showSubscribeSuccess = this.showSubscribeError = false
      this.hideEmailModal()
      this.showResults = true
      this.trackEvent('maturity-calculator', 'show-results')
    },
    subscribeToNewsletter: function () {
      const that = this
      $.ajax({
        type: 'GET',
        url: 'https://magnetic.us9.list-manage.com/subscribe/post-json?u=c709b3ab8cce9e00d617e01b6&id=c1465e21d0&c=?',
        data: 'EMAIL=' + this.emailAddress,
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        error: function (err) {
          that.showSubscribeErrorMessage = err.msg
          that.showSubscribeError = true
        },
        success: function (data) {
          if (data.result != "success") {
            that.showSubscribeError = true
            that.showSubscribeErrorMessage = data.msg
          } else {
            that.showSubscribeError = false
            that.showSubscribeSuccess = true
            this.trackEvent('maturity-calculator', 'subscribed')
            setTimeout(function () {
              that.goToResults()
            }, 1000)
          }
        }
      });
    },
    trackEvent: function (category, action, label) {
      if (window.ga) {
        window.ga('send', {
          hitType: 'event',
          eventCategory: category,
          eventAction: action,
          eventLabel: label
        })
      }
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
    percentageCompleted: function () {
      return (this.progress / this.max).toPrecision(1) * 100 + '%'
    },
    max: function () {
      return this.questions.length
    },
    score: function () {
      return this.questions.map(function (question) {
        return question.selected
      }).reduce(function (prev, cur) {
        return prev + cur
      }, 0)
    },
    currentLevel: function () {
      const that = this
      return this.levels.filter(function(level) {
        return that.score >= level.lower && that.score <= level.upper
      })[0]
    },
    currentLevelDescription: function () {
      return this.levelDescriptions[this.currentLevel.index -1]
    }
  }
})
