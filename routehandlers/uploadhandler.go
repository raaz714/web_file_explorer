package routehandlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"web_file_explorer/config"
)

func UploadHandler() gin.HandlerFunc {
	userConfig := config.GetConfig()
	fn := func(c *gin.Context) {
		// Multipart form
		form, err := c.MultipartForm()
		if err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}
		files := form.File["upload[]"]
		dst := userConfig.Root + "/" + c.Param("destination")

		for _, file := range files {
			// fmt.Println(file.Filename)

			// Upload the file to specific dst.
			err := c.SaveUploadedFile(file, dst+"/"+file.Filename)
			if err != nil {
				// fmt.Println(err)
				c.AbortWithStatus(http.StatusNotFound)
			}
		}
		c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
	}

	return fn
}
