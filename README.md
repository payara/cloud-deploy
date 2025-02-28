# Payara Cloud Deployment GitHub Action

This repository contains a GitHub Action that automates deploying Jakarta EE and MicroProfile applications to Payara Cloud using the Payara Cloud CLI (PCL). It lets you deploy .war files by specifying parameters like subscription ID, namespace, app name, and artifact location.

## Features
- Upload and deploy Jakarta EE and MicroProfile applications to Payara Cloud

## Inputs
- `token`: **Required**. Payara Cloud CLI token. Generate by running `pcl login --print-token`.
- `subscription_name`: **Optional**. Only needed if you have multiple subscriptions.
- `namespace`: **Required**. Deployment namespace (e.g., testing).
- `app_name`: **Optional**. App name for deployment. If not specified, inferred from the WAR filename.
- `artifact_location`: **Required**. Path to the .war file (e.g., ./target/my-app.war).
- `deploy`: **Optional**. Set `false` to upload only without immediate deployment. Set `true` to upload and deploy immediately in one step.
- `pcl_version`: **Optional**. Payara Cloud CLI version. Default: '1.1.0'.

## Example Usage
```yaml
uses: payara/cloud-deploy@v1
with:
    token: ${{ secrets.PCL_TOKEN }}
    subscription_name: 'your-subscription-name'
    namespace: 'testing'
    app_name: 'amazing-app'
    artifact_location: 'amz.war'
    deploy: true
```

## Reference
Payara Cloud CLI user guide: https://docs.payara.fish/cloud/docs/cli/user-guide.html
