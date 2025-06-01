package traverse

import (
	"errors"
	"fmt"
	"iter"
	"os"
	"path/filepath"
	"strings"
	"time"
	"web_file_explorer/config"
	"web_file_explorer/fuzzy"
	"web_file_explorer/stack"
	"web_file_explorer/utils"
)

// FileInfo is a struct created from os.FileInfo interface for serialization.
type FileInfo struct {
	Id           int `json:"id"`
	Name         string
	Path         string
	IsDir        bool
	Size         int64
	Extension    string
	MimeType     string
	LastModified time.Time
}

func (fInfo FileInfo) String() string {
	return fInfo.Name
}

type AllPaths []*FileInfo

func (a AllPaths) String(i int) string {
	return a[i].Name
}

func (a AllPaths) Len() int {
	return len(a)
}

func (a AllPaths) All() iter.Seq[any] {
	return func(yield func(any) bool) {
		for _, s := range a {
			if !yield(s) {
				return
			}
		}
	}
}

// Node represents a node in a directory tree.
type TreeNode struct {
	FullPath string
	Info     *FileInfo
	Children []*TreeNode
	Parent   *TreeNode
}

func (tn TreeNode) String() string {
	return tn.Info.Name
}

func (tn TreeNode) All() iter.Seq[any] {
	return func(yield func(any) bool) {
		st := stack.NewStack[*TreeNode]()
		curr := &tn

		for {
			if st.IsEmpty() && curr == nil {
				return
			}
			if !yield(curr.Info) {
				return
			}
			for _, child := range curr.Children {
				st.Push(child)
			}
			k, exists := st.Pop()
			if !exists {
				curr = nil
			} else {
				curr = k
			}
		}
	}
}

type (
	PathNodeMap  map[string]*TreeNode
	BucketCounts struct {
		Count     int
		Totalsize int64
	}
)
type FiletypeBuckets map[string]*BucketCounts

// Helper function to create a local FileInfo struct from os.FileInfo interface.
func FileInfoFromInterface(v os.FileInfo, path string, prefixLen int) *FileInfo {
	// mType, _ := mimetype.DetectFile(path)
	return &FileInfo{
		utils.Hash(path),
		v.Name(),
		path[prefixLen:],
		v.IsDir(),
		v.Size(),
		// mType.Extension(),
		// mType.String(),
		filepath.Ext(v.Name()), "",
		v.ModTime(),
	}
}

var (
	PathList  AllPaths
	DirTree   *TreeNode
	PNPData   PathNodeMap
	FTBuckets FiletypeBuckets
)

// Create directory hierarchy.
func NewTree(root string) (*AllPaths, *TreeNode, *PathNodeMap, error) {
	absRoot, err := filepath.Abs(root)
	if err != nil {
		return nil, nil, nil, err
	}

	userConfig := config.GetConfig()
	PNPData = PathNodeMap{}

	walkFunc := func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("cannot traverse: %s - %s\n", path, err)
			return nil
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

		fileInfoPopulated := FileInfoFromInterface(info, path, len(userConfig.Root))

		PathList = append(PathList, fileInfoPopulated)
		PNPData[path] = &TreeNode{
			FullPath: path,
			Info:     fileInfoPopulated,
			Children: make([]*TreeNode, 0),
		}
		return nil
	}

	if err = filepath.Walk(absRoot, walkFunc); err != nil {
		return nil, nil, nil, err
	}

	FTBuckets = FiletypeBuckets{}
	FTBuckets["img"] = &BucketCounts{0, 0}
	FTBuckets["vid"] = &BucketCounts{0, 0}
	FTBuckets["aud"] = &BucketCounts{0, 0}
	FTBuckets["doc"] = &BucketCounts{0, 0}
	FTBuckets["oth"] = &BucketCounts{0, 0}

	for path, node := range PNPData {
		parentPath := filepath.Dir(path)
		parent, exists := PNPData[parentPath]
		if !exists { // If a parent does not exist, this is the root.
			DirTree = node
		} else {
			addToFiletypeBucket(path, node.Info.Extension)
			node.Parent = parent
			parent.Children = append(parent.Children, node)
		}
	}

	return &PathList, DirTree, &PNPData, nil
}

func addToFiletypeBucket(path string, ext string) {
	var bucketType string
	switch strings.ToLower(ext) {
	case ".jpg", ".jpeg", ".svg", ".gif", ".png", ".bmp", ".webp":
		bucketType = "img"
	case ".wmv", ".mp4", ".avi", ".avchd", ".flv", ".f4v", ".swf", ".mkv", ".webm":
		bucketType = "vid"
	case ".aac", ".m4a", ".wma", ".wav", ".flac", ".mp3":
		bucketType = "aud"
	case ".pdf":
		bucketType = "doc"
	default:
		return
		// bucketType = "oth"
	}
	FTBuckets[bucketType].Count += 1
	FTBuckets[bucketType].Totalsize += PNPData[path].Info.Size
}

func DirFileInfo(inPath string) (*[]*FileInfo, error) {
	path, err := filepath.Abs(inPath)
	if err != nil {
		return nil, err
	}

	var results []*FileInfo

	tNode, exists := PNPData[path]

	if !exists {
		return nil, errors.New("path does not exist")
	}

	for _, n := range tNode.Children {
		results = append(results, n.Info)
	}
	return &results, nil
}

type ReturnResult struct {
	Match    fuzzy.Match
	FileInfo *FileInfo
}

func FuzzySearch(query string, folder string, limit int) []ReturnResult {
	root := PNPData[folder]
	matchResults := fuzzy.FindFrom(query, root)
	var results []ReturnResult
	for i, v := range matchResults {
		results = append(results, ReturnResult{v, v.MatchedData.(*FileInfo)})
		if i > limit {
			break
		}
	}

	return results
}
