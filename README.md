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

Team members can load these setttings by activating the command "Load Project Recommended Settings".

![image](https://github.com/user-attachments/assets/ab50429d-b352-43be-89e1-262832730550)

## Extension Settings

This extension contributes the following settings:

| Setting                                          | Type     | Default                     | Value Description                                                                               |
| ------------------------------------------------ | -------- | --------------------------- | ----------------------------------------------------------------------------------------------- |
| `recommended-settings.recommended-settings-file` | `string` | `recommended-settings.json` | Name of recommended settings file to load settings from. File should be under `.vscode` folder. |
