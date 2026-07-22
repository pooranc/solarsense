# SolarSense — PV + Battery Decision Support Tool

*Working name — rename as you like.*

## What this is

A tool that helps homeowners compare solar PV + battery storage quotations
against their actual electricity usage, and tells them which quote is
genuinely the better deal — not just which is cheaper on paper.

It exists because doing this properly by hand (matching tariff structures,
regional incentive rules, battery sizing vs. usage patterns, and catching
installer errors like invalid grant claims) is tedious, error-prone, and
most existing online calculators get it wrong by ignoring region-specific
rules entirely.

**Origin case:** built by working through two real installer quotes for an
Irish household, which surfaced a genuine error — one installer applied an
€1,800 SEAI grant discount to a home built in 2025, despite the grant only
covering homes connected to the grid before 1 January 2021. That kind of
region-specific eligibility rule is exactly what this tool should catch
automatically.

## Core principle: region logic is data, not code

Ireland, Germany, and India all have different:
- Tariff structures (time-of-use bands, standing charges, VAT rules)
- Export/feed-in schemes (Ireland: CEG; Germany: EEG Einspeisevergütung; India: net metering, varies by state)
- Incentive/grant schemes and eligibility rules (build-date cutoffs, system size caps, income tests)
- Currency and units

Rather than hardcoding Irish logic and rewriting it per region, every
region is a **pluggable config** the calculation engine consumes. Adding
Germany or India later means writing a new config file, not touching the
core engine.

## Architecture

```
backend/          Spring Boot (Java)
  domain/          Bill, TariffStructure, PVSystem, Battery, Region, EVChargingProfile
  service/          calculation engine, self-consumption modeling, payback projection
  api/              REST endpoints
  config/           per-region tariff/incentive definitions (JSON/YAML, not code)

frontend/          React
  bill-upload/       bill entry / parsing UI
  quote-comparison/  side-by-side quote comparison, adjustable assumptions
  dashboard/         payback charts, cumulative savings, self-consumption breakdown

data/
  regions/
    ie.json          Irish tariff bands, CEG rates, SEAI grant rules, VAT rules
    de.json           (phase 3)
    in.json           (phase 3)
```

## MVP scope (v1 — Ireland only, manual entry)

- [ ] Bill entry → structured tariff input (Day/Night/Peak rates, standing charge, PSO levy)
- [ ] Quote entry → structured system specs (panels, kWp, battery kWh, price, warranty)
- [ ] Calculation engine:
  - [ ] Annualize usage from partial-period bills
  - [ ] Self-consumption scenario modeling (conservative/moderate/optimistic)
  - [ ] CEG export income calculation
  - [ ] SEAI grant eligibility check (build-date rule, system size cap)
  - [ ] Payback period + 15-year cumulative projection
- [ ] Multi-quote side-by-side comparison view
- [ ] Charts: cost comparison, annual benefit range, cumulative crossover

## Roadmap

**Phase 2 — AI-assisted extraction**
Upload a bill/quote as PDF or photo → AI extracts structured data
automatically (this is exactly what was done manually in the original
chat session — panel specs, battery size, pricing, tariff bands — now
automated via vision + structured extraction).

**Phase 3 — Multi-region**
Add Germany and India region configs. Validates the region-as-data
architecture actually holds up under a second and third real-world
ruleset, not just Ireland.

**Phase 4 — EV charging integration**
Not every household has an EV yet, but many will within the system's
useful life — and an EV fundamentally changes the load profile the whole
calculation is built around:
- Add an optional `EVChargingProfile` (commute distance, charging pattern,
  home charger kW rating) to the domain model
- Recompute self-consumption and battery sizing recommendations assuming
  EV charging is added later, not just current usage — a battery sized
  "correctly" for a pre-EV household may be undersized once an EV is added
- Model EV-as-battery (V2H / bidirectional charging) where hardware supports it
- Factor in EV charger costs/grants when comparing quotes that bundle them in
  (several Irish installers already quote EV chargers alongside PV — this
  showed up in the original two-quote comparison as an optional add-on)

This means the domain model should treat "future EV" as a first-class
planning scenario from early on, even before Phase 4 is built — e.g. the
calculation engine should be able to answer "how would this quote's
payback change if I add an EV in 3 years" as a toggle, not a rewrite.

**Phase 5 (maybe) — Public product**
If the tool proves useful beyond personal use, package it as a
public/shareable service for other homeowners in Ireland, with the
multi-region groundwork already in place to expand from there.

## Reference calculation logic (from original working session)

- Annualize partial-period bill: `(kWh in period / days in period) × 365`
- Self-consumption value hierarchy: Day/Peak self-use > Night self-use >
  export (CEG rate is typically lower than Day/Peak retail rate, so
  maximizing self-consumption during expensive hours matters more than
  maximizing total production)
- Grant eligibility (Ireland, SEAI Solar PV Grant): home must be connected
  to the grid before 1 January 2021; new builds are excluded because Part L
  building regs already mandate a renewable energy ratio
- Payback: `system cost / average annual benefit (self-consumption savings + export income)`
- Battery sizing should be evaluated against the usage split (Day/Night/Peak
  %), not just total kWh — a battery too small for the Day/Peak load leaves
  savings on the table regardless of PV array size

## Tech notes

- Backend reuses patterns from the EnergyForecast project (Spring Boot
  layered architecture) for consistency and to build on existing Spring
  Boot familiarity
- Keep the calculation engine framework-agnostic where possible (plain
  Java service classes) so region configs and core logic could theoretically
  be tested or reused outside Spring Boot later
