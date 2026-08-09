package main

import (
      "database/sql"
      "encoding/json"
      "fmt"
      "net/http"
      "time"

      _ "modernc.org/sqlite"
)


var db *sql.DB

func initDB() {
    var err error
    db, err = sql.Open("sqlite", "solarsense.db")
    if err != nil {
        panic(err)
    }

    db.Exec(`CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_rate REAL,
        night_rate REAL,
        peak_rate REAL,
        standing_charge REAL,
        day_units REAL,
        night_units REAL,
        peak_units REAL,
        bill_period_days INTEGER
    )`)

     db.Exec(`CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        installer_name TEXT,
        system_size_kwp REAL,
        number_of_panels INTEGER,
        battery_capacity_kwh REAL,
        total_price REAL,
        grant_amount_claimed REAL
    )`)
}

type PaybackRequest struct {
      InstallerName      string  `json:"installerName"`
      SystemSizeKwp      float64 `json:"systemSizeKwp"`
      TotalPrice         float64 `json:"totalPrice"`
      GrantAmountClaimed float64 `json:"grantAmountClaimed"`
      DayRatePerKwh      float64 `json:"dayRatePerKwh"`
      DayUnitsKwh        float64 `json:"dayUnitsKwh"`
      NightUnitsKwh      float64 `json:"nightUnitsKwh"`
      PeakUnitsKwh       float64 `json:"peakUnitsKwh"`
      BillPeriodDays     int     `json:"billPeriodDays"`
}

type BillEntity struct {
      ID                 int     `json:"id"`
      DayRatePerKwh      float64 `json:"dayRatePerKwh"`
      NightRatePerKwh    float64 `json:"nightRatePerKwh"`
      PeakRatePerKwh     float64 `json:"peakRatePerKwh"`
      StandingChargePerDay float64 `json:"standingChargePerDay"`
      DayUnitsKwh        float64 `json:"dayUnitsKwh"`
      NightUnitsKwh      float64 `json:"nightUnitsKwh"`
      PeakUnitsKwh       float64 `json:"peakUnitsKwh"`
      BillPeriodDays     int     `json:"billPeriodDays"`
}

type QuoteEntity struct {
      ID                 int     `json:"id"`
      InstallerName      string  `json:"installerName"`
      SystemSizeKwp      float64 `json:"systemSizeKwp"`
      NumberOfPanels     int     `json:"numberOfPanels"`
      BatteryCapacityKwh float64 `json:"batteryCapacityKwh"`
      TotalPrice         float64 `json:"totalPrice"`
      GrantAmountClaimed float64 `json:"grantAmountClaimed"`
}

type PaybackResponse struct {
      ConservativeYears float64 `json:"conservativeYears"`
      ModerateYears     float64 `json:"moderateYears"`
      OptimisticYears   float64 `json:"optimisticYears"`
}

type EligibilityRequest struct {
      GridConnectionDate string `json:"gridConnectionDate"`
      IsNewBuild         bool   `json:"isNewBuild"`
}

type EligibilityResponse struct {
      Eligible bool `json:"eligible"`
}

func checkEligibility(w http.ResponseWriter, r *http.Request) {
      var req EligibilityRequest
      json.NewDecoder(r.Body).Decode(&req)

      date, _ := time.Parse("2006-01-02", req.GridConnectionDate)
      cutoff := time.Date(2021, 1, 1, 0, 0, 0, 0, time.UTC)

      eligible := !req.IsNewBuild && date.Before(cutoff)

      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(EligibilityResponse{Eligible: eligible})
}

func calculatePayback(w http.ResponseWriter, r *http.Request) {
      var req PaybackRequest
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
      json.NewEncoder(w).Encode(PaybackResponse{
              ConservativeYears: netCost / savings(0.30),
              ModerateYears:     netCost / savings(0.50),
              OptimisticYears:   netCost / savings(0.70),
      })
}

func saveBill(w http.ResponseWriter, r *http.Request) {
     if r.Method != http.MethodPost {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }
      var bill BillEntity
      json.NewDecoder(r.Body).Decode(&bill)
result, err := db.Exec(`INSERT INTO bills (day_rate, night_rate, peak_rate, standing_charge, day_units, night_units, peak_units, bill_period_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    bill.DayRatePerKwh, bill.NightRatePerKwh, bill.PeakRatePerKwh,
    bill.StandingChargePerDay, bill.DayUnitsKwh, bill.NightUnitsKwh,
    bill.PeakUnitsKwh, bill.BillPeriodDays)
if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
}

      id, _ := result.LastInsertId()
      bill.ID = int(id)

      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(bill)
}

func getBills(w http.ResponseWriter, r *http.Request) {

		if r.Method != http.MethodGet {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }
      rows, _ := db.Query(`SELECT id, day_rate, night_rate, peak_rate, standing_charge, day_units, night_units, peak_units, bill_period_days FROM bills`)
      defer rows.Close()

      var bills []BillEntity
      for rows.Next() {
              var b BillEntity
              rows.Scan(&b.ID, &b.DayRatePerKwh, &b.NightRatePerKwh, &b.PeakRatePerKwh,
                      &b.StandingChargePerDay, &b.DayUnitsKwh, &b.NightUnitsKwh,
                      &b.PeakUnitsKwh, &b.BillPeriodDays)
              bills = append(bills, b)
      }

      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(bills)
}

func saveQuote(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }

      var quote QuoteEntity
      json.NewDecoder(r.Body).Decode(&quote)
      result, err := db.Exec(`INSERT INTO quotes (installer_name, system_size_kwp, number_of_panels, battery_capacity_kwh, total_price, grant_amount_claimed)
              VALUES (?, ?, ?, ?, ?, ?)`,
              quote.InstallerName, quote.SystemSizeKwp, quote.NumberOfPanels,
              quote.BatteryCapacityKwh, quote.TotalPrice, quote.GrantAmountClaimed)

      if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
}

      id, _ := result.LastInsertId()
      quote.ID = int(id)

      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(quote)
}

func getQuotes(w http.ResponseWriter, r *http.Request) {
			if r.Method != http.MethodGet {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }
      rows, _ := db.Query(`SELECT id, installer_name, system_size_kwp, number_of_panels, battery_capacity_kwh, total_price, grant_amount_claimed FROM quotes`)
      defer rows.Close()

      var quotes []QuoteEntity
      for rows.Next() {
              var q QuoteEntity
              rows.Scan(&q.ID, &q.InstallerName, &q.SystemSizeKwp, &q.NumberOfPanels,
                      &q.BatteryCapacityKwh, &q.TotalPrice, &q.GrantAmountClaimed)
              quotes = append(quotes, q)
      }

      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(quotes)
}

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

func main() {
      initDB()
http.HandleFunc("/health", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "SolarSense Go backend running")
}))
http.HandleFunc("/api/grant-eligibility/check", corsMiddleware(checkEligibility))
http.HandleFunc("/api/payback/calculate", corsMiddleware(calculatePayback))
http.HandleFunc("/api/bills", corsMiddleware(saveBill))
http.HandleFunc("/api/bills/all", corsMiddleware(getBills))
http.HandleFunc("/api/quotes", corsMiddleware(saveQuote))
http.HandleFunc("/api/quotes/all", corsMiddleware(getQuotes))

      fmt.Println("Server starting on :8080")
      http.ListenAndServe(":8080", nil)
}