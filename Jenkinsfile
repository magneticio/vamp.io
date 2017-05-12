#!groovy​
node("mesos-slave-vamp.io") {
    withEnv(['VAMP_VERSION=0.9.4']) {
        stage('Build') {
          checkout scm
          sh '''
          ls -lart
          npm install 
          gulp build:site
          gulp build --env=production
          '''
          def site = docker.build 'magnetic.azurecr.io/vamp.io:$VAMP_VERSION', '.'
        }

        stage('Test') {
          docker.image('magnetic.azurecr.io/vamp.io:$VAMP_VERSION').withRun ('-p 8080:8080', '-conf Caddyfile') {c ->
              // check if the base url is set properly
              sh 'curl -s http://localhost:8080 -o resp.txt'
              def result = readFile('resp.txt').trim()
              assert !result.contains("localhost:8080")
              // check if the aliases are set properly
              sh script: '''
              curl -s http://localhost:8080/documentation/ | grep "url=http://vamp.io/documentation/how-vamp-works/v${VAMP_VERSION}/architecture-and-components"
              '''
          }
        }

        stage('Publish') {
          withDockerRegistry([credentialsId: 'registry', url: 'https://magnetic.azurecr.io']) {
              site.push(env.VAMP_VERSION)
              site.push('latest')
          }
        }

        stage('Deploy')
        stage('Smoke')
    }
}
