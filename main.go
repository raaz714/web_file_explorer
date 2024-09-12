package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"web_file_explorer/config"
	"web_file_explorer/routehandlers"
)

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

	pathGroup := router.Group("/_api")
	{
		pathGroup.GET("/*relativePath", routehandlers.PathHandler())
	}

	exeGroup := router.Group("/_execute")
	{
		exeGroup.POST("/copy", routehandlers.CopyHandler())
		exeGroup.POST("/cut", routehandlers.CutHandler())
		exeGroup.POST("/remove", routehandlers.RemoveHandler())
		exeGroup.POST("/rename", routehandlers.RenameHandler())
	}

	router.POST("/upload", routehandlers.UploadHandler())

	router.GET("/search", routehandlers.SearchHandler())
	router.Run(fmt.Sprintf(":%d", userConfig.Port))
}
