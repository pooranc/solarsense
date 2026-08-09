package main

import (
      "database/sql"
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

	  db.Exec(`CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT UNIQUE NOT NULL,
              password_hash TEXT NOT NULL
      )`)
}