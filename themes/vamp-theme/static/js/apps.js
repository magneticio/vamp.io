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
  },{
    q: 'Who are involved in the software release pipeline and decision making?',
    a: [
      'Developers check in their code and testers then pick this up, QA puts it forward for business to validate: then the devops engineer puts it live',
      'The build pipeline is automated. When the developer checks in code it automatically will be tested, and only the final go-live is done manually',
      'Several devops teams deploy independently, immediate transparancy about success is transparent to all stakeholders, business is real time involved in decisions regarding deployment decisions'
    ]
  },{
    q: 'My organisational state is best described as...',
    a: [
      'Development, test and operations have some basic form of cooperation',
      'Our devops teams make small and quick deployments and the team has the mandate to deploy and roll-back anything, testing is automated',
      'we have cross functional teams with business integrated, developing software happens in these teams and they dependencies are minimal, business gets involved if things go wrong'
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
  { text: 'Business is requesting better Time-To-Market\n\n' +
    'Dev teams work Agile - still deployment and feedback is waterfall based\n\n' +
    'Hard to get performance metrics on our apps and operations\n' +
    'Development and Operations start cooperating more and more as a team\n' +
    'There is a business need for migrating to cloud native, but most of my apps are running still on on-prem equipment and are monolithic\n' +
    'Some of the tech team went to DevOps conference and came back with great ideas about microservices and containers - it sounds fairly trivial\n' +
    'Little automation in the build and deploy pipeline'},
  { text: 'We start deploying our software more often (2x per day and up)\n' +
    'We have several applications running on cloud native \n' +
    'We have several DevOps teams working, too many meetings to keep this coordinated\n' +
    'Business is not yet involved in deployment decisions\n' +
    'Been running cloud native now for a while Oops: running containers and microservices with our containerplatform is not really straightforward\n' +
    'Business sees improved TimeToMarket, but starts to get involved more thru the DevOps team link with the product owners\n' +
    'We have some of our release pipeline automated (like with Jenkins, Puppet) '},
  { text: 'Too many deployments with manual scripts are resulting in outages in production and is becoming a labor burden and driving customer dissatisfaction\n' +
    'We deploy daily or weekly for several apps and microservices\n' +
    'Infrastructure as code is the mantra today - this starts to look like true Continuous Deployment\n' +
    'We can track status between code completion and actual production release, and its automated\n' +
    'Business starts questioning about the AWS, Azure or Google cloud monthly bill and how this all of a sudden costs so much opex\n' +
    'We deploy 24hours a day and releasing software is a matter of minutes, rolling back is a matter of seconds, we get instant feedback about success\n' +
    'Performance metrics are on our dashboard, and we can rightscale our capacity to some extent on that bases'},
  { text: 'Too many teams that deploy, it became that easy that we need structure and workflow around releasing SW with different roles\n' +
    'My release pipeline is completely automated and transparent, even integration testing is automated\n' +
    'Right scaling the infrastrucure for all my services and ensuring not too much slack capacity is an art\n' +
    'It looks like these microservices can be run with 5 9\'s after all - that was not a walk in the park!\n' +
    'Business requires more observability, transparancy and control without those non-techies disturbing production, can i put them in a sandbox?\n' +
    'Business wants to be involved in which applications should be exposed to which customers based on transparent customer satisfaction metrics and other crazy things IFTTT style.\n' +
    'Would like to automatically cost optimize and performance optimize between on-prem, AWS, Azure, Google cloud from 1 console'}

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
    levelDescriptions: levelDescriptions,
    step: 0,
    showStartScreen: true,
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
    startSurvey: function () {
      this.showStartScreen = false
    },
    next: function () {
      if (this.lastQuestion) {
        this.showResults = true
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
        'level-block-active': this.levels[i].name === this.currentLevel.name,
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
          console.log(this.currentLevel)
        }
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
    }
  }
})
