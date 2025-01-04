# Project Recommended Settings VSCode Extension

This extension is for developers who work in a team and want to promote VSCode settings to team members.

Adding settings to `.vscode/settings.json` enforces the settings to every user with the user having no way of overriding them. This extension provides a less intrusive way of promoting setting user by letting them load these settings to their User settings instead.

## Usage

Keep a file named `recommended-settings.json` in your repository containing the settings that you want to promote to your team members.

```json
{
  "files.autoSave": true,
  "editor.formatOnSave": true
}
```

A Notification is displayed when a workspace is loaded that contains the file, offerring team members to load the specified settings like below.

![image](https://github.com/user-attachments/assets/613f7515-5fc6-43d8-92a3-3aec33f97778)

CLicking "Yes" loads the settings to User settings.

The settings can also be loaded by activating the command "Load Project Recommended Settings".

![image](https://github.com/user-attachments/assets/ab50429d-b352-43be-89e1-262832730550)

## Attribution

### Icon

The icon for this extension uses assets from [Visual Studio Code icons](https://github.com/microsoft/vscode-icons), which is licensed under _Creative Commons Attribution 4.0 International_ by Microsoft.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

### Icon License

The icon for this extension is licensed under the Creative Commons Attribution 4.0 International License. See the [LICENSE-ICON](LICENSE-ICON) file for more details.
