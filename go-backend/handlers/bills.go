package handlers

import (
      "database/sql"
      "encoding/json"
      "net/http"

      "github.com/pooranc/solarsense/models"
)

var DB *sql.DB

func SaveBill(w http.ResponseWriter, r *http.Request) {
      if r.Method != http.MethodPost {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }
      var bill models.BillEntity
      json.NewDecoder(r.Body).Decode(&bill)

      result, err := DB.Exec(`INSERT INTO bills (day_rate, night_rate, peak_rate, standing_charge, day_units, night_units, peak_units, bill_period_days)
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

func GetBills(w http.ResponseWriter, r *http.Request) {
      if r.Method != http.MethodGet {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }
      rows, _ := DB.Query(`SELECT id, day_rate, night_rate, peak_rate, standing_charge, day_units, night_units, peak_units, bill_period_days FROM bills`)
      defer rows.Close()

      var bills []models.BillEntity
      for rows.Next() {
              var b models.BillEntity
              rows.Scan(&b.ID, &b.DayRatePerKwh, &b.NightRatePerKwh, &b.PeakRatePerKwh,
                      &b.StandingChargePerDay, &b.DayUnitsKwh, &b.NightUnitsKwh,
                      &b.PeakUnitsKwh, &b.BillPeriodDays)
              bills = append(bills, b)
      }

      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(bills)
}