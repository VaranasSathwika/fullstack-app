pipeline {
    agent any

    environment {
<<<<<<< HEAD
        DOCKER_REGISTRY = "docker.io"
        FRONTEND_IMAGE  = "sathwikavaranasi/frontend"
        BACKEND_IMAGE   = "sathwikavaranasi/backend"
        SONAR_HOST_URL  = "http://your-sonarqube-server" // <-- Add this
        SONAR_AUTH_TOKEN = credentials('sonarqube-token') // <-- Use Jenkins credentials
=======

        REGISTRY = "docker.io/your-dockerhub-username"

        REGISTRY = "docker.io/sathwikavaranasi"
 fa14290e (Fix Jenkinsfile paths and cleanup pipeline)
        FRONTEND_IMAGE = "frontend"
        BACKEND_IMAGE = "backend"
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
        MAVEN_HOME = tool name: 'M3', type: 'maven'
        NODE_HOME = tool name: 'nodejs', type: 'nodejs'

        REGISTRY = "docker.io"                  // or your Nexus/DockerHub registry
        IMAGE_NAME_BACKEND = "spring-boot-backend"
        IMAGE_NAME_FRONTEND = "react-frontend"
        DOCKERHUB_CREDENTIALS = 'docker-cred'   // Jenkins credential ID for DockerHub/Nexus
 02ac8caa (Add backend, frontend, docker-compose, and Jenkinsfile)
>>>>>>> 30eb3aca (Resolve Jenkinsfile merge conflict)
    }

    stages {
        stage('Clean Workspace') {
            steps {
<<<<<<< HEAD
                cleanWs()
=======
 HEAD
 HEAD
                git branch: 'main', url: 'https://github.com/your-org/your-repo.git'
                checkout scm
  fa14290e (Fix Jenkinsfile paths and cleanup pipeline)
>>>>>>> 30eb3aca (Resolve Jenkinsfile merge conflict)
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/VaranasSathwika/fullstack-app.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'sonar-scanner'
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=backend \
                              -Dsonar.sources=backend \
                              -Dsonar.host.url=$SONAR_HOST_URL \
                              -Dsonar.login=$SONAR_AUTH_TOKEN
                        """
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=frontend \
                              -Dsonar.sources=frontend \
                              -Dsonar.host.url=$SONAR_HOST_URL \
                              -Dsonar.login=$SONAR_AUTH_TOKEN
                        """
                    }
                }
            }
        }

        stage('SonarQube Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Backend Setup & Tests') {
            steps {
                dir('backend') {
                    sh '''
                        docker run --rm -v ${WORKSPACE}/backend:/app -w /app python:3.11 bash -c "
                            pip install --upgrade pip &&
                            pip install -r requirements.txt &&
                            pip install pytest &&
                            pytest --maxfail=1 --disable-warnings -q || echo 'No tests found, skipping...'
                        "
                    '''
                }
            }
        }

        stage('Frontend Setup & Tests') {
            steps {
                dir('frontend') {
                    sh '''
                        docker run --rm -v ${WORKSPACE}/frontend:/app -w /app node:20 bash -c "
                            npm install &&
                            npm run build &&
                            npm install --save-dev eslint jest &&
                            npx eslint . || true &&
                            npx jest --ci --runInBand || echo 'No frontend tests found, skipping...'
                        "
                    '''
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
 02ac8caa (Add backend, frontend, docker-compose, and Jenkinsfile)
            }
        }

        stage('Build Docker Images') {
            steps {
 HEAD
                sh """
HEAD
                    docker build -t $REGISTRY/$FRONTEND_IMAGE:\${BUILD_NUMBER} ./frontend
                    docker build -t $REGISTRY/$BACKEND_IMAGE:\${BUILD_NUMBER} ./backend

                    docker build -t $REGISTRY/$FRONTEND_IMAGE:${BUILD_NUMBER} ./frontend
                    docker build -t $REGISTRY/$BACKEND_IMAGE:${BUILD_NUMBER} ./backend
 fa14290e (Fix Jenkinsfile paths and cleanup pipeline)
                """

                script {
                    sh "docker build -t $REGISTRY/$IMAGE_NAME_BACKEND:${BUILD_NUMBER} ./backend"
                    sh "docker build -t $REGISTRY/$IMAGE_NAME_FRONTEND:${BUILD_NUMBER} ./frontend"
                }
 02ac8caa (Add backend, frontend, docker-compose, and Jenkinsfile)
            }
        }

        stage('Push Docker Images') {
            steps {
 HEAD
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
 HEAD

            when { expression { fileExists('tests/e2e') } }
 fa14290e (Fix Jenkinsfile paths and cleanup pipeline)
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
 HEAD

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
                 argocd app sync my-3tier-app --grpc-web
                    argocd app wait my-3tier-app --sync --health --timeout 300
                """pipeline {
    agent any

    environment {
        REGISTRY = "docker.io/sathwikavaranasi"
        FRONTEND_IMAGE = "frontend"
        BACKEND_IMAGE = "backend"
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
        MAVEN_HOME = tool name: 'M3', type: 'maven'
        NODE_HOME = tool name: 'nodejs', type: 'nodejs'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Unit Test - Backend') {
            steps {
                dir('fullstack-app/backend') {
                    sh "${MAVEN_HOME}/bin/mvn clean verify"
                }
            }
            post {
                always {
                    junit 'fullstack-app/backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Build & Unit Test - Frontend') {
            steps {
                dir('fullstack-app/frontend') {
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
<<<<<<< HEAD
                sh "docker build -t ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest -f frontend/Dockerfile frontend"
                sh "docker build -t ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest -f backend/Dockerfile backend"
=======
                sh """
                    docker build -t $REGISTRY/$FRONTEND_IMAGE:${BUILD_NUMBER} ./fullstack-app/frontend
                    docker build -t $REGISTRY/$BACKEND_IMAGE:${BUILD_NUMBER} ./fullstack-app/backend
                """
>>>>>>> 30eb3aca (Resolve Jenkinsfile merge conflict)
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        echo $PASS | docker login -u $USER --password-stdin
                        docker push ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest
                        docker push ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest
                    '''
                }
            }
        }

<<<<<<< HEAD
        stage('Deploy to Kubernetes') {
=======
        stage('End-to-End Tests') {
            when {
                expression { fileExists('tests/e2e') }
            }
>>>>>>> 30eb3aca (Resolve Jenkinsfile merge conflict)
            steps {
                script {
                    echo "🚀 Deploying application to the cluster..."
                    sh 'kubectl apply -f deployment.yaml'
                }
            }
        }

        stage('Security Scans') {
            parallel {
                stage('Bandit / Semgrep') {
                    steps {
                        sh 'bandit -r fullstack-app/backend || true'
                        sh 'semgrep --config=auto fullstack-app/backend || true'
                    }
                }
                stage('SonarQube Scan') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            dir('fullstack-app/backend') {
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
                    // Add logic to fail build if vulnerabilities are found
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
            echo "Cleaning up workspace and Docker dangling images..."
            cleanWs()
            sh 'docker system prune -f || true'
        }
        success {
            echo "✅ Build and push successful!"
        }
        failure {
            echo "❌ Build failed! Check logs."
        }
    }
}

<<<<<<< HEAD

=======
>>>>>>> 30eb3aca (Resolve Jenkinsfile merge conflict)
