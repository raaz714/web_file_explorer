package routehandlers

import (
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"

	"web_file_explorer/config"
	"web_file_explorer/utils"
)

type PastableList struct {
	FilePaths []string `binding:"required"`
}

type PasteObject struct {
	Destination string   `json:"destination"`
	Sources     []string `json:"sources"`
}

type RemoveObject struct {
	FilePaths []string `json:"filepaths"`
}

type RenameObject struct {
	OldName string `json:"oldname"`
	NewName string `json:"newname"`
}

func CopyHandler() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		fmt.Println("Inside CopyHandler")
		userConfig := config.GetConfig()
		var data PasteObject
		err := c.BindJSON(&data)
		if err != nil {
			fmt.Println(err)
			c.AbortWithError(400, err)
			return
		}
		for _, d := range data.Sources {
			err = utils.ExecuteCopy(userConfig.Root+"/"+d, userConfig.Root+"/"+data.Destination)
			if err != nil {
				fmt.Println(err)
				c.AbortWithError(http.StatusBadRequest, err)
				return
			}
		}
		c.Status(http.StatusOK)
	}
	return fn
}

func CutHandler() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		var data PasteObject
		err := c.BindJSON(&data)
		if err != nil {
			c.AbortWithError(400, err)
			return
		}
		for _, d := range data.Sources {
			err = utils.ExecuteCopy(userConfig.Root+"/"+d, userConfig.Root+"/"+data.Destination)
			if err != nil {
				c.AbortWithError(http.StatusBadRequest, err)
				return
			}
		}
		// TODO: delete the original file
		c.Status(http.StatusOK)
	}
	return fn
}

func RemoveHandler() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		var removeObject RemoveObject
		err := c.BindJSON(&removeObject)
		if err != nil {
			c.AbortWithError(400, err)
			return
		}
		for _, filepath := range removeObject.FilePaths {
			err := utils.ExecuteDelete(userConfig.Root + "/" + filepath)
			if err != nil {
				c.AbortWithError(http.StatusBadRequest, err)
				return
			}
		}
		c.Status(http.StatusOK)
	}
	return fn
}

func RenameHandler() gin.HandlerFunc {
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		var renameObject RenameObject
		err := c.BindJSON(&renameObject)
		if err != nil {
			c.AbortWithError(400, err)
			return
		}
		utils.ExecuteRename(
			userConfig.Root+"/"+renameObject.OldName,
			userConfig.Root+"/"+renameObject.NewName,
		)
		c.Status(http.StatusOK)
	}
	return fn
}

func NewFileHandler() gin.HandlerFunc {
	type NewFileObject struct {
		FolderPath string `json:"folderpath"`
		FileName   string `json:"filename"`
	}
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		var newFileObject NewFileObject
		err := c.BindJSON(&newFileObject)
		if err != nil {
			c.AbortWithError(400, err)
			return
		}
		utils.ExecuteNewFile(
			filepath.Join(userConfig.Root, newFileObject.FolderPath, newFileObject.FileName),
		)
	}
	return fn
}

func NewFolderHandler() gin.HandlerFunc {
	type NewFolderObject struct {
		FolderPath string `json:"folderpath"`
		FolderName string `json:"foldername"`
	}
	fn := func(c *gin.Context) {
		userConfig := config.GetConfig()
		var newFolderObject NewFolderObject
		err := c.BindJSON(&newFolderObject)
		if err != nil {
			c.AbortWithError(400, err)
			return
		}
		utils.ExecuteNewFolder(
			filepath.Join(userConfig.Root, newFolderObject.FolderPath, newFolderObject.FolderName),
		)
	}
	return fn
}
