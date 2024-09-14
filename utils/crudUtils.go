package utils

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

func copySingleFile(dst, src string) (int64, error) {
	sourceFileStat, err := os.Stat(src)
	if err != nil {
		return 0, err
	}

	if !sourceFileStat.Mode().IsRegular() {
		return 0, fmt.Errorf("%s is not a regular file", src)
	}

	source, err := os.Open(src)
	if err != nil {
		return 0, err
	}
	defer source.Close()

	destination, err := os.Create(dst)
	if err != nil {
		return 0, err
	}
	defer destination.Close()
	nBytes, err := io.Copy(destination, source)
	return nBytes, err
}

func ExecuteCopy(src, dst string) error {
	srcStat, err := os.Stat(src)
	if err != nil {
		// fmt.Println("File/folder does not exist - ", src)
		return err
	}

	dstStat, err := os.Stat(dst)
	if err != nil {
		// fmt.Println("Folder does not exist - ", dst)
		return err
	}
	if !dstStat.IsDir() {
		// fmt.Println("Destination is not a folder - ", dst)
		return err
	}

	if srcStat.IsDir() {
		srcFS := os.DirFS(src)
		err = os.CopyFS(dst+"/"+filepath.Base(src), srcFS)
	} else {
		_, err = copySingleFile(dst+"/"+filepath.Base(src), src)
	}
	return err
}

func ExecuteDelete(filepath string) error {
	return os.RemoveAll(filepath)
}

func ExecuteRename(oldname, newname string) error {
	return os.Rename(oldname, newname)
}

func ExecuteNewFile(filepath string) error {
	file, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer file.Close()
	return nil
}

func ExecuteNewFolder(filepath string) error {
	return os.Mkdir(filepath, os.ModePerm)
}
