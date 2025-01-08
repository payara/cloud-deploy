# Payara Cloud Deployment GitHub Action

This repository contains a GitHub Action to automate the deployment of your application to Payara Cloud using the Payara Cloud CLI (PCL). The action allows you to deploy a .war file to Payara Cloud by specifying various parameters like the subscription id, namespace, app name, and artifact location.

### Features
- Deploy Java applications to Payara Cloud. 
- Accepts manual inputs for deployment parameters.

---
## Inputs

- `cloud_subscription_id`: **Required**. The subscription ID of your Payara Cloud account.
- `namespace`: **Required**. The namespace under which your app will be deployed (e.g., your-namespace). 
- `app_name`: **Required**. The name of the app to deploy (e.g., your-app). 
- `artifact_location`: **Required**. The path to the .war file to deploy (e.g., ./target/my-app.war).

## Outputs

`deployment-status`
The status of the deployment, indicating whether it was successful or failed.

## Example Usage

```yaml
uses: payara/actions/cloud-deploy@v1
with:
    cloud_subscription_id: 'your-subscription-id'
    namespace: 'your-namespace'
    app_name: 'your-app'
    artifact_location: 'your-artifact.war'
```
