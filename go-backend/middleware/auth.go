package middleware

import (
    "net/http"
    "strings"

    "github.com/golang-jwt/jwt/v5"
)

var JwtSecret = []byte("solarsense-secret-key")

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
      return func(w http.ResponseWriter, r *http.Request) {
              authHeader := r.Header.Get("Authorization")
              if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
                      http.Error(w, "Unauthorized", http.StatusUnauthorized)
                      return
              }

              tokenString := strings.TrimPrefix(authHeader, "Bearer ")
              token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
                      return JwtSecret, nil
              })

              if err != nil || !token.Valid {
                      http.Error(w, "Unauthorized", http.StatusUnauthorized)
                      return
              }

              next(w, r)
      }
}