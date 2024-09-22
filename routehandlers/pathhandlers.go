package routehandlers

import (
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/gin-gonic/gin"

	"web_file_explorer/config"
	"web_file_explorer/frontend"
	"web_file_explorer/traverse"
	"web_file_explorer/utils"
)

func dirHandler(c *gin.Context, path *string) {
	results, err := traverse.DirFileInfo(*path)
	if err != nil {
		c.String(404, err.Error())
		return
	}
	c.JSON(http.StatusOK, results)
}

func DirHandler(c *gin.Context, path *string) {
	var results []*traverse.FileInfo
	userConfig := config.GetConfig()

	dirList, err := os.ReadDir(*path)
	if err != nil {
		c.AbortWithError(http.StatusNotFound, err)
	}

	for _, d := range dirList {
		info, err := d.Info()
		if err != nil {
			continue
		}

		fullPath := filepath.Join(*path, d.Name())

		if !userConfig.Hidden {
			isHidden, err := utils.IsHiddenFile(fullPath)
			if err != nil || isHidden {
				continue
			}
		}
		results = append(results,
			traverse.FileInfoFromInterface(
				info, fullPath, len(userConfig.Root)))
	}

	// sort directory at the beginning, then files
	// also sort with names (case insensitive)
	sort.Slice(results, func(i, j int) bool {
		if results[i].IsDir == results[j].IsDir {
			return strings.ToLower(results[i].Name) < strings.ToLower(results[j].Name)
		} else if results[i].IsDir {
			return true
		} else {
			return false
		}
	})

	c.HTML(http.StatusOK, "", frontend.DirView(&results))
}

func FileHandler(c *gin.Context, parentPath *string, fileInfo *os.FileInfo) {
	userConfig := config.GetConfig()
	c.HTML(http.StatusOK, "",
		frontend.FileView(traverse.FileInfoFromInterface(
			*fileInfo,
			filepath.Join(*parentPath),
			len(userConfig.Root))))
}

func PathHandler() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		// relativePath := c.Param("relativePath")
		relativePath := c.Request.URL.Path
		path := filepath.Join(userConfig.Root, relativePath)

		fi, err := os.Stat(path)
		if err != nil {
			c.String(404, "Path does not exist")
			return
		}

		if fi.IsDir() {
			DirHandler(c, &path)
		} else {
			// c.File(path)
			FileHandler(c, &path, &fi)
		}
	}
	return fn
}
