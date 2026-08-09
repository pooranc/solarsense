package main

import (
      "encoding/json"
      "fmt"
      "net/http"
      "time"

      "github.com/pooranc/solarsense/handlers"
      "github.com/pooranc/solarsense/models"
      "github.com/pooranc/solarsense/middleware"
)

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
      return func(w http.ResponseWriter, r *http.Request) {
              w.Header().Set("Access-Control-Allow-Origin", "*")
              w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
              w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
              if r.Method == http.MethodOptions {
                      w.WriteHeader(http.StatusOK)
                      return
              }
              next(w, r)
      }
}

func checkEligibility(w http.ResponseWriter, r *http.Request) {
      var req models.EligibilityRequest
      json.NewDecoder(r.Body).Decode(&req)

      date, _ := time.Parse("2006-01-02", req.GridConnectionDate)
      cutoff := time.Date(2021, 1, 1, 0, 0, 0, 0, time.UTC)

      eligible := !req.IsNewBuild && date.Before(cutoff)

      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(models.EligibilityResponse{Eligible: eligible})
}

func calculatePayback(w http.ResponseWriter, r *http.Request) {
      var req models.PaybackRequest
      json.NewDecoder(r.Body).Decode(&req)

      const sunHours = 900.0
      const cegRate = 0.24

      production := req.SystemSizeKwp * sunHours
      netCost := req.TotalPrice - req.GrantAmountClaimed

      savings := func(rate float64) float64 {
              selfConsumed := production * rate
              exported := production * (1 - rate)
              return selfConsumed*req.DayRatePerKwh + exported*cegRate
      }

      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(models.PaybackResponse{
              ConservativeYears: netCost / savings(0.30),
              ModerateYears:     netCost / savings(0.50),
              OptimisticYears:   netCost / savings(0.70),
      })
}

func main() {
      initDB()
      handlers.DB = db

      http.HandleFunc("/health", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
              fmt.Fprintln(w, "SolarSense Go backend running")
      }))
      http.HandleFunc("/api/grant-eligibility/check", corsMiddleware(checkEligibility))
      http.HandleFunc("/api/payback/calculate", corsMiddleware(calculatePayback))
      http.HandleFunc("/api/bills", corsMiddleware(middleware.RequireAuth(handlers.SaveBill)))
http.HandleFunc("/api/bills/all", corsMiddleware(middleware.RequireAuth(handlers.GetBills)))
http.HandleFunc("/api/quotes", corsMiddleware(middleware.RequireAuth(handlers.SaveQuote)))
http.HandleFunc("/api/quotes/all", corsMiddleware(middleware.RequireAuth(handlers.GetQuotes)))

      http.HandleFunc("/api/register", corsMiddleware(handlers.Register))
      http.HandleFunc("/api/login", corsMiddleware(handlers.Login))

      fmt.Println("Server starting on :8080")
      http.ListenAndServe(":8080", nil)
}