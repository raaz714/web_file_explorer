package main

import (
	"fmt"
	"io/fs"
	"os"
	"os/user"
	"path/filepath"
	"strings"
	"time"

	"web_file_explorer/config"
	"web_file_explorer/traverse"

	flag "github.com/spf13/pflag"
	"github.com/spf13/viper"
)

func InitializeConfig() {
	flag.StringP("root", "r", ".", "root path to serve from")
	flag.IntP("port",
		"p",
		9876,
		"port to start server")
	flag.BoolP(
		"hidden",
		"d",
		false,
		"should show hidden files and folders",
	)
	flag.Bool(
		"cached",
		false,
		"cache the file/folder snapshot at the time of app startup\n"+
			"useful for situations when the serving directory does not change"+
			" after the app startup\n"+
			"much faster as it bypasses disk i/o while serving directory tree",
	)
	flag.Bool("noauth",
		false,
		"requires no authentication\n"+
			"if passed, \"auth\" flag will be ignored",
	)
	flag.StringSliceP("auth",
		"a",
		[]string{"admin:admin"},
		"Provide a comma separated list of user/password in this"+
			" format username:password, e.g. wfe --auth jane:password,john:secret",
	)
	flag.BoolP("silent", "s", false, "silent mode, no logs are shown")
	configFile := flag.StringP("config", "c", "", "config file in .yaml format")

	flag.Parse()

	viper.BindEnv("port")

	if *configFile == "" {
		viper.BindPFlags(flag.CommandLine)
	} else {
		viper.SetConfigFile(*configFile)
		err := viper.ReadInConfig()
		if err != nil {
			if _, ok := err.(*fs.PathError); ok {
				fmt.Println("config file not found, running with command-line and default arguments")
				viper.BindPFlags(flag.CommandLine)
			} else {
				fmt.Println("Error in parsing config file : ", err)
				os.Exit(-1)
			}
		}
	}

	normalizeRootPath()

	config.InitConfigWithViper()

	userConfig := config.GetConfig()

	fmt.Println("Serving Path - ", userConfig.Root)
	fmt.Println("Serving Port - ", userConfig.Port)
	fmt.Println("Serving Opts -")
	fmt.Println("\t Hidden files - ", userConfig.Hidden)
	fmt.Println("\t Cached view - ", userConfig.Cached)
}

func normalizeRootPath() {
	usr, _ := user.Current()
	homeDir := usr.HomeDir

	root := "."
	rootPath := viper.Get("root").(string)

	if rootPath == "~" {
		root = homeDir
	} else if strings.HasPrefix(rootPath, "~/") {
		root = filepath.Join(homeDir, (rootPath)[2:])
	} else {
		root = rootPath
	}
	root, _ = filepath.Abs(root)
	viper.Set("root", root)
}

func IntializeTraverse(userConfig *config.UserConfig) {
	start := time.Now()
	fmt.Println(userConfig.Root)
	traverse.NewTree(userConfig.Root)
	elapsed := time.Since(start)
	fmt.Printf("Indexed %s in %s\n", userConfig.Root, elapsed.String())
}
