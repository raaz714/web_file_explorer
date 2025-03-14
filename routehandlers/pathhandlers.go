package routehandlers

import (
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"web_file_explorer/config"
	"web_file_explorer/traverse"
	"web_file_explorer/utils"

	"github.com/gin-gonic/gin"
)

func DirHandlerCached(c *gin.Context, path *string) {
	if c.Request.Method == http.MethodHead {
		c.Header("isdir", "true")
		c.Status(http.StatusOK)
		return
	}

	results, err := traverse.DirFileInfo(*path)
	if err != nil {
		c.String(404, err.Error())
		return
	}
	c.JSON(http.StatusOK, results)
}

func DirHandler(c *gin.Context, path *string) {
	if c.Request.Method == http.MethodHead {
		c.Header("isdir", "true")
		c.Status(http.StatusOK)
		return
	}

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

	// sort to keep directories at the beginning, then files
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

	c.JSON(http.StatusOK, results)
}

func PathHandler() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		relativePath := c.Param("relativePath")
		path := filepath.Join(userConfig.Root + relativePath)

		fi, err := os.Stat(path)
		if err != nil {
			c.String(404, "Path does not exist")
			return
		}

		if fi.IsDir() {
			if userConfig.Cached {
				DirHandlerCached(c, &path)
			} else {
				DirHandler(c, &path)
			}
		} else {
			c.File(path)
		}
	}
	return fn
}
