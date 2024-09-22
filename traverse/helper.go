package traverse

import (
	"os"
	"path/filepath"
	"web_file_explorer/utils"
)

// Helper function to create a local FileInfo struct from os.FileInfo interface.
func FileInfoFromInterface(v os.FileInfo, path string, prefixLen int) *FileInfo {
	// mType, _ := mimetype.DetectFile(path)
	return &FileInfo{
		utils.Hash(path),
		v.Name(),
		path[prefixLen:],
		v.IsDir(),
		v.Size(),
		// mType.Extension(),
		// mType.String(),
		filepath.Ext(v.Name()), "",
		v.ModTime(),
	}
}
