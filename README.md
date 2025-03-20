# Web File Explorer

![alt text](wfe.png)

Web File Explorer is a free software that lets you creates a server to share a local directory.
This is quite usable for a home file server setup to a large scale file server.
The frontend and backend are implemented separately and merged into a finaly integrated no-dependency
binary which makes it highly efficient and scalable.

1. The backend is written in `go`
2. The frontend is implented using golang `templ` framework with [`daisy ui`](https://daisyui.com/) and [`Uiicons by Flaticon`](https://www.flaticon.com/uicons)

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

## Contribution

Pull requests are welcome. Issues will be resolved quicker if they are paired
with a corresponding PR.
