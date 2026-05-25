pipeline {

    agent any

    environment {
        DOCKER_REGISTRY = "bhagya1304"
        IMAGE_TAG = "${BUILD_NUMBER}"
        GITOPS_REPO = "https://github.com/bhagyalakshmi35023/microservice-gitops.git"
        GITOPS_FILE = "order-service/deployment.yaml"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/bhagyalakshmi35023/order-service.git'
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
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker build --build-arg SERVICE_DIR=order-service \
                            -t ${DOCKER_REGISTRY}/order-service:${IMAGE_TAG} .
                        docker push ${DOCKER_REGISTRY}/order-service:${IMAGE_TAG}
                    '''
                }
            }
        }

        // ✅ NEW STAGE — updates the GitOps manifest
        stage('Update GitOps Manifest') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-credentials',   // add this credential in Jenkins
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {
                    sh '''
                        # Clone the GitOps repo
                        git clone https://${GIT_USER}:${GIT_TOKEN}@github.com/bhagyalakshmi35023/microservice-gitops.git
                        cd microservice-gitops

                        # Replace the image tag using sed
                        sed -i "s|${DOCKER_REGISTRY}/order-service:.*|${DOCKER_REGISTRY}/order-service:${IMAGE_TAG}|g" \
                            ${GITOPS_FILE}

                        # Commit and push
                        git config user.email "jenkins@ci.local"
                        git config user.name "Jenkins"
                        git add ${GITOPS_FILE}
                        git commit -m "ci: update order-service image to :${IMAGE_TAG} [skip ci]"
                        git push origin main
                    '''
                }
            }
        }

    }

    post {
        success { echo "✅ Build & Deploy Triggered" }
        failure { echo "❌ Pipeline Failed" }
    }
}