# Web File Explorer

![alt text](wfe.png)

Web File Explorer is a free software that lets you creates a server to share a local directory.
This is quite usable for a home file server setup to a large scale file server.
The frontend and backend are implemented separately and merged into a finaly integrated no-dependency
binary which makes it highly efficient and scalable.

1. The backend is written in `go`
2. The frontend is implented using `react` with [`daisy ui`](https://daisyui.com/)

## Installation

Pre-build binaries are available [here](https://github.com/raaz714/web_file_explorer/releases/).
Please download according to your OS and architecture and run the binary `wfe` (short of `web file explorer`).

### Build from source

#### To install dependencies (both frontend and backend):

`make prebuild`

#### To build frontend:

`make frontend`

#### To build the app:

`make all`

This will first build the frontend and then build a binary `wfe` bundling the
frontend inside the binary.

To build a docker image, use `make dockerimage`.

## Running the server

The program supports both command-line options and `yaml` config file to accespt user configurations.

THe options are shown as below (as an ouput of `wfe -h`)-

```
Usage of wfe:
  -a, --auth strings    Provide a comma separated list of user/password in this format username:password, e.g. wfe --auth jane:password,john:secret (default [admin:admin])
      --cached          cache the file/folder snapshot at the time of app startup
                        useful for situations when the serving directory does not change after the app startup
                        much faster as it bypasses disk i/o while serving directory tree
  -c, --config string   config file in .yaml format
  -d, --hidden          should show hidden files and folders
  -p, --port int        port to start server (default 9876)
  -r, --root string     root path to serve from (default ".")
  -s, --silent          silent mode, no logs are shown
```

A sample yaml file `config.yaml` is described below -

```
root: /media/raaz/HDD/Media/
port: 8080
hidden: false
cached: true
silent: true
auth: john:password,jane:access
```

Run with config as follows-

`wfe -c ./config.yaml`

## Backend Routes

#### POST `/_auth/login`

Accepts JSON body - `{username:<username>, password:<password>}`
Returns JSON - `{token: <jwt_token>, username: <username>}`

#### HEAD `/_api/<file_path>`

Returns `ISDIR: true/false` in header

#### GET `/_api/<file_path>`

Returns an array of JSON object if <file_path> is a directory.
Each of JSON object represents a single entry in the following format -

```
{
	id: <file_uuid>
	Name: <file_name>
	Path: <file_relative_path_from_serving_root>
	IsDir: <boolean to denote if directory>
	Size: <size_in_byte>
	Extension: <file_extension>
	MimeType: <unusd_for_now>
	LastModified: <last_modified_in_iso_time_string>
}
```

If <file_path> is a file,

1. Tries to play in case of supported video/audio
1. Tries to preview in case of pdf
1. Shows download link if cannot play/preview

#### HEAD `/_download/*relativePath`

Returns staus 200 of <relativePath> exists

#### GET `/_download/*relativePath`

Accepts a query param `basename` which will contain the container directory.
This will trim the basename as prefix and the zip file name will only be the targetted file/folder.
Returns a zip file containing all the files/folders recursively containing contest of <relativePath>

#### POST `/_execute/copy`

Accepts JSON body `{destination:<directory_path>, sources:[<source_path_1>, <source_path_2>]}`
Copies the all the source files to destination

#### POST `/_execute/cut`

Accepts JSON body `{destination:<directory_path>, sources:[<source_path_1>, <source_path_2>, ...]}`
Copies the all the source files to destination and then removes the original sources

#### POST `/_execute/remove`

Accepts JSON body `{filepaths:[<file_path_1>, <file_path_2>, ...]}`
Removes all the files in `filepaths`

#### POST `/_execute/rename`

Accepts JSON body `{oldname: <old_file_name>, newname: <new_file_name>}`
Renames `oldname` to `newname` in same directory

#### POST `/_execute/newfile`

Accepts JSON body `{folderpath: <folder_path>, filename: <new_file_name>}`
Creates a new file inside `foldername`

#### POST `/_execute/newfolder`

Accepts JSON body `{folderpath: <folder_path>, foldername: <new_folder_name>}`
Creates a new folder inside `foldername`

#### POST `/_upload`

Accepts multipart form `upload` and query param `destination`
Uploads all the file in the form inside destination

#### GET `/_search`

Accepts query params `q`, `limit` and `dir`
Searches recursively for files/folders containing `q` inside `dir`
Number of results returned is capped by `limit`.
Max value of `limit` can be 255 and default value is 10 (if nothing or non-integer is provided)

#### GET `/_sub/<video_file_path>`

Removes the extension of <video_file_path>, appends an '.srt' and returns that file in
webvtt format if exists.
Helpful to have an embedded subtitle for a video stream.

None of the above routes should have a conflict with filenames at the root level
folder. If it has a conflict, the file/folder will not be served properly.

All the paths provided in param or query param will be sanitized and prepended with the root serving path.

## Contribution

Pull requests are welcome. Issues will be resolved quicker if they are paired
with a corresponding PR.
