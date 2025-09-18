pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        FRONTEND_IMAGE  = "sathwikavaranasi/frontend"
        BACKEND_IMAGE   = "sathwikavaranasi/backend"
        SONAR_HOST_URL  = "http://your-sonarqube-server" // <-- Add this
        SONAR_AUTH_TOKEN = credentials('sonarqube-token') // <-- Use Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-org/your-repo.git'
                checkout scm
            }
        }

        stage('Build & Test - Backend') {
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

        stage('Build & Test - Frontend') {
            steps {
                dir('frontend') {
                    sh """
                        export PATH=$NODE_HOME/bin:$PATH
                        npm install
                        npm run test -- --watchAll=false --ci
                    """
                }
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
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                    docker build -t $REGISTRY/$FRONTEND_IMAGE:\${BUILD_NUMBER} ./frontend
                    docker build -t $REGISTRY/$BACKEND_IMAGE:\${BUILD_NUMBER} ./backend

                    docker build -t $REGISTRY/$FRONTEND_IMAGE:${BUILD_NUMBER} ./frontend
                    docker build -t $REGISTRY/$BACKEND_IMAGE:${BUILD_NUMBER} ./backend
                """

                script {
                    sh "docker build -t $REGISTRY/$IMAGE_NAME_BACKEND:${BUILD_NUMBER} ./backend"
                    sh "docker build -t $REGISTRY/$IMAGE_NAME_FRONTEND:${BUILD_NUMBER} ./frontend"
                }
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
            when { expression { fileExists('tests/e2e') } }
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

        stage('Build') {
            steps {
                echo 'Building the project...'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the app...'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        FRONTEND_IMAGE  = "sathwikavaranasi/frontend"
        BACKEND_IMAGE   = "sathwikavaranasi/backend"
        SONAR_HOST_URL  = "http://your-sonarqube-server" // <-- Add this
        SONAR_AUTH_TOKEN = credentials('sonarqube-token') // <-- Use Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-org/your-repo.git'
                checkout scm
            }
        }

        stage('Build & Test - Backend') {
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

        stage('Build & Test - Frontend') {
            steps {
                dir('frontend') {
                    sh """
                        export PATH=$NODE_HOME/bin:$PATH
                        npm install
                        npm run test -- --watchAll=false --ci
                    """
                }
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
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                    docker build -t $REGISTRY/$FRONTEND_IMAGE:\${BUILD_NUMBER} ./frontend
                    docker build -t $REGISTRY/$BACKEND_IMAGE:\${BUILD_NUMBER} ./backend

                    docker build -t $REGISTRY/$FRONTEND_IMAGE:${BUILD_NUMBER} ./frontend
                    docker build -t $REGISTRY/$BACKEND_IMAGE:${BUILD_NUMBER} ./backend
                """

                script {
                    sh "docker build -t $REGISTRY/$IMAGE_NAME_BACKEND:${BUILD_NUMBER} ./backend"
                    sh "docker build -t $REGISTRY/$IMAGE_NAME_FRONTEND:${BUILD_NUMBER} ./frontend"
                }
            }
        }

        stage('Push Docker Images') {
            steps {
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

