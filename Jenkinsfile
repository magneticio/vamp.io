node {
    stage('fetch') {
        echo 'Pulling source code from Github'
        git branch: 'feature/docker', credentialsId: 'jenkins-ssh', url: 'ssh://git@github.com/magneticio/vamp.io.git'
    }
    
    stage('build') {
        echo 'Building static site content'
        echo 'Building site container'
    }
    
    stage('deploy') {
        echo 'Pushing site container to registry'
    }
    
}