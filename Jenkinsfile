#!groovy​
node("mesos-slave-vamp.io") {
  version = 'nightly'
  gitBranch = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
  echo "branch: ${gitBranch}"

  withEnv(["VAMP_VERSION=${version}"]) {
    stage('Build') {
      checkout scm
      sh '''
      printenv
      npm install 
      gulp build:site
      gulp build --env=production
      '''
      docker.build 'magnetic.azurecr.io/vamp.io:$VAMP_VERSION', '.'
    }

    stage('Test') {
      docker.image('magnetic.azurecr.io/vamp.io:$VAMP_VERSION').withRun ('-p 8080:8080', '-conf Caddyfile') {c ->
          // check if the base url is set properly
          resp = sh( script: 'curl -s http://localhost:8080', returnStdout: true ).trim()
          assert !resp.contains("localhost:8080")
          // check if the aliases are set properly
          resp = sh script: "curl -Ls http://localhost:8080/documentation/", returnStdout: true
          assert resp =~ /url=.*\/documentation\/how-vamp-works\/v\d.\d.\d\/architecture-and-components/
      }
    }

    stage('Publish') {
      if (currentBuild.result == null || currentBuild.result == 'SUCCESS') {
        withDockerRegistry([credentialsId: 'registry', url: 'https://magnetic.azurecr.io']) {
            def site = docker.image('magnetic.azurecr.io/vamp.io:$VAMP_VERSION')
            site.push(env.VAMP_VERSION)
            site.push('latest')
        }
      }
    }

    stage('Deploy') {
      if (currentBuild.result == null || currentBuild.result == 'SUCCESS') {
        if (version != 'nightly') {
          sh script: '''
          curl -s -d "$(sed s/VERSION/$VAMP_VERSION/g config/blueprint.yaml)" http://10.20.0.100:8080/api/v1/deployments -H 'Content-type: application/x-yaml'
          '''
        }
      }
    }
  }
}
