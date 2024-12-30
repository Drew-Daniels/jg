# `jgit`

Utility functions for Jira and Git

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/jgit.svg)](https://npmjs.org/package/jgit)
[![Downloads/week](https://img.shields.io/npm/dw/jgit.svg)](https://npmjs.org/package/jgit)

<!-- toc -->
* [`jgit`](#jgit)
* [Setup](#setup)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Setup

## GitHub API Auth

You will need to export a GitHub OAuth Token to authenticate with the GitHub API.

https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#about-personal-access-tokens

```sh
export GITHUB_OAUTH_TOKEN="YOUR_GITHUB_OAUTH_TOKEN"
```

## Jira API Auth

You will need the following env vars set in your shell to authenticate with the Jira API:

```sh
export JIRA_HOSTNAME="https://jira.example.com"
export JIRA_API_TOKEN="YOUR_JIRA_API_TOKEN"
export JIRA_API_EMAIL="YOUR_JIRA_EMAIL"
```

# Usage

<!-- usage -->
```sh-session
$ npm install -g jgit
$ jg COMMAND
running command...
$ jg (--version)
jgit/0.0.13 darwin-arm64 node-v22.5.1
$ jg --help [COMMAND]
USAGE
  $ jg COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`jg bname [ISSUEKEY]`](#jg-bname-issuekey)
* [`jg cc [ISSUEKEY]`](#jg-cc-issuekey)
* [`jg find [ISSUEKEY]`](#jg-find-issuekey)
* [`jg help [COMMAND]`](#jg-help-command)
* [`jg id`](#jg-id)
* [`jg key`](#jg-key)
* [`jg plugins`](#jg-plugins)
* [`jg plugins add PLUGIN`](#jg-plugins-add-plugin)
* [`jg plugins:inspect PLUGIN...`](#jg-pluginsinspect-plugin)
* [`jg plugins install PLUGIN`](#jg-plugins-install-plugin)
* [`jg plugins link PATH`](#jg-plugins-link-path)
* [`jg plugins remove [PLUGIN]`](#jg-plugins-remove-plugin)
* [`jg plugins reset`](#jg-plugins-reset)
* [`jg plugins uninstall [PLUGIN]`](#jg-plugins-uninstall-plugin)
* [`jg plugins unlink [PLUGIN]`](#jg-plugins-unlink-plugin)
* [`jg plugins update`](#jg-plugins-update)
* [`jg pr [ISSUEKEY]`](#jg-pr-issuekey)
* [`jg related [ISSUEKEY]`](#jg-related-issuekey)
* [`jg revisit [ISSUEKEY]`](#jg-revisit-issuekey)
* [`jg url [ISSUEKEY]`](#jg-url-issuekey)

## `jg bname [ISSUEKEY]`

Generates a Git branch name from a Jira Issue Key

```
USAGE
  $ jg bname [ISSUEKEY] [--json] [-h] [-q -c]

ARGUMENTS
  ISSUEKEY  Jira Issue Key

FLAGS
  -c, --clipboard  Copy to clipboard
  -h, --help       Show help
  -q, --quiet      Suppress output

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Generates a Git branch name from a Jira Issue Key

EXAMPLES
  $ jg bname

  $ jg bname --clipboard

  $ jg bname --clipboard --quiet

  $ jg bname --json
```

_See code: [src/commands/bname/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.13/src/commands/bname/index.ts)_

## `jg cc [ISSUEKEY]`

Generates a Conventional Commit Message from a Jira Issue Key

```
USAGE
  $ jg cc [ISSUEKEY] [--json] [-h] [-q -c]

ARGUMENTS
  ISSUEKEY  Jira Issue Key

FLAGS
  -c, --clipboard  Copy to clipboard
  -h, --help       Show help
  -q, --quiet      Suppress output

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Generates a Conventional Commit Message from a Jira Issue Key

EXAMPLES
  $ jg cc

  $ jg cc --clipboard

  $ jg cc --clipboard --quiet

  $ jg cc --json
```

_See code: [src/commands/cc/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.13/src/commands/cc/index.ts)_

## `jg find [ISSUEKEY]`

Finds the latest GH PR for a Jira ticket

```
USAGE
  $ jg find [ISSUEKEY] [--json] [-h] [-q -c]

ARGUMENTS
  ISSUEKEY  Jira Issue Key

FLAGS
  -c, --clipboard  Copy to clipboard
  -h, --help       Show help
  -q, --quiet      Suppress output

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Finds the latest GH PR for a Jira ticket

EXAMPLES
  $ jg find

  $ jg find --clipboard

  $ jg find --clipboard --quiet

  $ jg find --json
```

_See code: [src/commands/find/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.13/src/commands/find/index.ts)_

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

## `jg id`

Returns Jira Issue ID from current Git branch

```
USAGE
  $ jg id [--json] [-h] [-q -c]

FLAGS
  -c, --clipboard  Copy to clipboard
  -h, --help       Show help
  -q, --quiet      Suppress output

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Returns Jira Issue ID from current Git branch

EXAMPLES
  $ jg id

  $ jg id --clipboard

  $ jg id --clipboard --quiet

  $ jg id --json
```

_See code: [src/commands/id/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.13/src/commands/id/index.ts)_

## `jg key`

Returns Jira Issue Key from current Git branch

```
USAGE
  $ jg key [--json] [-h] [-q -c]

FLAGS
  -c, --clipboard  Copy to clipboard
  -h, --help       Show help
  -q, --quiet      Suppress output

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Returns Jira Issue Key from current Git branch

EXAMPLES
  $ jg key

  $ jg key --clipboard

  $ jg key --clipboard --quiet

  $ jg key --json
```

_See code: [src/commands/key/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.13/src/commands/key/index.ts)_

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

## `jg pr [ISSUEKEY]`

Generates a Slack Message with a Link to a Jira Issue and corresponding GitHub link

```
USAGE
  $ jg pr [ISSUEKEY] [--json] [-h] [-q -c]

ARGUMENTS
  ISSUEKEY  Jira Issue Key

FLAGS
  -c, --clipboard  Copy to clipboard
  -h, --help       Show help
  -q, --quiet      Suppress output

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Generates a Slack Message with a Link to a Jira Issue and corresponding GitHub link

EXAMPLES
  $ jg pr

  $ jg pr --clipboard

  $ jg pr --clipboard --quiet

  $ jg pr --json
```

_See code: [src/commands/pr/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.13/src/commands/pr/index.ts)_

## `jg related [ISSUEKEY]`

Opens all related PRs for a given Jira Issue

```
USAGE
  $ jg related [ISSUEKEY] [--json] [-h] [-q -c]

ARGUMENTS
  ISSUEKEY  Jira Issue Key

FLAGS
  -c, --clipboard  Copy to clipboard
  -h, --help       Show help
  -q, --quiet      Suppress output

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Opens all related PRs for a given Jira Issue

EXAMPLES
  $ jg related
```

_See code: [src/commands/related/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.13/src/commands/related/index.ts)_

## `jg revisit [ISSUEKEY]`

Opens all related PRs for a given Jira Issue

```
USAGE
  $ jg revisit [ISSUEKEY] [--json] [-h] [-q -c]

ARGUMENTS
  ISSUEKEY  Jira Issue Key

FLAGS
  -c, --clipboard  Copy to clipboard
  -h, --help       Show help
  -q, --quiet      Suppress output

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Opens all related PRs for a given Jira Issue

EXAMPLES
  $ jg revisit
```

_See code: [src/commands/revisit/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.13/src/commands/revisit/index.ts)_

## `jg url [ISSUEKEY]`

Returns a URL to a Jira Issue

```
USAGE
  $ jg url [ISSUEKEY] [--json] [-h] [-q -c] [-m]

ARGUMENTS
  ISSUEKEY  Jira Issue Key

FLAGS
  -c, --clipboard  Copy to clipboard
  -h, --help       Show help
  -m, --markdown   Get Markdown Link to Jira Issue
  -q, --quiet      Suppress output

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Returns a URL to a Jira Issue

EXAMPLES
  $ jg url

  $ jg url --clipboard

  $ jg url --clipboard --quiet

  $ jg url --json
```

_See code: [src/commands/url/index.ts](https://github.com/Drew-Daniels/jg/blob/v0.0.13/src/commands/url/index.ts)_
<!-- commandsstop -->
