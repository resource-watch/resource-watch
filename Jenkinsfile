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

    // stage ('Run Tests') {
    //  sh('docker-compose -H :2375 -f docker-compose-test.yml build --build-arg NEXTAUTH_URL=http://frontend-test-server:3000')
    //  sh('docker-compose -H :2375 -f docker-compose-test.yml up --abort-on-container-exit --exit-code-from cypress cypress frontend-test-server')
    //  sh('docker-compose -H :2375 -f docker-compose-test.yml up --abort-on-container-exit --exit-code-from backend-test backend-test')
    //  sh('docker-compose -H :2375 -f docker-compose-test.yml down -v')
    // }

    stage ('Build docker') {
      switch ("${env.BRANCH_NAME}") {
        case "develop":
          sh("docker -H :2375 build --build-arg secretKey=${secretKey} --build-arg NEXT_PUBLIC_RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} --build-arg NEXT_PUBLIC_RW_MAPBOX_API_TOKEN=${env.RW_MAPBOX_API_TOKEN} --build-arg NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN=${env.NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN} --build-arg NEXT_PUBLIC_API_ENV=staging --build-arg NEXT_PUBLIC_ENVS_SHOW=staging,production --build-arg NEXT_PUBLIC_ENVS_EDIT=staging --build-arg NEXT_PUBLIC_AUTH_CALLBACK=https://staging.resourcewatch.org/auth-callback  --build-arg NEXTAUTH_URL=https://staging.resourcewatch.org --build-arg NEXTAUTH_JWT_SECRET=${env.RW_NEXTAUTH_JWT_SECRET} --build-arg NEXT_PUBLIC_GOOGLE_ANALYTICS_V4_ID=G-PTF4BE2G4G --build-arg NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID=GTM-WQBRPVH  -t ${imageTag} .")
          break
        case "preproduction":
          sh("docker -H :2375 build --build-arg secretKey=${secretKey} --build-arg NEXT_PUBLIC_RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} --build-arg NEXT_PUBLIC_RW_MAPBOX_API_TOKEN=${env.RW_MAPBOX_API_TOKEN} --build-arg NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN=${env.NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN} --build-arg NEXT_PUBLIC_API_ENV=preproduction --build-arg  NEXT_PUBLIC_ENVS_SHOW=preproduction,production --build-arg NEXT_PUBLIC_ENVS_EDIT=preproduction --build-arg NEXTAUTH_URL=https://preproduction.resourcewatch.org --build-arg NEXTAUTH_JWT_SECRET=${env.RW_NEXTAUTH_JWT_SECRET} --build-arg NEXT_PUBLIC_AUTH_CALLBACK=https://preproduction.resourcewatch.org/auth-callback --build-arg NEXT_PUBLIC_FEATURE_FLAG_GEDC_DASHBOARD=true -t ${imageTag} .")
          break
        case "master":
          sh("docker -H :2375 build --build-arg secretKey=${secretKey} --build-arg NEXT_PUBLIC_RW_GOGGLE_API_TOKEN_SHORTENER=${env.RW_GOGGLE_API_TOKEN_SHORTENER} --build-arg NEXT_PUBLIC_RW_MAPBOX_API_TOKEN=${env.RW_MAPBOX_API_TOKEN} --build-arg NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN=${env.NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN} --build-arg NEXT_PUBLIC_FEATURE_FLAG_GEDC_DASHBOARD=true --build-arg NEXTAUTH_URL=https://resourcewatch.org --build-arg NEXTAUTH_JWT_SECRET=${env.RW_NEXTAUTH_JWT_SECRET} -t ${imageTag} -t ${dockerUsername}/${appName}:latest .")
        default:
          sh("echo NOT DEPLOYED")
          currentBuild.result = 'SUCCESS'
      }
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
          if ("${SKIP_DEPLOYMENT_CONFIRMATION}" != "true") {
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
          }
          if ((userInput == true && !didTimeout) || "${SKIP_DEPLOYMENT_CONFIRMATION}" != "true") {
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
