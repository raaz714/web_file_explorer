package routehandlers

import (
	"errors"
	"fmt"
	"math/rand/v2"
	"net/http"
	"time"
	"web_file_explorer/config"
	"web_file_explorer/htmxtempls"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte(fmt.Sprintf("%v", rand.Int64()))

func SigninHandler(c *gin.Context) {
	userConfig := config.GetConfig()

	if userConfig.NoAuth {
		c.Redirect(http.StatusFound, "/")
		return
	}

	component := htmxtempls.LoginPage()
	c.HTML(200, "", component)
}

func LoginHandler(c *gin.Context) {
	userConfig := config.GetConfig()

	if userConfig.NoAuth {
		c.Redirect(http.StatusFound, "/")
		return
	}

	var u config.User
	c.Bind(&u)

	user, exists := config.Users[u.Username]

	if exists && u.Password == user.Password {
		tokenString, err := CreateToken(u.Username)
		if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		c.SetCookie("_auth", tokenString, 3600, "/", c.Request.Host, false, true)
		c.Header("Hx-Redirect", "/")
	} else {
		c.AbortWithError(http.StatusUnauthorized, errors.New("invalid credentials"))
	}
}

func AuthMiddleware(c *gin.Context) {
	userConfig := config.GetConfig()

	if userConfig.NoAuth {
		c.Next()
		return
	}
	cookie, _ := c.Cookie("_auth")
	if cookie == "" {
		c.Redirect(http.StatusFound, "/_signin")
		return
	} else {
		token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secretKey, nil
		})
		if err != nil {
			c.Redirect(http.StatusFound, "/_signin")
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("authinfo", claims)
		} else {
			c.Redirect(http.StatusFound, "/_signin")
			return
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
