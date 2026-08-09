package handlers

import (
      "encoding/json"
      "net/http"
      "time"

      "github.com/golang-jwt/jwt/v5"
      "github.com/pooranc/solarsense/models"
      "golang.org/x/crypto/bcrypt"	  
)


type AuthRequest struct {
      Email    string `json:"email"`
      Password string `json:"password"`
}

type AuthResponse struct {
      Token string      `json:"token"`
      User  models.User `json:"user"`
}

func Register(w http.ResponseWriter, r *http.Request) {
      if r.Method != http.MethodPost {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }

      var req AuthRequest
      json.NewDecoder(r.Body).Decode(&req)

      hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
      if err != nil {
              http.Error(w, "Error hashing password", http.StatusInternalServerError)
              return
      }

      result, err := DB.Exec(`INSERT INTO users (email, password_hash) VALUES (?, ?)`, req.Email, string(hash))
      if err != nil {
              http.Error(w, "Email already exists", http.StatusConflict)
              return
      }

      id, _ := result.LastInsertId()
      user := models.User{ID: int(id), Email: req.Email}

	  token := generateToken(user)
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(AuthResponse{Token: token, User: user})
}

func Login(w http.ResponseWriter, r *http.Request) {
      if r.Method != http.MethodPost {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }

      var req AuthRequest
      json.NewDecoder(r.Body).Decode(&req)

      var user models.User
      var passwordHash string
      err := DB.QueryRow(`SELECT id, email, password_hash FROM users WHERE email = ?`, req.Email).
              Scan(&user.ID, &user.Email, &passwordHash)
      if err != nil {
              http.Error(w, "Invalid email or password", http.StatusUnauthorized)
              return
      }

      err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password))
      if err != nil {
              http.Error(w, "Invalid email or password", http.StatusUnauthorized)
              return
      }

	  token := generateToken(user)
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(AuthResponse{Token: token, User: user})
}

func generateToken(user models.User) string {
      token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
              "userId": user.ID,
              "email":  user.Email,
              "exp":    time.Now().Add(24 * time.Hour).Unix(),
      })
      tokenString, _ := token.SignedString(models.JwtSecret)
      return tokenString
}