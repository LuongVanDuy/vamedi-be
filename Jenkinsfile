pipeline {
    agent {label 'agent2'}  // Specify the Jenkins agent to use
    stages {
        stage('Deploy') {
            steps {
                script {
                    sshagent(['doop-staging']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no root@160.30.136.119 'cd Project/vamedi-be && ./build.sh'
                        """
                    }
                }
            }
        }
    }
}
