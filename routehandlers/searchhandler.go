package routehandlers

import (
	"net/http"
	"path"
	"strconv"

	"github.com/gin-gonic/gin"

	"web_file_explorer/config"
	"web_file_explorer/traverse"
)

func SearchHandler() gin.HandlerFunc {
	fn := func(ctx *gin.Context) {
		query := ctx.Query("q")
		l := ctx.Query("limit")
		dir := ctx.Query("dir")
		limit := 10
		x, err := strconv.ParseInt(l, 10, 32)
		if err != nil || x > 255 {
			limit = 10
		} else {
			limit = int(x)
		}
		folder := path.Clean(config.GetConfig().Root + "/" + dir)
		ctx.JSON(http.StatusOK, traverse.FuzzySearch1(query, folder, limit))
	}
	return fn
}
