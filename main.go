package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"

	"github.com/gin-gonic/gin"

	"web_file_explorer/config"
	"web_file_explorer/routehandlers"
)

//go:embed dist
var staticFS embed.FS

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

	authGroup := router.Group("/_auth")
	{
		authGroup.POST("/login", routehandlers.LoginHandler)
	}

	pathGroup := router.Group("/_api")
	{
		pathGroup.HEAD("/*relativePath", routehandlers.PathHandler())
		pathGroup.GET("/*relativePath", routehandlers.PathHandler())
	}

	router.GET("/_sub/*sub", routehandlers.SubHandler)

	exeGroup := router.Group("/_execute", routehandlers.AuthMiddleware)
	{
		exeGroup.POST("/copy", routehandlers.CopyHandler())
		exeGroup.POST("/cut", routehandlers.CutHandler())
		exeGroup.POST("/remove", routehandlers.RemoveHandler())
		exeGroup.POST("/rename", routehandlers.RenameHandler())
		exeGroup.POST("/newfile", routehandlers.NewFileHandler())
		exeGroup.POST("/newfolder", routehandlers.NewFolderHandler())
	}

	router.POST("/_upload", routehandlers.AuthMiddleware, routehandlers.UploadHandler())

	router.GET("/_search", routehandlers.AuthMiddleware, routehandlers.SearchHandler())

	reactAsset, _ := fs.Sub(staticFS, "dist")
	router.NoRoute(gin.WrapH(http.FileServer(http.FS(reactAsset))))

	router.Run(fmt.Sprintf(":%d", userConfig.Port))
}
