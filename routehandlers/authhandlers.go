package routehandlers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("secret-key")

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

var users = map[string]User{
	"raaz":   {Username: "raaz", Password: "123456"},
	"shamit": {Username: "shamit", Password: "abcdef"},
}

func LoginHandler(c *gin.Context) {

	var u User
	c.BindJSON(&u)

	user, exists := users[u.Username]

	if exists && u.Password == user.Password {
		tokenString, err := CreateToken(u.Username)
		if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": tokenString, "username": user.Username})
	} else {
		c.AbortWithError(http.StatusUnauthorized, errors.New("invalid credentials"))
	}
}

func AuthMiddleware(c *gin.Context) {
	cookie, _ := c.Cookie("_auth")
	if cookie == "" {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	} else {
		token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secretKey, nil
		})

		if err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("authinfo", claims)
		} else {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		c.Next()
	}
}

func CreateToken(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": username,
			"exp":      time.Now().Add(time.Hour * 24).Unix(),
		})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func VerifyToken(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return err
	}

	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
}
