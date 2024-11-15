package routehandlers

import (
	"archive/zip"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"web_file_explorer/config"
	"web_file_explorer/utils"

	"github.com/gin-gonic/gin"
)

func DownloadHandler() gin.HandlerFunc {

	userConfig := config.GetConfig()

	fn := func(c *gin.Context) {

		relativePath := c.Param("relativePath")
		basePath := c.Query("basename")

		w := zip.NewWriter(c.Writer)
		defer w.Close()

		absPath := filepath.Join(userConfig.Root + relativePath)
		absBasePath := filepath.Join(userConfig.Root, basePath)

		c.Header("Content-Type", "application/zip")
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s.zip\"", absPath[len(absBasePath)+1:]))
		if c.Request.Method == http.MethodHead {
			c.Status(http.StatusOK)
			return
		}

		walker := func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if !userConfig.Hidden {
				isHidden, err := utils.IsHiddenFile(path)
				if err != nil || isHidden {
					if info.IsDir() {
						return filepath.SkipDir
					} else {
						return nil
					}
				}
			}

			relPath, err := filepath.Rel(absBasePath, path)
			if err != nil {
				return nil
			}

			if info.IsDir() { // add a trailing slash for creating dir
				dirPath := fmt.Sprintf("%s%c", relPath, os.PathSeparator)
				_, err = w.Create(dirPath)
				return err
			}

			file, err := os.Open(path)
			if err != nil {
				return err
			}
			defer file.Close()

			f, err := w.Create(relPath)
			if err != nil {
				return err
			}

			_, err = io.Copy(f, file)
			if err != nil {
				return err
			}

			return nil
		}

		err := filepath.Walk(absPath, walker)
		if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
	}

	return fn
}
