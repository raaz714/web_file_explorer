package routehandlers

import (
	"bytes"
	"fmt"
	"net/http"
	"path/filepath"
	"strings"
	"web_file_explorer/config"

	"github.com/asticode/go-astisub"
	"github.com/gin-gonic/gin"
)

func SubHandler(c *gin.Context) {
	userConfig := config.GetConfig()
	fileParam := c.Param("sub")
	srtPath := strings.TrimSuffix(fileParam, filepath.Ext(fileParam)) + ".srt"
	sBuff, err := astisub.OpenFile(filepath.Join(userConfig.Root, srtPath))
	if err != nil {
		fmt.Println(err, srtPath)
		c.String(http.StatusOK, "")
		return
	}

	var vttBuff bytes.Buffer
	sBuff.WriteToWebVTT(&vttBuff)
	c.String(http.StatusOK, vttBuff.String())

}
