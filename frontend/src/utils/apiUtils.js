import axios from 'axios'

const fetchFolder = (pathname) => {
  return new Promise((resolve, reject) => {
    const content_options = {
      method: 'GET',
      url: '/_api/' + (pathname || ''),
    }

    axios
      .request(content_options)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

const fetchFromPath = (pathname) => {
  return new Promise((resolve, reject) => {
    const head_options = {
      method: 'HEAD',
      url: '/_api/' + (pathname || ''),
    }
    axios
      .request(head_options)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const fetchSearchResults = (query, limit, pathname) => {
  return new Promise((resolve, reject) => {
    const fetchPath = `/_search?q=${query}&limit=${limit}&dir=${pathname}`

    fetch(fetchPath)
      .then((res) => {
        return res.json().then((data) => {
          const formattedData = data.map((r) => {
            return { ...r.FileInfo }
          })
          resolve(formattedData)
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const processRename = (renamedFile, data, pathname) => {
  return new Promise((resolve, reject) => {
    if (renamedFile !== '' && renamedFile !== data.Name) {
      console.log('raname ', data.Path, ' to ', renamedFile)

      const options = {
        method: 'POST',
        url: '/_execute/rename',
        headers: { 'Content-Type': 'application/json' },
        data: { oldname: data.Path, newname: pathname + '/' + renamedFile },
      }

      axios
        .request(options)
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          reject(error)
        })
    } else {
      reject('Unsupported - ', renamedFile)
    }
  })
}

const newFileFolder = (createType, value, pathname) => {
  return new Promise((resolve, reject) => {
    const url = '/_execute/' + (createType === 'file' ? 'newfile' : 'newfolder')
    let data = {}

    switch (createType) {
      case 'file':
        data = { folderpath: pathname, filename: value }
        break
      case 'folder':
        data = { folderpath: pathname, foldername: value }
        break
      default:
        return
    }

    const options = {
      method: 'POST',
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: data,
    }

    axios
      .request(options)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

const doSignIn = (username, password) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: '_auth/login',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { username: username, password: password },
    }

    axios
      .request(options)
      .then(function (response) {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const doUpload = (form, pathname, progressCallback) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/_upload?destination=${pathname}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (p) => {
          progressCallback((p.loaded / p.total) * 100)
        },
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export {
  fetchFromPath,
  fetchFolder,
  fetchSearchResults,
  processRename,
  newFileFolder,
  doSignIn,
  doUpload,
}
