# Payara Cloud Deployment GitHub Action

This repository contains a GitHub Action to automate the deployment of your application to Payara Cloud using the Payara Cloud CLI (PCL). The action allows you to deploy a .war file to Payara Cloud by specifying various parameters like the subscription id, namespace, app name, and artifact location.

### Features
- Upload artifacts to Payara Cloud.
- Deploy Java applications to Payara Cloud. 

---
## Prerequisites
Make sure to include `actions/setup-java` in your workflow to install and configure Java.

```yaml
name: Set up JDK
uses: actions/setup-java@v4
with:
  java-version: '21'
  distribution: 'zulu'
```

## Inputs

- `token`: **Required**. The Payara Cloud CLI token. You can create a token by running `pcl login --print-token` and following the instructions.
- `subscription_name`: **Optional**. Only required if your account has access to multiple subscriptions. Provide the subscription name to specify which subscription to use.
- `namespace`: **Required**. The namespace under which your app will be deployed (e.g., your-namespace). 
- `app_name`: **Optional**. The name of the app to deploy (e.g., your-app). 
- `artifact_location`: **Required**. The path to the .war file to deploy (e.g., ./target/my-app.war).
- `deploy`: **Optional**. Set to `false` if the application should only be uploaded to Payara Cloud, but not deployed. Default is `true`.
- `pcl_version`: **Optional**. The version of the Payara Cloud CLI to use. Default is '1.1.0'.

## Example Usage

```yaml
uses: payara/actions/cloud-deploy@v1
with:
    token: ${{ secrets.PCL_TOKEN }}
    subscription_name: 'your-subscription-name'
    namespace: 'your-namespace'
    app_name: 'your-app'
    artifact_location: 'your-artifact.war'
    deploy: 'true'
```
