/*
a. Action Inputs
token: GitHub Secrets (PCL_AUTH_TOKEN), required for authenticating to Payara Cloud.

namespace: The namespace in which the application should be deployed.

app_name: The application name to associate with the WAR file.

artifact: The path to the WAR file that should be uploaded and deployed.

pcl_version: (Optional) The version of PCL to use, defaulting to 1.0.1.

b. Download PCL Binary
Objective: Download the PCL binary from the Payara Cloud repository.

Steps:

Use axios to download the PCL binary (ZIP file).

Save it to a temporary location.

c. Extract PCL Binary
Objective: Unzip the downloaded PCL binary to a directory for use.

Steps:

Use the unzipper library to extract the ZIP file to a designated folder.

d. Upload the WAR File to Payara Cloud
Objective: Upload the WAR file to Payara Cloud using the pcl upload command.

Steps:

Execute the pcl upload command with the necessary arguments (namespace, app name, WAR file).

e. Deploy the Application
Objective: Deploy the application to Payara Cloud using the pcl deploy command.

Steps:

Execute the pcl deploy command to trigger the deployment.

3. Key Libraries/Modules to Use
@actions/core: For managing inputs, outputs, and logging.

@actions/exec: For running shell commands like pcl upload and pcl deploy.

axios: For downloading PCL binaries.

unzipper: For extracting PCL binaries.
 */
