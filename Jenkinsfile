#!groovy

node {

  // Variables
  def tokens = "${env.JOB_NAME}".tokenize('/')
  def appName = tokens[0]
  def dockerUsername = "${DOCKER_WRI_USERNAME}"
  def imageTag = "${dockerUsername}/${appName}:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"

  currentBuild.result = "SUCCESS"

  def secretKey = UUID.randomUUID().toString().replaceAll('-','')

  checkout scm
  properties([pipelineTriggers([[$class: 'GitHubPushTrigger']])])

  try {

    stage ('Build docker') {
      switch ("${env.BRANCH_NAME}") {
        case "develop":
          sh("docker -H :2375 build --build-arg secretKey=${secretKey} --build-arg RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} --build-arg RW_MAPBOX_API_TOKEN=${env.RW_MAPBOX_API_TOKEN} --build-arg apiEnv=production --build-arg --build-arg wriApiUrl=https://staging-api.resourcewatch.org --build-arg --build-arg callbackUrl=https://staging.resourcewatch.org/auth --build-arg -t ${imageTag} .")
          break
        case "preproduction":
          sh("docker -H :2375 build --build-arg secretKey=${secretKey} --build-arg RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} --build-arg RW_MAPBOX_API_TOKEN=${env.RW_MAPBOX_API_TOKEN} --build-arg apiEnv=production --build-arg callbackUrl=https://preproduction.resourcewatch.org/auth -t ${imageTag} .")
          break
        case "master":
          sh("docker -H :2375 build --build-arg secretKey=${secretKey} --build-arg RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} --build-arg RW_MAPBOX_API_TOKEN=${env.RW_MAPBOX_API_TOKEN} -t ${imageTag} -t ${dockerUsername}/${appName}:latest .")
        default:
          sh("echo NOT DEPLOYED")
          currentBuild.result = 'SUCCESS'
      }
    }

    stage ('Run Tests') {
     sh('docker-compose -H :2375 -f docker-compose-test.yml build')
     sh('docker-compose -H :2375 -f docker-compose-test.yml run --rm cypress')
     sh('docker-compose -H :2375 -f docker-compose-test.yml stop')
    }

    stage('Push Docker') {
      withCredentials([usernamePassword(credentialsId: 'WRI Docker Hub', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
        sh("docker -H :2375 login -u ${DOCKER_HUB_USERNAME} -p '${DOCKER_HUB_PASSWORD}'")
        sh("docker -H :2375 push ${imageTag}")
        if ("${env.BRANCH_NAME}" == 'master') {
          sh("docker -H :2375 push ${dockerUsername}/${appName}:latest")
        }
        sh("docker -H :2375 rmi ${imageTag}")
      }
    }

    stage ("Deploy Application") {
      switch ("${env.BRANCH_NAME}") {

        // Roll out to production
        case "develop":
          sh("echo Deploying to PROD cluster")
          sh("kubectl config use-context ${KUBECTL_CONTEXT_PREFIX}_${CLOUD_PROJECT_NAME}_${CLOUD_PROJECT_ZONE}_${KUBE_PROD_CLUSTER}")
          sh("kubectl apply -f k8s/staging/")
          sh("kubectl set image deployment ${appName}-staging ${appName}-staging=${imageTag} --namespace=rw --record")
          break

        case "preproduction":
          sh("echo Deploying to PROD cluster")
          sh("kubectl config use-context ${KUBECTL_CONTEXT_PREFIX}_${CLOUD_PROJECT_NAME}_${CLOUD_PROJECT_ZONE}_${KUBE_PROD_CLUSTER}")
          sh("kubectl apply -f k8s/preproduction/")
          sh("kubectl set image deployment ${appName}-preproduction ${appName}-preproduction=${imageTag} --namespace=rw --record")
          break

        // Roll out to production
        case "master":
          def userInput = true
          def didTimeout = false
          try {
            timeout(time: 60, unit: 'SECONDS') {
              userInput = input(
                id: 'Proceed1', message: 'Confirm deployment', parameters: [
                [$class: 'BooleanParameterDefinition', defaultValue: true, description: '', name: 'Please confirm you agree with this deployment']
              ])
            }
          }
          catch(err) { // timeout reached or input false
              sh("echo Aborted by user or timeout")
              if('SYSTEM' == user.toString()) { // SYSTEM means timeout.
                  didTimeout = true
              } else {
                  userInput = false
              }
          }
          if (userInput == true && !didTimeout){
            sh("echo Deploying to PROD cluster")
            sh("kubectl config use-context ${KUBECTL_CONTEXT_PREFIX}_${CLOUD_PROJECT_NAME}_${CLOUD_PROJECT_ZONE}_${KUBE_PROD_CLUSTER}")
            sh("kubectl apply -f k8s/production/")
            sh("kubectl set image deployment ${appName} ${appName}=${imageTag} --namespace=rw --record")
          } else {
            sh("echo NOT DEPLOYED")
            currentBuild.result = 'SUCCESS'
          }
          break

        // Default behavior?
        default:
          echo "Default -> do nothing"
          currentBuild.result = "SUCCESS"
      }
    }

  } catch (err) {

    currentBuild.result = "FAILURE"
    throw err
  }

}
