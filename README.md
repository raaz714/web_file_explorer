# Web File Browser

web_file_browser creates server to share a local directory.

1. The backend is written in `go`
2. The frontend is implented using `react` with material ui

#### To install dependencies (both frontend and backend):

`make prebuild`

#### To build frontend:

`make frontend`

#### To build the app:

`make all`

This will first build the frontend and then build a binary `wfe` bundling the
frontend inside the binary.

To build a docker image, use `make dockerimage`.

## Backend Routes

1. POST `/_auth/login`
2. HEAD `/_api/<file_path>`
3. GET `/_api/<file_path>`
4. HEAD `/_download/*relativePath`
5. GET `/_download/*relativePath`
6. POST `/_execute/copy`
7. POST `/_execute/cut`
8. POST `/_execute/remove`
9. POST `/_execute/rename`
10. POST `/_execute/newfile`
11. POST `/_execute/newfolder`
12. POST `/_upload`
13. GET `/_search`
14. GET `/_sub/<video_file_path>`

None of the above routes should have a conflict with filenames at the root level
folder. If it has a conflict, the file/folder will not be served properly.

## Contribution

Pull requests are welcome. Issues will be resolved quicker if they are paired
with a corresponding PR.
