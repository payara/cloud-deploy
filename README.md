# Payara Cloud Deployment GitHub Action

This repository contains a GitHub Action to automate the deployment of your application to Payara Cloud using the Payara Cloud CLI (PCL). The action allows you to deploy a .jar or .war file to Payara Cloud by specifying various parameters like the namespace, app name, and artifact location.

### Features
- Deploy Java applications to Payara Cloud. 
- Accepts manual inputs for deployment parameters.

---
## How to Use the Workflow

### Trigger the Workflow
1. Go to the **Actions** tab in your GitHub repository. 
2. Select the **Deploy to Payara Cloud** workflow from the list. 
3. Click **Run workflow**.


### Provide Input Parameters
When prompted, fill in the following inputs:

- `cloud_subscription_id`: The subscription ID of your Payara Cloud account.
- `namespace`: The namespace under which your app will be deployed (e.g., your-namespace). 
- `app_name`: The name of the app to deploy (e.g., your-app). 
- `artifact_location`: The path to the .war file to deploy (e.g., ./target/my-app.war).

After providing the inputs, click Run workflow to trigger the deployment.

