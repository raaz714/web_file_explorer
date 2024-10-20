package config

type UserConfig struct {
	Root   string
	Port   int
	Hidden bool
	Cached bool
}

var config UserConfig

func InitConfig(root *string, port *int, hidden *bool, cached *bool) {
	config.Root = *root
	config.Port = *port
	config.Hidden = *hidden
	config.Cached = *cached
}

func GetConfig() UserConfig {
	return config
}
