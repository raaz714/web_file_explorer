package routehandlers

import (
	"net/http"
	"path"
	"path/filepath"
	"sort"
	"strconv"
	"web_file_explorer/config"
	"web_file_explorer/traverse"

	"github.com/gin-gonic/gin"
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
		folder := path.Clean(filepath.Join(config.GetConfig().Root, dir))
		ctx.JSON(http.StatusOK, traverse.FuzzySearch1(query, folder, limit))
	}
	return fn
}

func SearchHandlerHTMX() gin.HandlerFunc {
	fn := func(ctx *gin.Context) {
		query := ctx.PostForm("search")
		l := ctx.Query("limit")
		dir := ctx.PostForm("dir")
		limit := 10
		x, err := strconv.ParseInt(l, 10, 32)
		if err != nil || x > 255 {
			limit = 10
		} else {
			limit = int(x)
		}
		folder := path.Clean(filepath.Join(config.GetConfig().Root, dir))
		searchResults := traverse.FuzzySearch1(query, folder, limit)

		sort.Slice(searchResults,
			func(i int, j int) bool { // custom less function
				return searchResults[i].Match.Score < searchResults[j].Match.Score
			})

		var fileInfoResults []*traverse.FileInfo

		for _, sr := range searchResults {
			fileInfoResults = append(fileInfoResults, sr.FileInfo)
		}

		// ctx.String(200, fmt.Sprintf("%d", len(fileInfoResults)))

		RenderFolderHTMX(ctx, fileInfoResults)
	}
	return fn
}
