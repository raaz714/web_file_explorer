package main

import (
	"bytes"
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"path/filepath"

	"github.com/asticode/go-astisub"
	"github.com/gin-gonic/gin"

	"web_file_explorer/config"
	"web_file_explorer/gintemplrenderer"
	"web_file_explorer/routehandlers"
)

//go:generate npm run build

//go:embed static
var static embed.FS

func Options(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", c.Request.Header.Get("Origin"))
	c.Header("Access-Control-Allow-Credentials", "true")
	c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
	c.Header("Access-Control-Allow-Headers", "authorization, origin, content-type, accept")
	c.Header("Allow", "HEAD,GET,POST,PUT,PATCH,DELETE,OPTIONS")

	if c.Request.Method != "OPTIONS" {
		c.Next()
	} else {
		c.Header("Content-Type", "application/json")
		c.AbortWithStatus(http.StatusOK)
	}
}

func main() {
	InitializeConfig()

	userConfig := config.GetConfig()

	go IntializeTraverse(&userConfig)

	router := gin.Default()
	router.Use(Options)

	ginHtmlRenderer := router.HTMLRender
	router.HTMLRender = &gintemplrenderer.HTMLTemplRenderer{FallbackHtmlRenderer: ginHtmlRenderer}

	// router.GET("/*relativePath", routehandlers.PathHandler())
	assetStatic, _ := fs.Sub(static, "static")
	router.StaticFS("/static", http.FS(assetStatic))

	router.GET("/raw/*filepath", func(c *gin.Context) {
		paramPath := c.Param("filepath")
		filepath := filepath.Join(userConfig.Root, paramPath)
		c.File(filepath)
	})
	router.GET("/sub/*id", func(c *gin.Context) {
		subPath := c.Param("id")
		srtContent, err := astisub.OpenFile(
			filepath.Join(userConfig.Root, subPath),
		)
		if err != nil {
			c.String(200, "")
			return
		}

		var webVTTBuf bytes.Buffer
		srtContent.WriteToWebVTT(&webVTTBuf)
		c.String(200, webVTTBuf.String())
	})

	exeGroup := router.Group("/_execute")
	{
		exeGroup.POST("/copy", routehandlers.CopyHandler())
		exeGroup.POST("/cut", routehandlers.CutHandler())
		exeGroup.POST("/remove", routehandlers.RemoveHandler())
		exeGroup.POST("/rename", routehandlers.RenameHandler())
		exeGroup.POST("/newfile", routehandlers.NewFileHandler())
		exeGroup.POST("/newfolder", routehandlers.NewFolderHandler())
	}

	router.POST("/upload", routehandlers.UploadHandler())

	router.NoRoute(routehandlers.PathHandler())

	// TODO: search with query param
	// router.GET("/search", routehandlers.SearchHandler())
	router.Run(fmt.Sprintf(":%d", userConfig.Port))
}
