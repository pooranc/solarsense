package models

type BillEntity struct {
      ID                   int     `json:"id"`
      DayRatePerKwh        float64 `json:"dayRatePerKwh"`
      NightRatePerKwh      float64 `json:"nightRatePerKwh"`
      PeakRatePerKwh       float64 `json:"peakRatePerKwh"`
      StandingChargePerDay float64 `json:"standingChargePerDay"`
      DayUnitsKwh          float64 `json:"dayUnitsKwh"`
      NightUnitsKwh        float64 `json:"nightUnitsKwh"`
      PeakUnitsKwh         float64 `json:"peakUnitsKwh"`
      BillPeriodDays       int     `json:"billPeriodDays"`
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

type User struct {
      ID           int    `json:"id"`
      Email        string `json:"email"`
      PasswordHash string `json:"-"`
}

type EligibilityRequest struct {
      GridConnectionDate string `json:"gridConnectionDate"`
      IsNewBuild         bool   `json:"isNewBuild"`
}

type EligibilityResponse struct {
      Eligible bool `json:"eligible"`
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

type PaybackResponse struct {
      ConservativeYears float64 `json:"conservativeYears"`
      ModerateYears     float64 `json:"moderateYears"`
      OptimisticYears   float64 `json:"optimisticYears"`
}