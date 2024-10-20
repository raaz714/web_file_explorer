package main

import (
	"flag"
	"fmt"
	"os/user"
	"path/filepath"
	"strings"
	"time"

	"web_file_explorer/config"
	"web_file_explorer/traverse"
)

func InitializeConfig() {
	rootPath := flag.String("path", ".", "root path to serve from")
	port := flag.Int("port", 9876, "port to start server")
	hiddenFiles := flag.Bool(
		"hidden",
		false,
		"should show hidden files and folders",
	)
	cachedOnStart := flag.Bool(
		"cached",
		false,
		"cache the file/folder snapshot at the time of app startup\nuseful for situations when the serving directory does not change after the app startup\nmuch faster as it bypasses disk i/o while serving directory tree",
	)

	flag.Parse()

	usr, _ := user.Current()
	homeDir := usr.HomeDir

	root := "."

	if *rootPath == "~" {
		root = homeDir
	} else if strings.HasPrefix(*rootPath, "~/") {
		root = filepath.Join(homeDir, (*rootPath)[2:])
	} else {
		root = *rootPath
	}
	root, _ = filepath.Abs(root)
	fmt.Printf("Config Initialized for path %s\n\n\n", root)

	config.InitConfig(&root, port, hiddenFiles, cachedOnStart)
}

func IntializeTraverse(userConfig *config.UserConfig) {
	start := time.Now()
	traverse.NewTree(userConfig.Root)
	elapsed := time.Since(start)
	fmt.Printf("Indexed %s in %s\n", userConfig.Root, elapsed.String())
}
