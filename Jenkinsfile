pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        DOCKERHUB_USER = 'kshitijnk007'
        BACKEND_IMAGE = "${DOCKERHUB_USER}/devship-backend:latest"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/devship-frontend:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    script {
                        bat "docker build -t ${BACKEND_IMAGE} ."
                    }
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        bat "docker build -t ${FRONTEND_IMAGE} ."
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    bat "docker login -u ${DOCKERHUB_USER} -p ${DOCKERHUB_CREDENTIALS_PSW}"
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                script {
                    bat "docker push ${BACKEND_IMAGE}"
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                script {
                    bat "docker push ${FRONTEND_IMAGE}"
                }
            }
        }
    }
}