package config

type UserConfig struct {
	Root   string
	Port   int
	Hidden bool
}

var config UserConfig

func InitConfig(root *string, port *int, hidden *bool) {
	config.Root = *root
	config.Port = *port
	config.Hidden = *hidden
}

func GetConfig() UserConfig {
	return config
}
