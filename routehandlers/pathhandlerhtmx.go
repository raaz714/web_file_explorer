package routehandlers

import (
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"web_file_explorer/config"
	"web_file_explorer/htmxtempls"
	"web_file_explorer/traverse"
	"web_file_explorer/utils"

	"github.com/gabriel-vasile/mimetype"
	"github.com/gin-gonic/gin"
)

func DirHandlerCachedHTMX(c *gin.Context, path *string) {
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
	RenderFolderHTMX(c, *results)
}

func DirHandlerHTMX(c *gin.Context, path *string) {
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
	RenderFolderHTMX(c, results)
}

func customSplit(c rune) bool {
	return c == '/'
}

func RenderFolderHTMX(c *gin.Context, results []*traverse.FileInfo) {
	splitPath := strings.FieldsFunc(c.Request.URL.Path, customSplit)
	pathLen := len(splitPath)
	var pathList []string

	for i := 0; i < pathLen; i++ {
		if i == 0 {
			pathList = append(pathList, filepath.Join("/", splitPath[i]))
		} else {
			pathList = append(pathList, filepath.Join(pathList[i-1], splitPath[i]))
		}
	}
	isHTMXStr := c.GetHeader("hx-request")
	isHTMX := false
	if isHTMXStr == "true" {
		isHTMX = true
	}
	component := htmxtempls.FolderPage(results, &traverse.FTBuckets, &pathList, &splitPath, isHTMX)
	c.HTML(200, "", component)
}

func getComponentType(fileType string) string {
	if strings.HasPrefix(fileType, "image") {
		return "img"
	}

	if strings.HasPrefix(fileType, "video/mp4") || strings.HasPrefix(fileType, "video/webm") {
		return "video"
	}

	if strings.HasPrefix(fileType, "audio/aac") ||
		strings.HasPrefix(fileType, "audio/mpeg") ||
		strings.HasPrefix(fileType, "audio/ogg") {
		return "audio"
	}

	return ""
}

func RenderFileHTMX(c *gin.Context, path *string, relativePath *string) {
	fileMime, err := mimetype.DetectFile(*path)
	if err != nil {
		c.String(http.StatusNotFound, "File %s Not Found", path)
	}
	isHTMXStr := c.GetHeader("hx-request")
	isHTMX := false
	if isHTMXStr == "true" {
		isHTMX = true
	}
	component := htmxtempls.FilePage(*relativePath, &traverse.FTBuckets, getComponentType(fileMime.String()), isHTMX)
	c.HTML(200, "", component)
}

func RenderPathHTMX(c *gin.Context) {
	userConfig := config.GetConfig()
	relativePath := c.Request.URL.Path // c.Param("relativePath")
	path := filepath.Join(userConfig.Root + relativePath)

	fi, err := os.Stat(path)
	if err != nil {
		c.String(404, "Path does not exist")
		return
	}

	if fi.IsDir() {
		if userConfig.Cached {
			DirHandlerCachedHTMX(c, &path)
		} else {
			DirHandlerHTMX(c, &path)
		}
	} else {
		RenderFileHTMX(c, &path, &relativePath)
	}
}

func PathHandlerHTMX() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		relativePath := c.Request.URL.Path // c.Param("relativePath")
		path := filepath.Join(userConfig.Root + relativePath)

		fi, err := os.Stat(path)
		if err != nil {
			c.String(404, "Path does not exist")
			return
		}

		if fi.IsDir() {
			if userConfig.Cached {
				DirHandlerCachedHTMX(c, &path)
			} else {
				DirHandlerHTMX(c, &path)
			}
		} else {
			RenderFileHTMX(c, &path, &relativePath)
		}
	}
	return fn
}

func FileHandlerHTMX() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		filePath := filepath.Join(userConfig.Root, c.Param("relativePath"))
		c.File(filePath)
	}
	return fn
}
