# file-find-replace-cli

Command-line tool to find and replace text in files.

## Installation

```
npm i -g file-find-replace-cli
```

## Usage

```bash
# Replace within a single file
find-replace replace.json -f 'data/users.txt'

# Or within multiple files (uses globs)
find-replace replace.json -f 'data/**/*.txt' -f 'src/**/*.ts'
```

## Syntax

```
$ file-replace -h

Usage: file-replace <replacementFile> [options]

Command line tool for replacing text in files, using a JSON file containining matches and replacements.
The JSON file must contain an object (or array of objects), each containing a 'find' and 'replace' entry

Arguments:
  replacementFile       The JSON file containing matches and replacements

Options:
  -V, --version         output the version number
  -f, --file [file...]  Path or glob to a file to replace. Can be used
                        multiple times.
  -v, --verbose         Turns on verbose mode
  -h, --help            display help for command
```

## Replacement file

`replace.json` contains the replacement info:

```jsonc
[
  {
    "find": "foo",
    "replace": "bar",
    "ignoreCase": true // Optional
  },
  {
    "find": "unicorn",
    "replace": "🦄"
  }
]
```
