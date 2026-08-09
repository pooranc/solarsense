package handlers

import (
      "encoding/json"
      "net/http"

      "github.com/pooranc/solarsense/models"
)

func SaveQuote(w http.ResponseWriter, r *http.Request) {
      if r.Method != http.MethodPost {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }
      var quote models.QuoteEntity
      json.NewDecoder(r.Body).Decode(&quote)

      result, err := DB.Exec(`INSERT INTO quotes (installer_name, system_size_kwp, number_of_panels, battery_capacity_kwh, total_price, grant_amount_claimed)
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

func GetQuotes(w http.ResponseWriter, r *http.Request) {
      if r.Method != http.MethodGet {
              http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
              return
      }
      rows, _ := DB.Query(`SELECT id, installer_name, system_size_kwp, number_of_panels, battery_capacity_kwh, total_price, grant_amount_claimed FROM quotes`)
      defer rows.Close()

      var quotes []models.QuoteEntity
      for rows.Next() {
              var q models.QuoteEntity
              rows.Scan(&q.ID, &q.InstallerName, &q.SystemSizeKwp, &q.NumberOfPanels,
                      &q.BatteryCapacityKwh, &q.TotalPrice, &q.GrantAmountClaimed)
              quotes = append(quotes, q)
      }

      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(quotes)
}