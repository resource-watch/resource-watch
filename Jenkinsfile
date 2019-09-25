#!groovy

node {

  // Actions
  def forceCompleteDeploy = false
  try {
    timeout(time: 15, unit: 'SECONDS') {
      forceCompleteDeploy = input(
        id: 'Proceed0', message: 'Force COMPLETE Deployment', parameters: [
        [$class: 'BooleanParameterDefinition', defaultValue: true, description: '', name: 'Please confirm you want to recreate services and deployments']
      ])
    }
  }
  catch(err) { // timeout reached or input false
      // nothing
  }

  // Variables
  def tokens = "${env.JOB_NAME}".tokenize('/')
  def appName = tokens[0]
  def dockerUsername = "${DOCKER_USERNAME}"
  def imageTag = "${dockerUsername}/${appName}:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"

  currentBuild.result = "SUCCESS"

  def secretKey = UUID.randomUUID().toString().replaceAll('-','')

  checkout scm
  properties([pipelineTriggers([[$class: 'GitHubPushTrigger']])])

  try {

    stage ('Build docker') {
      switch ("${env.BRANCH_NAME}") {
        case "develop":
          sh("docker -H :2375 build -t ${imageTag} --build-arg secretKey=${secretKey} --build-arg RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} --build-arg apiEnv=production,preproduction --build-arg apiUrl=https://staging.resourcewatch.org/api --build-arg wriApiUrl=https://staging-api.globalforestwatch.org/v1 --build-arg callbackUrl=https://staging.resourcewatch.org/auth --build-arg controlTowerUrl=https://staging-api.globalforestwatch.org .")
          break
        case "mapbox":
          sh("docker -H :2375 build -t ${imageTag} --build-arg secretKey=${secretKey} --build-arg RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} MAPBOX_API_TOKEN=${env.MAPBOX_API_TOKEN} --build-arg apiEnv=production,preproduction --build-arg apiUrl=https://staging.resourcewatch.org/api --build-arg wriApiUrl=https://staging-api.globalforestwatch.org/v1 --build-arg callbackUrl=https://staging.resourcewatch.org/auth --build-arg controlTowerUrl=https://staging-api.globalforestwatch.org .")
          break
        case "preproduction":
          sh("docker -H :2375 build -t ${imageTag} --build-arg secretKey=${secretKey} --build-arg RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} --build-arg apiEnv=production,preproduction --build-arg callbackUrl=https://preproduction.resourcewatch.org/auth .")
          break
        default:
          sh("docker -H :2375 build --build-arg secretKey=${secretKey} --build-arg RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} -t ${imageTag} .")
          sh("docker -H :2375 build --build-arg secretKey=${secretKey} --build-arg RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} -t ${dockerUsername}/${appName}:latest .")
      }
    }

    stage ('Run Tests') {
    //  sh('docker-compose -H :2375 -f docker-compose-test.yml build')
    //  sh('docker-compose -H :2375 -f docker-compose-test.yml run --rm test')
    //  sh('docker-compose -H :2375 -f docker-compose-test.yml stop')
    }

    stage('Push Docker') {
      withCredentials([usernamePassword(credentialsId: 'Vizzuality Docker Hub', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
        sh("docker -H :2375 login -u ${DOCKER_HUB_USERNAME} -p ${DOCKER_HUB_PASSWORD}")
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
          sh("echo Deploying to STAGING cluster")
          sh("kubectl config use-context gke_${GCLOUD_PROJECT}_${GCLOUD_GCE_ZONE}_${KUBE_PROD_CLUSTER}")
          def service = sh([returnStdout: true, script: "kubectl get deploy ${appName}-staging --namespace=rw || echo NotFound"]).trim()
          if ((service && service.indexOf("NotFound") > -1) || (forceCompleteDeploy)){
            sh("sed -i -e 's/{name}/${appName}/g' k8s/staging/*.yaml")
            sh("kubectl apply -f k8s/staging/")
          }
          sh("kubectl set image deployment ${appName}-staging ${appName}-staging=${imageTag} --namespace=rw --record")
          break

        case "preproduction":
          sh("echo Deploying to PROD cluster")
          sh("kubectl config use-context gke_${GCLOUD_PROJECT}_${GCLOUD_GCE_ZONE}_${KUBE_PROD_CLUSTER}")
          def service = sh([returnStdout: true, script: "kubectl get deploy ${appName}-preproduction --namespace=rw || echo NotFound"]).trim()
          if ((service && service.indexOf("NotFound") > -1) || (forceCompleteDeploy)){
            sh("sed -i -e 's/{name}/${appName}/g' k8s/preproduction/*.yaml")
            sh("kubectl apply -f k8s/preproduction/")
          }
          sh("kubectl set image deployment ${appName}-preproduction ${appName}-preproduction=${imageTag} --namespace=rw --record")
          break

        // Roll out to production
        case "mapbox":
          sh("echo Deploying to STAGING cluster")
          sh("kubectl config use-context gke_${GCLOUD_PROJECT}_${GCLOUD_GCE_ZONE}_${KUBE_PROD_CLUSTER}")
          def service = sh([returnStdout: true, script: "kubectl get deploy ${appName}-mapbox --namespace=rw || echo NotFound"]).trim()
          if ((service && service.indexOf("NotFound") > -1) || (forceCompleteDeploy)){
            sh("sed -i -e 's/{name}/${appName}/g' k8s/mapbox/*.yaml")
            sh("kubectl apply -f k8s/mapbox/")
          }
          sh("kubectl set image deployment ${appName}-mapbox ${appName}-mapbox=${imageTag} --namespace=rw --record")
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
            sh("kubectl config use-context gke_${GCLOUD_PROJECT}_${GCLOUD_GCE_ZONE}_${KUBE_PROD_CLUSTER}")
            def service = sh([returnStdout: true, script: "kubectl get deploy ${appName} --namespace=rw || echo NotFound"]).trim()
            if ((service && service.indexOf("NotFound") > -1) || (forceCompleteDeploy)){
              sh("sed -i -e 's/{name}/${appName}/g' k8s/production/*.yaml")
              sh("kubectl apply -f k8s/production/")
            }
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

    // Notify Success
    slackSend (color: '#00FF00', channel: '#resourcewatch-jenkins', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
    emailext (
      subject: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      body: """<p>SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
        <p>Check console output at "<a href="${env.BUILD_URL}">${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>"</p>""",
      recipientProviders: [[$class: 'DevelopersRecipientProvider']]
    )


  } catch (err) {

    currentBuild.result = "FAILURE"
    // Notify Error
    slackSend (color: '#FF0000', channel: '#resourcewatch-jenkins', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
    emailext (
      subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
        <p>Check console output at "<a href="${env.BUILD_URL}">${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>"</p>""",
      recipientProviders: [[$class: 'DevelopersRecipientProvider']]
    )
    throw err
  }

}
