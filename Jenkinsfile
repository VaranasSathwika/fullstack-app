pipeline {
    agent any

    environment {
<<<<<<< HEAD
        REGISTRY = "docker.io/your-dockerhub-username"
        FRONTEND_IMAGE = "frontend"
        BACKEND_IMAGE = "backend"
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
        MAVEN_HOME = tool name: 'M3', type: 'maven'
        NODE_HOME = tool name: 'nodejs', type: 'nodejs'
=======
        REGISTRY = "docker.io"                  // or your Nexus/DockerHub registry
        IMAGE_NAME_BACKEND = "spring-boot-backend"
        IMAGE_NAME_FRONTEND = "react-frontend"
        DOCKERHUB_CREDENTIALS = 'docker-cred'   // Jenkins credential ID for DockerHub/Nexus
>>>>>>> 02ac8caa (Add backend, frontend, docker-compose, and Jenkinsfile)
    }

    stages {
        stage('Checkout') {
            steps {
<<<<<<< HEAD
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
=======
                git branch: 'main', url: 'https://github.com/your-repo.git'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'cd backend && ./mvnw test'
                sh 'cd frontend && npm install && npm test -- --watchAll=false'
            }
        }

        stage('Security Scan') {
            steps {
                echo "Running Bandit scan (placeholder)..."
                sh 'bandit -r backend || true'  // install Bandit in Jenkins agent first
>>>>>>> 02ac8caa (Add backend, frontend, docker-compose, and Jenkinsfile)
            }
        }

        stage('Build Docker Images') {
            steps {
<<<<<<< HEAD
                sh """
                    docker build -t $REGISTRY/$FRONTEND_IMAGE:\${BUILD_NUMBER} ./frontend
                    docker build -t $REGISTRY/$BACKEND_IMAGE:\${BUILD_NUMBER} ./backend
                """
=======
                script {
                    sh "docker build -t $REGISTRY/$IMAGE_NAME_BACKEND:${BUILD_NUMBER} ./backend"
                    sh "docker build -t $REGISTRY/$IMAGE_NAME_FRONTEND:${BUILD_NUMBER} ./frontend"
                }
>>>>>>> 02ac8caa (Add backend, frontend, docker-compose, and Jenkinsfile)
            }
        }

        stage('Push Docker Images') {
            steps {
<<<<<<< HEAD
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
=======
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "echo $PASS | docker login -u $USER --password-stdin $REGISTRY"
                    sh "docker push $REGISTRY/$IMAGE_NAME_BACKEND:${BUILD_NUMBER}"
                    sh "docker push $REGISTRY/$IMAGE_NAME_FRONTEND:${BUILD_NUMBER}"
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed, check logs."
        }
    }
}

>>>>>>> 02ac8caa (Add backend, frontend, docker-compose, and Jenkinsfile)
