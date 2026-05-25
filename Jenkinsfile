pipeline {

    agent any

    environment {
        DOCKER_REGISTRY = "bhagya1304"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {

            steps {

                git branch: 'main',
                url: 'https://github.com/bhagyalakshmi35023/microservice-project.git'

            }
        }

        stage('Build & Push - order-service') {

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    sh '''
                    echo $DOCKER_PASS | docker login \
                    -u $DOCKER_USER \
                    --password-stdin

                    docker build \
                    --build-arg SERVICE_DIR=order-service \
                    -t ${DOCKER_REGISTRY}/order-service:${IMAGE_TAG} .

                    docker push \
                    ${DOCKER_REGISTRY}/order-service:${IMAGE_TAG}
                    '''
                }
            }
        }

    }

    post {

        success {
            echo "✅ Build Success"
        }

        failure {
            echo "❌ Pipeline Failed"
        }

    }

}