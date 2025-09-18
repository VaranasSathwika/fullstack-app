pipeline {
    agent any

    environment {
        REGISTRY = "docker.io/your-dockerhub-username"
        FRONTEND_IMAGE = "frontend"
        BACKEND_IMAGE = "backend"
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
        MAVEN_HOME = tool name: 'M3', type: 'maven'
        NODE_HOME = tool name: 'nodejs', type: 'nodejs'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-org/your-repo.git'
            }
        }

        stage('Build & Unit Test - Backend') {
            steps {
                dir('backend') {
                    sh "${MAVEN_HOME}/bin/mvn clean verify"
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Build & Unit Test - Frontend') {
            steps {
                dir('frontend') {
                    sh """
                        export PATH=$NODE_HOME/bin:$PATH
                        npm install
                        npm run test -- --watchAll=false --ci
                    """
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                    docker build -t $REGISTRY/$FRONTEND_IMAGE:\${BUILD_NUMBER} ./frontend
                    docker build -t $REGISTRY/$BACKEND_IMAGE:\${BUILD_NUMBER} ./backend
                """
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $REGISTRY/$FRONTEND_IMAGE:\${BUILD_NUMBER}
                        docker push $REGISTRY/$BACKEND_IMAGE:\${BUILD_NUMBER}
                    """
                }
            }
        }

        stage('End-to-End Tests') {
            steps {
                dir('tests/e2e') {
                    sh """
                        export PATH=$NODE_HOME/bin:$PATH
                        npm install
                        npx playwright test || npx cypress run
                    """
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'tests/e2e/results/**/*', allowEmptyArchive: true
                }
            }
        }

        stage('Security Scans') {
            parallel {
                stage('Bandit / Semgrep') {
                    steps {
                        sh 'bandit -r backend || true'
                        sh 'semgrep --config=auto backend || true'
                    }
                }
                stage('SonarQube Scan') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            dir('backend') {
                                sh "${MAVEN_HOME}/bin/mvn sonar:sonar"
                            }
                        }
                    }
                }
                stage('DAST Scan') {
                    steps {
                        sh 'echo "Trigger AppScan DAST here..."'
                    }
                }
            }
        }

        stage('Policy Gate') {
            steps {
                script {
                    echo "Checking security scan results..."
                }
            }
        }

        stage('Deploy to Hybrid Cluster') {
            steps {
                input message: "Deploy to Staging/Prod?", ok: "Deploy"
                sh """
                    argocd app sync my-3tier-app --grpc-web
                    argocd app wait my-3tier-app --sync --health --timeout 300
                """
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
