package routehandlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"web_file_explorer/config"
	"web_file_explorer/traverse"
)

func dirHandler(c *gin.Context, path *string) {
	results, err := traverse.DirFileInfo(*path)
	if err != nil {
		c.String(404, err.Error())
		return
	}
	c.JSON(http.StatusOK, results)
}

func PathHandler() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		relativePath := c.Param("relativePath")
		path := userConfig.Root + "/" + relativePath

		fi, err := os.Stat(path)
		if err != nil {
			c.String(404, "Path does not exist")
			return
		}

		if fi.IsDir() {
			dirHandler(c, &path)
		} else {
			c.File(path)
		}
	}
	return fn
}
