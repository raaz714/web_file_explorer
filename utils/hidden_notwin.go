//go:build !windows

package utils

import "path/filepath"

func IsHiddenFile(filename string) (bool, error) {
	return filepath.Base(filename)[0] == '.', nil
}
