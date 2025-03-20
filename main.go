package main

import (
	"embed"
	"fmt"
	"net/http"
	"web_file_explorer/config"
	"web_file_explorer/gintemplrenderer"
	"web_file_explorer/routehandlers"

	// "github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

//go:embed all:_static-assets
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

	if userConfig.Silent {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.New()

	if !userConfig.Silent {
		router.Use(gin.Logger())
	}

	ginHtmlRenderer := router.HTMLRender
	router.HTMLRender = &gintemplrenderer.HTMLTemplRenderer{FallbackHtmlRenderer: ginHtmlRenderer}

	router.Use(gin.Recovery())

	router.Use(Options)

	/**
	 * htmx based routes
	 */
	router.StaticFS("/_static", http.FS(staticFS))

	router.GET("/_signin", routehandlers.SigninHandler)
	router.POST("/_login", routehandlers.LoginHandler)

	router.GET("/_file_/*relativePath", routehandlers.FileHandlerHTMX())
	router.GET("/_sub/*sub", routehandlers.SubHandler)

	router.POST("/_search", routehandlers.SearchHandlerHTMX())

	exeGroup := router.Group("/_execute", routehandlers.AuthMiddleware)
	{
		exeGroup.POST("/copy", routehandlers.CopyHandler())
		exeGroup.POST("/cut", routehandlers.CutHandler())
		exeGroup.POST("/remove", routehandlers.RemoveHandler())
	}

	// TODO: download directory as zip, new file and folder handler

	router.NoRoute(routehandlers.AuthMiddleware, routehandlers.PathHandlerHTMX())

	router.Run(fmt.Sprintf(":%d", userConfig.Port))
}
