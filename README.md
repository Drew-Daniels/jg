# `jgit`

Utility functions for Jira and Git

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/jg.svg)](https://npmjs.org/package/jg)
[![Downloads/week](https://img.shields.io/npm/dw/jg.svg)](https://npmjs.org/package/jg)

<!-- toc -->

- [Dependencies](#dependencies)
- [Setup](#setup)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Dependencies

- [gh](https://github.com/cli/cli) - Used for interfacing with the GitHub API
- [jira.js](https://github.com/MrRefactoring/jira.js) - Used for interfacing with the Jira API
- [clipboardy](https://github.com/sindresorhus/clipboardy) - Used for copying to clipboard (cross-platform)

# Setup

## GitHub CLI

You will need to install the `gh` CLI and run `gh auth login` to authenticate with GitHub

## Jira API

You will need the following env vars set in your shell to authenticate with the Jira API:

```sh
# Your Organization's Jira instance
export JIRA_HOSTNAME="https://jira.example.com"
# Your Jira API token https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/
export JIRA_API_TOKEN="YOUR_JIRA_API_TOKEN"
# Your Organization's email address - Ex. <firstname><lastname>@<organization>.com
export JIRA_API_EMAIL="YOUR_JIRA_EMAIL"
```

# Usage

<!-- usage -->

```sh-session
$ npm install -g jg
$ jg COMMAND
running command...
$ jg (--version)
jg/0.0.0 darwin-arm64 node-v22.5.1
$ jg --help [COMMAND]
USAGE
  $ jg COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`jg id`](#jg-id)
- [`jg key`](#jg-key)
- [`jg url`](#jg-url)
- [`jg cc`](#jg-cc)
- [`jg bname`](#jg-bname)
- [`jg pr`](#jg-pr)
- [`jg help [COMMAND]`](#jg-help-command)
- [`jg plugins`](#jg-plugins)
- [`jg plugins add PLUGIN`](#jg-plugins-add-plugin)
- [`jg plugins:inspect PLUGIN...`](#jg-pluginsinspect-plugin)
- [`jg plugins install PLUGIN`](#jg-plugins-install-plugin)
- [`jg plugins link PATH`](#jg-plugins-link-path)
- [`jg plugins remove [PLUGIN]`](#jg-plugins-remove-plugin)
- [`jg plugins reset`](#jg-plugins-reset)
- [`jg plugins uninstall [PLUGIN]`](#jg-plugins-uninstall-plugin)
- [`jg plugins unlink [PLUGIN]`](#jg-plugins-unlink-plugin)
- [`jg plugins update`](#jg-plugins-update)

## `jg id`

Get Jira Issue ID from current Git branch

```
USAGE
  $ jg id

FLAGS
  -c, --clipboard  (optional) Copy to clipboard
  -h, --help       (optional) Show help
  -q, --quiet      (optional) Suppress output

DESCRIPTION
  Returns Jira Issue ID from current Git branch

EXAMPLES
  $ git switch feat/XYZ-12345/NOTIFICATIONS-add-profile-update-notification
  $ jg id
  12345
```

_See code: [src/commands/id/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.0/src/commands/id/index.ts)_

## `jg key`

Get Jira Issue key from current Git branch

```
USAGE
  $ jg key

FLAGS
  -c, --clipboard  (optional) Copy to clipboard
  -h, --help       (optional) Show help
  -q, --quiet      (optional) Suppress output

DESCRIPTION
  Returns Jira Issue Key from current Git branch

EXAMPLES
  $ git switch feat/XYZ-12345/NOTIFICATIONS-add-profile-update-notification
  $ jg key
  XYZ-12345
```

_See code: [src/commands/key/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.0/src/commands/key/index.ts)_

## `jg url`

Returns a URL to a Jira Issue

```
USAGE
  $ jg url [jiraIssueIdOrKey] [-c,-h,-q]

FLAGS
  -c, --clipboard  (optional) Copy to clipboard
  -h, --help       (optional) Show help
  -m, --markdown   (optional) Get Markdown Link to Jira Issue
  -q, --quiet      (optional) Suppress output

DESCRIPTION
  Returns a URL to a Jira Issue

EXAMPLES
  $ git switch feat/XYZ-12345/NOTIFICATIONS-add-profile-update-notification
  $ jg url
  XYZ-12345

  $ jg url ZYX-54321
  ZYX-54321

  $ jg url ZYX-54321 -c
  Copied Jira Issue url to clipboard: <YOUR-JIRA-HOSTNAME>/browse/ZYX-54321

  $ jg url ZYX-54321 -m
  Copied Jira Issue Markdown Link to clipboard: [ZYX-54321](<YOUR-JIRA-HOSTNAME>/browse/ZYX-54321)
```

_See code: [src/commands/url/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.0/src/commands/url/index.ts)_

## `jg cc`

Generates a Conventional Commit Message from a Jira Issue ID/Key

```
USAGE
  $ jg cc

FLAGS
  -c, --clipboard  (optional) Copy to clipboard
  -h, --help       (optional) Show help
  -q, --quiet      (optional) Suppress output

DESCRIPTION
  Generates a Conventional Commit Message from a Jira Issue ID/Key

EXAMPLES
  $ git switch feat/XYZ-12345/NOTIFICATIONS-add-profile-update-notification
  $ jg cc
  feat(NOTIFICATIONS): Add Profile Update Notification
```

_See code: [src/commands/cc/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.0/src/commands/cc/index.ts)_

## `jg bname`

Generates a Conventional Commit Message from a Jira Issue ID/Key

```
USAGE
  $ jg bname

FLAGS
  -c, --clipboard  (optional) Copy to clipboard
  -h, --help       (optional) Show help
  -q, --quiet      (optional) Suppress output

DESCRIPTION
  Generates a Conventional Commit Message from a Jira Issue ID/Key

EXAMPLES
  $ git switch feat/XYZ-12345/NOTIFICATIONS-add-profile-update-notification
  $ jg bname
  feat(NOTIFICATIONS): Add Profile Update Notification
```

_See code: [src/commands/bname/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.0/src/commands/bname/index.ts)_

## `jg pr`

Generates a Slack Message Linking to a Jira Issue and corresponding Pull Request

```
USAGE
  $ jg pr [jiraIssueIdOrKey] [-c,-h,-q]

FLAGS
  -c, --clipboard  (optional) Copy to clipboard
  -h, --help       (optional) Show help
  -q, --quiet      (optional) Suppress output

DESCRIPTION
  Generates a Slack Message Linking to a Jira Issue and corresponding Pull Request

EXAMPLES
  $ git switch feat/XYZ-12345/NOTIFICATIONS-add-profile-update-notification
  $ jg pr
  PR for [XYZ-12345](<YOUR-JIRA-HOSTNAME>/browse/XYZ-12345): [#16303](https://github.com/<REPO-OWNER>/<REPO-NAME>/pull/16303)

  $ jg pr -c
  Copied Slack Message to Clipboard: PR for [XYZ-12345](<YOUR-JIRA-HOSTNAME>/browse/XYZ-12345): [#16303](https://github.com/<REPO-OWNER>/<REPO-NAME>/pull/16303)
```

_See code: [src/commands/pr/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.0/src/commands/pr/index.ts)_

## `jg help [COMMAND]`

Display help for jg.

```
USAGE
  $ jg help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for jg.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.18/src/commands/help.ts)_

## `jg plugins`

List installed plugins.

```
USAGE
  $ jg plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ jg plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/index.ts)_

## `jg plugins add PLUGIN`

Installs a plugin into jg.

```
USAGE
  $ jg plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into jg.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the JG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the JG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ jg plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ jg plugins add myplugin

  Install a plugin from a github url.

    $ jg plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ jg plugins add someuser/someplugin
```

## `jg plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ jg plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ jg plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/inspect.ts)_

## `jg plugins install PLUGIN`

Installs a plugin into jg.

```
USAGE
  $ jg plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into jg.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the JG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the JG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ jg plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ jg plugins install myplugin

  Install a plugin from a github url.

    $ jg plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ jg plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/install.ts)_

## `jg plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ jg plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ jg plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/link.ts)_

## `jg plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ jg plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ jg plugins unlink
  $ jg plugins remove

EXAMPLES
  $ jg plugins remove myplugin
```

## `jg plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ jg plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/reset.ts)_

## `jg plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ jg plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ jg plugins unlink
  $ jg plugins remove

EXAMPLES
  $ jg plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/uninstall.ts)_

## `jg plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ jg plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ jg plugins unlink
  $ jg plugins remove

EXAMPLES
  $ jg plugins unlink myplugin
```

## `jg plugins update`

Update installed plugins.

```
USAGE
  $ jg plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.17/src/commands/plugins/update.ts)_

<!-- commandsstop -->
