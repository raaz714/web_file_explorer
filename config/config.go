package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/spf13/viper"
)

type UserConfig struct {
	Root   string   `mapstructure:"root"`
	Port   int      `mapstructure:"port"`
	Hidden bool     `mapstructure:"hidden"`
	Cached bool     `mapstructure:"cached"`
	NoAuth bool     `mapstructure:"noauth"`
	Auth   []string `mapstructure:"auth"`
	Silent bool     `mapstructure:"silent"`
}

type User struct {
	Username string `json:"username" form:"username"`
	Password string `json:"password" form:"password"`
}

var Users = map[string]User{}

var config UserConfig

func InitConfigWithViper() {
	viper.Unmarshal(&config)

	if config.NoAuth {
		return
	}
	for _, u := range config.Auth {
		stringSlice := strings.Split(u, ":")
		if len(stringSlice) < 2 {
			fmt.Printf("malformed auth input - %s\n, format should be user:password", u)
			os.Exit(-1)
		}
		Users[stringSlice[0]] = User{stringSlice[0], stringSlice[1]}
	}
}

func GetConfig() UserConfig {
	return config
}
