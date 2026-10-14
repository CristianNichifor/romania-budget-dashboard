import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

/**
 * Message catalog (source locale: ro). Messages are declared with the
 * Lingui `msg` macro so `lingui extract` can generate .po catalogs.
 */
export const m = {
  "app.title": msg({ id: "app.title", message: "Bugetul României" }),
  "app.subtitle": msg({
    id: "app.subtitle",
    message: "Tablou de bord cetățenesc — buget consolidat",
  }),
  "dataMode.live": msg({
    id: "dataMode.live",
    message: "Date live — API public",
  }),
  "dataMode.fallback": msg({
    id: "dataMode.fallback",
    message: "Date demo — API indisponibil",
  }),
  "dataMode.partial": msg({
    id: "dataMode.partial",
    message: "Date parțial demo",
  }),
  "lang.label": msg({ id: "lang.label", message: "Limbă" }),
  "currency.label": msg({ id: "currency.label", message: "Monedă" }),
  "currency.rateNote": msg({
    id: "currency.rateNote",
    message:
      "Sume convertite la cursul mediu BCE din {year}: 1 € = {rate} lei.",
  }),
  "a11y.skipToContent": msg({
    id: "a11y.skipToContent",
    message: "Sari la conținut",
  }),
  "sankey.ariaLabel": msg({
    id: "sankey.ariaLabel",
    message: "Fluxul banilor publici",
  }),
  "sankey.openDestination": msg({
    id: "sankey.openDestination",
    message: "Deschide destinația {destination}",
  }),
  "gauge.ariaLabel": msg({
    id: "gauge.ariaLabel",
    message: "Deficit {valuePercent} din PIB",
  }),
  "app.footer": msg({
    id: "app.footer",
    message:
      "Proiect educațional — datele provin din surse publice oficiale; sursa fiecărui grafic este afișată pe card.",
  }),
  "app.loading": msg({ id: "app.loading", message: "Se încarcă…" }),
  "app.loadingSlow": msg({
    id: "app.loadingSlow",
    message: "Serverul răspunde greu — mai așteptăm câteva secunde.",
  }),
  "nav.citizenSlice": msg({ id: "nav.citizenSlice", message: "Feliuța ta" }),
  "nav.label": msg({ id: "nav.label", message: "Navigare principală" }),
  "nav.economy": msg({ id: "nav.economy", message: "Economie" }),
  "nav.society": msg({ id: "nav.society", message: "Societate" }),
  "nav.energy": msg({ id: "nav.energy", message: "Energie" }),
  "nav.labour": msg({ id: "nav.labour", message: "Piața muncii" }),
  "nav.justice": msg({ id: "nav.justice", message: "Justiție" }),
  "chart.downloadCsv": msg({
    id: "chart.downloadCsv",
    message: "Descarcă CSV",
  }),
  "chart.showTable": msg({
    id: "chart.showTable",
    message: "Afișează ca tabel",
  }),
  "chart.csv.period": msg({ id: "chart.csv.period", message: "Perioadă" }),
  "chart.csv.value": msg({ id: "chart.csv.value", message: "Valoare" }),
  "society.title": msg({
    id: "society.title",
    message: "Societatea în cifre",
  }),
  "society.description": msg({
    id: "society.description",
    message:
      "Populația, cheltuielile publice cu sănătatea și educația și indicatori sociali măsurabili.",
  }),
  "society.kpi.population": msg({
    id: "society.kpi.population",
    message: "Populație rezidentă",
  }),
  "society.kpi.populationChange": msg({
    id: "society.kpi.populationChange",
    message: "Variație față de anul anterior",
  }),
  "society.kpi.populationChangeSub": msg({
    id: "society.kpi.populationChangeSub",
    message: "persoane",
  }),
  "society.population.title": msg({
    id: "society.population.title",
    message: "Populația României",
  }),
  "society.population.description": msg({
    id: "society.population.description",
    message:
      "Populația rezidentă totală, la 1 ianuarie a fiecărui an (Eurostat).",
  }),
  "society.spending.title": msg({
    id: "society.spending.title",
    message: "Cheltuieli publice: sănătate vs. educație",
  }),
  "society.spending.description": msg({
    id: "society.spending.description",
    message:
      "Cheltuielile administrației publice cu sănătatea (COFOG GF07) și educația (GF09), % din PIB (Eurostat).",
  }),
  "society.spending.health": msg({
    id: "society.spending.health",
    message: "Sănătate",
  }),
  "society.spending.education": msg({
    id: "society.spending.education",
    message: "Educație",
  }),
  "society.education.title": msg({
    id: "society.education.title",
    message: "Educație",
  }),
  "society.education.description": msg({
    id: "society.education.description",
    message:
      "Părăsirea timpurie a școlii și absolvenții de studii terțiare, % din populația 18–24, respectiv 25–34 de ani (Eurostat).",
  }),
  "society.education.earlyLeavers": msg({
    id: "society.education.earlyLeavers",
    message: "Părăsire timpurie a școlii",
  }),
  "society.education.tertiary": msg({
    id: "society.education.tertiary",
    message: "Studii terțiare (25–34 ani)",
  }),
  "society.health.title": msg({
    id: "society.health.title",
    message: "Sănătate",
  }),
  "society.health.description": msg({
    id: "society.health.description",
    message:
      "Medici practicanți la 100.000 de locuitori — densitatea medicală în timp (Eurostat, calculat cu populația rezidentă).",
  }),
  "society.health.physicians": msg({
    id: "society.health.physicians",
    message: "Medici la 100.000 locuitori",
  }),
  "society.demographics.title": msg({
    id: "society.demographics.title",
    message: "Demografie",
  }),
  "society.demographics.description": msg({
    id: "society.demographics.description",
    message:
      "Vârsta mediană a populației și migrația netă anuală la 1.000 de locuitori (Eurostat).",
  }),
  "society.demographics.medianAge": msg({
    id: "society.demographics.medianAge",
    message: "Vârsta mediană",
  }),
  "society.demographics.netMigration": msg({
    id: "society.demographics.netMigration",
    message: "Migrație netă (la 1.000)",
  }),
  "energy.title": msg({
    id: "energy.title",
    message: "Energia în date",
  }),
  "energy.description": msg({
    id: "energy.description",
    message:
      "Prețul energiei electrice pentru gospodării, ponderea energiei regenerabile și dependența de importuri (Eurostat).",
  }),
  "energy.kpi.electricity": msg({
    id: "energy.kpi.electricity",
    message: "Preț electricitate",
  }),
  "energy.kpi.renewables": msg({
    id: "energy.kpi.renewables",
    message: "Energie regenerabilă",
  }),
  "energy.kpi.import": msg({
    id: "energy.kpi.import",
    message: "Dependență de import",
  }),
  "energy.renewablesLegend": msg({
    id: "energy.renewablesLegend",
    message: "din consumul final brut",
  }),
  "energy.importLegend": msg({
    id: "energy.importLegend",
    message: "din consum",
  }),
  "energy.electricity.title": msg({
    id: "energy.electricity.title",
    message: "Prețul energiei electrice (gospodării)",
  }),
  "energy.electricity.description": msg({
    id: "energy.electricity.description",
    message:
      "Prețul mediu al energiei electrice pentru gospodării, bandă 2.500–5.000 kWh/an, toate taxele incluse (Eurostat, semestrial).",
  }),
  "energy.renewables.title": msg({
    id: "energy.renewables.title",
    message: "Ponderea energiei regenerabile",
  }),
  "energy.renewables.description": msg({
    id: "energy.renewables.description",
    message:
      "Ponderea energiei din surse regenerabile în consumul final brut de energie, % (Eurostat).",
  }),
  "energy.import.title": msg({
    id: "energy.import.title",
    message: "Dependența energetică de importuri",
  }),
  "energy.import.description": msg({
    id: "energy.import.description",
    message:
      "Dependența energetică totală de importuri (toate produsele), % din consumul brut (Eurostat).",
  }),
  "labour.title": msg({
    id: "labour.title",
    message: "Piața muncii",
  }),
  "labour.description": msg({
    id: "labour.description",
    message:
      "Tinerii care nu învață și nu lucrează (NEET), șomajul în rândul tinerilor și rata locurilor de muncă vacante (Eurostat).",
  }),
  "labour.kpi.neet": msg({
    id: "labour.kpi.neet",
    message: "Rata NEET (15–29 ani)",
  }),
  "labour.kpi.youth": msg({
    id: "labour.kpi.youth",
    message: "Șomajul tinerilor (sub 25)",
  }),
  "labour.kpi.vacancy": msg({
    id: "labour.kpi.vacancy",
    message: "Locuri de muncă vacante",
  }),
  "labour.neet.title": msg({
    id: "labour.neet.title",
    message: "Tineri NEET (15–29 ani)",
  }),
  "labour.neet.description": msg({
    id: "labour.neet.description",
    message:
      "Ponderea tinerilor de 15–29 de ani care nu sunt încadrați profesional și nu urmează niciun program educațional (Eurostat).",
  }),
  "labour.youth.title": msg({
    id: "labour.youth.title",
    message: "Șomajul tinerilor (sub 25 ani)",
  }),
  "labour.youth.description": msg({
    id: "labour.youth.description",
    message:
      "Rata șomajului pentru persoanele sub 25 de ani, ajustată sezonier, % din forța de muncă (Eurostat).",
  }),
  "labour.vacancy.title": msg({
    id: "labour.vacancy.title",
    message: "Rata locurilor de muncă vacante",
  }),
  "labour.vacancy.description": msg({
    id: "labour.vacancy.description",
    message:
      "Rata locurilor de muncă vacante în industrie, construcții și servicii (NACE B-S), ajustată sezonier (Eurostat).",
  }),
  "justice.title": msg({
    id: "justice.title",
    message: "Justiția în cifre",
  }),
  "justice.description": msg({
    id: "justice.description",
    message:
      "Omuciderile intenționate, populația carcerală și efectivul de polițiști (Eurostat).",
  }),
  "justice.kpi.homicides": msg({
    id: "justice.kpi.homicides",
    message: "Omucideri intenționate",
  }),
  "justice.kpi.prison": msg({
    id: "justice.kpi.prison",
    message: "Persoane în penitenciar",
  }),
  "justice.kpi.police": msg({
    id: "justice.kpi.police",
    message: "Polițiști",
  }),
  "justice.homicides.title": msg({
    id: "justice.homicides.title",
    message: "Omucideri intenționate",
  }),
  "justice.homicides.description": msg({
    id: "justice.homicides.description",
    message:
      "Infracțiuni de omucidere intenționată înregistrate (ICCS 0101), număr anual (Eurostat).",
  }),
  "justice.prison.title": msg({
    id: "justice.prison.title",
    message: "Populația carcerală",
  }),
  "justice.prison.description": msg({
    id: "justice.prison.description",
    message:
      "Numărul persoanelor deținute efectiv în penitenciare, la sfârșitul anului (Eurostat).",
  }),
  "justice.police.title": msg({
    id: "justice.police.title",
    message: "Efectivul de polițiști",
  }),
  "justice.police.description": msg({
    id: "justice.police.description",
    message: "Numărul polițiștilor (ISCO 5412), număr anual (Eurostat).",
  }),
  "society.ins.title": msg({
    id: "society.ins.title",
    message: "Indicatori sociali (Eurostat)",
  }),
  "society.ins.description": msg({
    id: "society.ins.description",
    message:
      "Un indicator social la alegere: mortalitate infantilă, speranța de viață, paturi de spital.",
  }),
  "economy.title": msg({
    id: "economy.title",
    message: "Economia României în date",
  }),
  "economy.description": msg({
    id: "economy.description",
    message:
      "Inflație, șomaj și cursul de schimb — indicatori lunari din surse europene oficiale.",
  }),
  "economy.kpi.inflation": msg({
    id: "economy.kpi.inflation",
    message: "Inflație anuală",
  }),
  "economy.kpi.target": msg({ id: "economy.kpi.target", message: "Ținta BNR" }),
  "economy.kpi.unemployment": msg({
    id: "economy.kpi.unemployment",
    message: "Șomaj (BIM)",
  }),
  "economy.kpi.fx": msg({ id: "economy.kpi.fx", message: "EUR/RON" }),
  "economy.inflation.title": msg({
    id: "economy.inflation.title",
    message: "Inflația anuală (IAPC)",
  }),
  "economy.inflation.description": msg({
    id: "economy.inflation.description",
    message:
      "Rata anuală a inflației armonizate (Eurostat), cu ținta BNR marcată.",
  }),
  "economy.inflation.targetLine": msg({
    id: "economy.inflation.targetLine",
    message: "Ținta BNR",
  }),
  "economy.unemployment.title": msg({
    id: "economy.unemployment.title",
    message: "Rata șomajului",
  }),
  "economy.unemployment.description": msg({
    id: "economy.unemployment.description",
    message: "Șomaj BIM (15–74 ani), ajustat sezonier, % din populația activă.",
  }),
  "economy.fx.title": msg({
    id: "economy.fx.title",
    message: "Cursul EUR/RON",
  }),
  "economy.fx.description": msg({
    id: "economy.fx.description",
    message: "Cursul de referință zilnic al Băncii Centrale Europene.",
  }),
  "economy.percent": msg({ id: "economy.percent", message: "%" }),
  "economy.lei": msg({ id: "economy.lei", message: "lei" }),
  "economy.kpi.gdpGrowth": msg({
    id: "economy.kpi.gdpGrowth",
    message: "Creștere PIB",
  }),
  "economy.kpi.gdpPerCapita": msg({
    id: "economy.kpi.gdpPerCapita",
    message: "PIB pe locuitor",
  }),
  "economy.kpi.eu27": msg({ id: "economy.kpi.eu27", message: "din media UE" }),
  "economy.kpi.debt": msg({
    id: "economy.kpi.debt",
    message: "Datorie publică",
  }),
  "economy.kpi.trade": msg({
    id: "economy.kpi.trade",
    message: "Balanța comercială",
  }),
  "economy.growth.title": msg({
    id: "economy.growth.title",
    message: "Creșterea economică",
  }),
  "economy.growth.description": msg({
    id: "economy.growth.description",
    message:
      "Variația trimestrială a PIB-ului real, ajustată sezonier și calendaristic (Eurostat).",
  }),
  "economy.gdpPerCapita.title": msg({
    id: "economy.gdpPerCapita.title",
    message: "PIB pe locuitor",
  }),
  "economy.gdpPerCapita.description": msg({
    id: "economy.gdpPerCapita.description",
    message:
      "PIB pe locuitor la paritatea puterii de cumpărare (PPS) și indicele față de media UE (UE27 = 100).",
  }),
  "economy.gdpPerCapita.ppsLegend": msg({
    id: "economy.gdpPerCapita.ppsLegend",
    message: "PIB/loc (PPS)",
  }),
  "economy.gdpPerCapita.indexLegend": msg({
    id: "economy.gdpPerCapita.indexLegend",
    message: "Indice UE27=100",
  }),
  "economy.gdpRegions.title": msg({
    id: "economy.gdpRegions.title",
    message: "PIB pe locuitor pe regiuni",
  }),
  "economy.gdpRegions.description": msg({
    id: "economy.gdpRegions.description",
    message:
      "PIB pe locuitor la paritatea puterii de cumpărare, indice față de media UE (UE27 = 100), pe cele 8 regiuni de dezvoltare (Eurostat).",
  }),
  "economy.debt.title": msg({
    id: "economy.debt.title",
    message: "Datoria publică",
  }),
  "economy.debt.description": msg({
    id: "economy.debt.description",
    message:
      "Datoria brută consolidată a administrației publice, % din PIB (Eurostat), cu pragul Maastricht de 60%.",
  }),
  "economy.debt.maastricht": msg({
    id: "economy.debt.maastricht",
    message: "Maastricht 60%",
  }),
  "economy.trade.title": msg({
    id: "economy.trade.title",
    message: "Comerțul internațional",
  }),
  "economy.trade.description": msg({
    id: "economy.trade.description",
    message:
      "Exporturile și importurile de bunuri și servicii, % din PIB (Eurostat), cu balanța derivată.",
  }),
  "economy.trade.exports": msg({
    id: "economy.trade.exports",
    message: "Exporturi",
  }),
  "economy.trade.imports": msg({
    id: "economy.trade.imports",
    message: "Importuri",
  }),
  "economy.trade.balance": msg({
    id: "economy.trade.balance",
    message: "Balanța",
  }),
  "economy.pensions.title": msg({
    id: "economy.pensions.title",
    message: "Îmbătrânirea populației și pensiile",
  }),
  "economy.pensions.description": msg({
    id: "economy.pensions.description",
    message:
      "Cheltuielile cu pensiile (execuție bugetară, mld. lei) față de raportul de dependență a vârstnicilor: 65+ la 100 de persoane 15–64.",
  }),
  "economy.pensions.pensionsLegend": msg({
    id: "economy.pensions.pensionsLegend",
    message: "Pensii (mld. lei)",
  }),
  "economy.pensions.dependencyLegend": msg({
    id: "economy.pensions.dependencyLegend",
    message: "Dependența vârstnicilor",
  }),
  "economy.deficit.title": msg({
    id: "economy.deficit.title",
    message: "Deficitul bugetar trimestrial",
  }),
  "economy.deficit.description": msg({
    id: "economy.deficit.description",
    message:
      "Deficitul (−)/excedentul (+) administrației publice, % din PIB (Eurostat, date GFS trimestriale), cu pragul Maastricht de −3%.",
  }),
  "economy.deficit.maastricht": msg({
    id: "economy.deficit.maastricht",
    message: "Maastricht −3%",
  }),
  "economy.kpi.deficit": msg({
    id: "economy.kpi.deficit",
    message: "Deficit bugetar",
  }),
  "economy.employment.title": msg({
    id: "economy.employment.title",
    message: "Rata de ocupare",
  }),
  "economy.employment.description": msg({
    id: "economy.employment.description",
    message:
      "Ponderea populației 20–64 de ani angajate, ajustat sezonier (Eurostat).",
  }),
  "economy.kpi.employment": msg({
    id: "economy.kpi.employment",
    message: "Ocupare 20–64",
  }),
  "economy.currentAccount.title": msg({
    id: "economy.currentAccount.title",
    message: "Contul curent",
  }),
  "economy.currentAccount.description": msg({
    id: "economy.currentAccount.description",
    message:
      "Balanța contului curent cu restul lumii, trimestrial, în miliarde de euro (Eurostat, BPM6). Barele roșii = deficit extern.",
  }),
  "economy.kpi.currentAccount": msg({
    id: "economy.kpi.currentAccount",
    message: "Cont curent",
  }),
  "economy.mldEur": msg({ id: "economy.mldEur", message: "mld. €" }),
  "economy.rates.title": msg({
    id: "economy.rates.title",
    message: "Dobânda BCE",
  }),
  "economy.rates.description": msg({
    id: "economy.rates.description",
    message:
      "Rata dobânzii la facilitatea de depozit a Băncii Centrale Europene — reperul politicii monetare pentru RON.",
  }),
  "economy.kpi.rates": msg({
    id: "economy.kpi.rates",
    message: "Dobânda BCE",
  }),
  "economy.kpi.currentAccountSub": msg({
    id: "economy.kpi.currentAccountSub",
    message: "trimestrial",
  }),
  "source.eurostat": msg({ id: "source.eurostat", message: "Sursă: Eurostat" }),
  "provenance.line": msg({
    id: "provenance.line",
    message: "Date: {source}, {year}",
  }),
  "provenance.budget": msg({
    id: "provenance.budget",
    message: "Buget consolidat (Open Budget)",
  }),
  "source.updatedAt": msg({
    id: "source.updatedAt",
    message: "Sursă actualizată la {date}",
  }),
  "source.ecb": msg({ id: "source.ecb", message: "Sursă: BCE" }),
  "nav.companies": msg({
    id: "nav.companies",
    message: "Companii de stat",
  }),
  "nav.nationalBalance": msg({
    id: "nav.nationalBalance",
    message: "Bilanțul național",
  }),
  "salary.title": msg({ id: "salary.title", message: "Situația ta fiscală" }),
  "salary.description": msg({
    id: "salary.description",
    message:
      "Câți bani din costul muncii tale ajung la stat și câți îți rămân.",
  }),
  "salary.grossLabel": msg({
    id: "salary.grossLabel",
    message: "Salariu brut (lei/lună)",
  }),
  "salary.perMonth": msg({ id: "salary.perMonth", message: "/ lună" }),
  "salary.rateNote": msg({
    id: "salary.rateNote",
    message:
      "Calcul ilustrativ cu ratele fiscale ale bugetului 2026 — nu este consultanță fiscală.",
  }),
  "salary.netStat": msg({ id: "salary.netStat", message: "Îți rămân" }),
  "salary.stateShareStat": msg({
    id: "salary.stateShareStat",
    message: "Ia statul",
  }),
  "salary.effectiveRate": msg({
    id: "salary.effectiveRate",
    message: "Povară fiscală efectivă",
  }),
  "salary.vsAverage": msg({
    id: "salary.vsAverage",
    message: "față de salariul mediu net (estimat)",
  }),
  "salary.estimateLoading": msg({
    id: "salary.estimateLoading",
    message: "Estimare salariu mediu…",
  }),
  "salary.entry.gross": msg({
    id: "salary.entry.gross",
    message: "Cost total angajator",
  }),
  "salary.entry.employerContribution": msg({
    id: "salary.entry.employerContribution",
    message: "Contribuție angajator (CAM 2,25%)",
  }),
  "salary.entry.cas": msg({
    id: "salary.entry.cas",
    message: "CAS — pensii (25%)",
  }),
  "salary.entry.cass": msg({
    id: "salary.entry.cass",
    message: "CASS — sănătate (10%)",
  }),
  "salary.entry.incomeTax": msg({
    id: "salary.entry.incomeTax",
    message: "Impozit pe venit (10%)",
  }),
  "salary.entry.estimatedVat": msg({
    id: "salary.entry.estimatedVat",
    message: "TVA estimat (consum)",
  }),
  "salary.entry.net": msg({ id: "salary.entry.net", message: "Net salariat" }),
  "realWage.title": msg({
    id: "realWage.title",
    message: "Salariul real vs. nominal",
  }),
  "realWage.description": msg({
    id: "realWage.description",
    message:
      "Câștigul mediu lunar brut estimat (Eurostat), nominal și ajustat cu inflația HICP. Când linia roșie crește mai încet decât cea albastră, puterea de cumpărare scade.",
  }),
  "realWage.nominal": msg({
    id: "realWage.nominal",
    message: "Câștig brut nominal",
  }),
  "realWage.real": msg({
    id: "realWage.real",
    message: "Câștig real (prețuri constante)",
  }),
  "wageContext.title": msg({
    id: "wageContext.title",
    message: "Context salarial",
  }),
  "wageContext.description": msg({
    id: "wageContext.description",
    message:
      "INS nu publică salariul mediu lunar ca serie de date curată; folosim indicele costului muncii ca tendință și câștigul mediu anual brut din Ancheta structurală (o dată la 4 ani).",
  }),
  "wageContext.lciTitle": msg({
    id: "wageContext.lciTitle",
    message: "Indicele costului muncii",
  }),
  "wageContext.lciDescription": msg({
    id: "wageContext.lciDescription",
    message:
      "Variația anuală a costului orar al muncii în economie, % față de același trimestru al anului trecut (Eurostat).",
  }),
  "wageContext.anchor": msg({
    id: "wageContext.anchor",
    message: "Câștig mediu anual brut ({year})",
  }),
  "wageContext.anchorSub": msg({
    id: "wageContext.anchorSub",
    message: "€ pe an · angajați",
  }),
  "wageContext.monthlyTitle": msg({
    id: "wageContext.monthlyTitle",
    message: "Salariul mediu brut lunar (estimare)",
  }),
  "wageContext.monthlyDescription": msg({
    id: "wageContext.monthlyDescription",
    message:
      "Estimare: nivelul mediu anual brut (Ancheta structurală a câștigurilor, Eurostat) ajustat cu indicele costului muncii (LCI). Compară cu salariul tău brut din secțiunea de mai sus.",
  }),
  "wageContext.estimatedNote": msg({
    id: "wageContext.estimatedNote",
    message: "Serie estimată — nu este salariul mediu oficial publicat de INS.",
  }),
  "balance.title": msg({
    id: "balance.title",
    message: "Venituri și cheltuieli",
  }),
  "balance.description": msg({
    id: "balance.description",
    message:
      "Bugetul consolidat pe ani: venituri, cheltuieli și deficit, pe modelul Open Budget.",
  }),
  "year.label": msg({ id: "year.label", message: "Anul" }),
  "year.groupLabel": msg({ id: "year.groupLabel", message: "Anul bugetar" }),
  "year.inProgress": msg({ id: "year.inProgress", message: "în curs" }),
  "year.inProgressCaption": msg({
    id: "year.inProgressCaption",
    message:
      "Execuție în curs — sumele cresc pe măsură ce rapoartele lunare intră.",
  }),
  "balance.kpi.revenue": msg({
    id: "balance.kpi.revenue",
    message: "Venituri",
  }),
  "balance.kpi.expenditure": msg({
    id: "balance.kpi.expenditure",
    message: "Cheltuieli",
  }),
  "balance.kpi.deficit": msg({ id: "balance.kpi.deficit", message: "Deficit" }),
  "balance.kpi.deficitGdp": msg({
    id: "balance.kpi.deficitGdp",
    message: "Deficit (% PIB)",
  }),
  "balance.debtGauge.reference": msg({
    id: "balance.debtGauge.reference",
    message: "Referință UE (Maastricht): 3% din PIB",
  }),
  "comparison.title": msg({
    id: "comparison.title",
    message: "Buget adoptat vs. execuție",
  }),
  "comparison.description": msg({
    id: "comparison.description",
    message:
      "Cât deficit a promis legea bugetului (MFP) și cât s-a executat în realitate (transparenta.eu). Deficitul este comparabil direct — transferurile între fonduri se anulează.",
  }),
  "comparison.kpi.adoptedDeficit": msg({
    id: "comparison.kpi.adoptedDeficit",
    message: "Deficit adoptat",
  }),
  "comparison.kpi.executedDeficit": msg({
    id: "comparison.kpi.executedDeficit",
    message: "Deficit executat",
  }),
  "comparison.kpi.delta": msg({
    id: "comparison.kpi.delta",
    message: "Depășire față de lege",
  }),
  "comparison.kpi.executedGdp": msg({
    id: "comparison.kpi.executedGdp",
    message: "Execuție % PIB",
  }),
  "comparison.legend.adopted": msg({
    id: "comparison.legend.adopted",
    message: "Adoptat (legea bugetului)",
  }),
  "comparison.legend.executed": msg({
    id: "comparison.legend.executed",
    message: "Execuție",
  }),
  "comparison.scopeNote": msg({
    id: "comparison.scopeNote",
    message:
      "Bugetul adoptat acoperă bugetul de stat și fondurile BASS, BSAN, BSOM (MFP, data.gov.ro); execuția acoperă aceiași ordonatori principali (transparenta.eu). Ambele includ transferurile intra-bugetare.",
  }),
  "comparison.unavailable": msg({
    id: "comparison.unavailable",
    message:
      "Comparația adoptat vs. execuție este indisponibilă — sursa de date nu a răspuns.",
  }),
  "sankey.title": msg({
    id: "sankey.title",
    message: "De unde vin banii și unde se duc",
  }),
  "sankey.description": msg({
    id: "sankey.description",
    message:
      "Fluxul banilor publici: surse de venit → buget consolidat → destinații. Deficitul apare ca sursă (împrumut).",
  }),
  "sankey.node.revenue": msg({
    id: "sankey.node.revenue",
    message: "Venituri",
  }),
  "sankey.node.deficit": msg({
    id: "sankey.node.deficit",
    message: "Deficit (împrumut)",
  }),
  "sankey.node.budget": msg({
    id: "sankey.node.budget",
    message: "Buget consolidat",
  }),
  "sankey.node.rest": msg({
    id: "sankey.node.rest",
    message: "Alte destinații",
  }),
  "sankey.rest.summary": msg({
    id: "sankey.rest.summary",
    message: "Ce intră în „Alte destinații”: {count} destinații mai mici",
  }),
  "treemap.title": msg({
    id: "treemap.title",
    message: "Destinația cheltuielilor",
  }),
  "treemap.description": msg({
    id: "treemap.description",
    message:
      "Suprafața fiecărui dreptunghi este proporțională cu suma alocată.",
  }),
  "context.title": msg({
    id: "context.title",
    message: "Context social",
  }),
  "context.description": msg({
    id: "context.description",
    message:
      "Cheltuielile publice pentru sănătate (bare, mld. EUR, Eurostat COFOG) alături de un indicator social (linie) — banii alocați vs. rezultatul măsurabil.",
  }),
  "context.budgetLabel": msg({
    id: "context.budgetLabel",
    message: "Cheltuieli cu sănătatea",
  }),
  "context.budgetUnit": msg({
    id: "context.budgetUnit",
    message: "miliarde EUR",
  }),
  "context.metricLabel": msg({
    id: "context.metricLabel",
    message: "Indicator urmărit",
  }),
  "context.insight": msg({
    id: "context.insight",
    message:
      "Față de 2021, bugetul sănătății s-a modificat cu {budgetChange}; indicatorul „{insLabel}”: {insChange}.",
  }),
  "drilldown.breadcrumb.root": msg({
    id: "drilldown.breadcrumb.root",
    message: "Bilanțul național",
  }),
  "drilldown.breadcrumb.destinations": msg({
    id: "drilldown.breadcrumb.destinations",
    message: "Destinații",
  }),
  "drilldown.title": msg({
    id: "drilldown.title",
    message: "Structura instituțională: {destination}",
  }),
  "drilldown.description": msg({
    id: "drilldown.description",
    message:
      "Instituțiile finanțate din această destinație, cu ponderea fiecăreia în total.",
  }),
  "drilldown.loading": msg({
    id: "drilldown.loading",
    message: "Se încarcă instituțiile…",
  }),
  "drilldown.error": msg({
    id: "drilldown.error",
    message: "Nu am putut încărca instituțiile — încearcă din nou.",
  }),
  "drilldown.empty": msg({
    id: "drilldown.empty",
    message: "Fără instituții listate pentru această destinație.",
  }),
  "drilldown.share": msg({
    id: "drilldown.share",
    message: "{sharePercent} din total",
  }),
  "drilldown.total": msg({ id: "drilldown.total", message: "Total" }),
  "drilldown.close": msg({ id: "drilldown.close", message: "Închide" }),
  "investments.title": msg({
    id: "investments.title",
    message: "Investiții publice pe județe",
  }),
  "investments.description": msg({
    id: "investments.description",
    message:
      "Programul de investiții 2026, pe județe. Cartogramă: suprafața = suma alocată, culoarea = intensitatea față de celelalte județe.",
  }),
  "investments.shareOfTotal": msg({
    id: "investments.shareOfTotal",
    message: "{sharePercent} din total",
  }),
  "investments.legendMin": msg({
    id: "investments.legendMin",
    message: "mai puțin",
  }),
  "investments.legendMax": msg({
    id: "investments.legendMax",
    message: "mai mult",
  }),
  "investments.estimatedNote": msg({
    id: "investments.estimatedNote",
    message:
      "Estimare: programul de investiții publice 2026 nu are o sursă publică structurată la nivel de județ; sumele sunt aproximative.",
  }),
  "source.demo": msg({ id: "source.demo", message: "Demo" }),
  "error.title": msg({ id: "error.title", message: "Ceva nu a mers bine" }),
  "error.reload": msg({
    id: "error.reload",
    message: "Reîncarcă pagina sau încearcă din nou mai târziu.",
  }),
  "source.ins": msg({ id: "source.ins", message: "Sursă: INS Tempo" }),
  "source.bnr": msg({ id: "source.bnr", message: "Sursă: BNR" }),
  "source.mfp": msg({
    id: "source.mfp",
    message: "Sursă: MFP via data.gov.ro",
  }),
  "source.transparenta": msg({
    id: "source.transparenta",
    message: "Sursă: transparenta.eu",
  }),
  "source.budget": msg({
    id: "source.budget",
    message: "Sursă: Buget consolidat",
  }),
  // ── Companii de stat ──────────────────────────────────────────────────
  "soe.title": msg({
    id: "soe.title",
    message: "Companiile de stat ale României",
  }),
  "soe.description": msg({
    id: "soe.description",
    message:
      "Indicatori financiari, salarii și subvenții pentru companiile de stat — date publice, 2019–2024.",
  }),
  "soe.kpi.companies": msg({
    id: "soe.kpi.companies",
    message: "Companii de stat",
  }),
  "soe.kpi.revenue": msg({
    id: "soe.kpi.revenue",
    message: "Cifra de afaceri",
  }),
  "soe.kpi.profit": msg({
    id: "soe.kpi.profit",
    message: "Profit net",
  }),
  "soe.kpi.losses": msg({
    id: "soe.kpi.losses",
    message: "Pierderi nete",
  }),
  "soe.kpi.updated": msg({
    id: "soe.kpi.updated",
    message: "Date {year} · actualizat {date} · {companies} companii cu date",
  }),
  "soe.scatter.title": msg({
    id: "soe.scatter.title",
    message: "Salariu vs. performanță",
  }),
  "soe.scatter.description": msg({
    id: "soe.scatter.description",
    message:
      "Fiecare punct este o companie de stat: marja netă 2024 (orizontală) față de salariul maxim lunar din conducere (verticală). Clic pe un punct pentru fișa companiei.",
  }),
  "soe.scatter.x": msg({ id: "soe.scatter.x", message: "Marja netă (%)" }),
  "soe.scatter.y": msg({
    id: "soe.scatter.y",
    message: "Salariu maxim (lei/lună)",
  }),
  "soe.scatter.breakEven": msg({
    id: "soe.scatter.breakEven",
    message: "Pragul profitului",
  }),
  "soe.scatter.minWage": msg({
    id: "soe.scatter.minWage",
    message: "Salariu minim brut",
  }),
  "soe.scatter.open": msg({
    id: "soe.scatter.open",
    message: "Deschide fișa {company}",
  }),
  "soe.sectors.title": msg({
    id: "soe.sectors.title",
    message: "Companiile pe pierdere, pe sectoare",
  }),
  "soe.sectors.description": msg({
    id: "soe.sectors.description",
    message:
      "Ponderea companiilor pe pierdere în fiecare sector economic, 2019–2024.",
  }),
  "soe.sectors.y": msg({
    id: "soe.sectors.y",
    message: "Ponderea pe pierdere (%)",
  }),
  "soe.counties.title": msg({
    id: "soe.counties.title",
    message: "Companiile de stat pe județe",
  }),
  "soe.counties.description": msg({
    id: "soe.counties.description",
    message:
      "Dimensiunea pătratului = cifra de afaceri; nuanța = ponderea companiilor pe pierdere.",
  }),
  "soe.counties.lossPct": msg({
    id: "soe.counties.lossPct",
    message: "pe pierdere",
  }),
  "soe.subsidies.title": msg({
    id: "soe.subsidies.title",
    message: "Subvenții locale",
  }),
  "soe.subsidies.description": msg({
    id: "soe.subsidies.description",
    message:
      "Subvenții plătite de primării companiilor de stat — primii operatori ca valoare.",
  }),
  "soe.subsidies.total": msg({
    id: "soe.subsidies.total",
    message: "Total {year}: {total}",
  }),
  "soe.listed.title": msg({
    id: "soe.listed.title",
    message: "Companii de stat listate la BVB",
  }),
  "soe.listed.description": msg({
    id: "soe.listed.description",
    message:
      "Pachetele majoritare ale statului la Bursa de Valori București, cu evoluția prețului acțiunii.",
  }),
  "soe.listed.profit": msg({
    id: "soe.listed.profit",
    message: "Profit net consolidat",
  }),
  "soe.listed.state": msg({
    id: "soe.listed.state",
    message: "Stat: {percent}%",
  }),
  "soe.company.status": msg({
    id: "soe.company.status",
    message: "Status",
  }),
  "soe.company.sector": msg({ id: "soe.company.sector", message: "Sector" }),
  "soe.company.county": msg({ id: "soe.company.county", message: "Județ" }),
  "soe.company.marginHistory": msg({
    id: "soe.company.marginHistory",
    message: "Marja netă pe ani (%)",
  }),
  "soe.company.management": msg({
    id: "soe.company.management",
    message: "Conducere",
  }),
  "soe.company.mfin": msg({
    id: "soe.company.mfin",
    message: "Bilanț MFin 2024",
  }),
  "soe.company.ca": msg({ id: "soe.company.ca", message: "Cifra de afaceri" }),
  "soe.company.profit": msg({
    id: "soe.company.profit",
    message: "Profit net",
  }),
  "soe.company.loss": msg({
    id: "soe.company.loss",
    message: "Pierdere netă",
  }),
  "soe.company.employees": msg({
    id: "soe.company.employees",
    message: "Angajați",
  }),
  "soe.company.capital": msg({
    id: "soe.company.capital",
    message: "Capitaluri proprii",
  }),
  "soe.company.subsidy": msg({
    id: "soe.company.subsidy",
    message: "Subvenție 2025",
  }),
  "soe.company.close": msg({ id: "soe.company.close", message: "Închide" }),
  "soe.company.loading": msg({
    id: "soe.company.loading",
    message: "Se încarcă fișa companiei…",
  }),
  "soe.unavailable": msg({
    id: "soe.unavailable",
    message: "Sursa de date e indisponibilă momentan.",
  }),
  "soe.source": msg({ id: "soe.source", message: "companiidestat.ro" }),
  "section.error": msg({
    id: "section.error",
    message: "Datele nu au putut fi încărcate.",
  }),
  "section.retry": msg({ id: "section.retry", message: "Reîncearcă" }),
  "section.demo": msg({ id: "section.demo", message: "date demo" }),
  "section.emptyYear": msg({
    id: "section.emptyYear",
    message: "Nu există date demo pentru anul {year}.",
  }),
  "balance.kpi.partialYear": msg({
    id: "balance.kpi.partialYear",
    message: "An parțial — execuție până la zi",
  }),
  "about.title": msg({
    id: "about.title",
    message: "Despre",
  }),
  "about.intro": msg({
    id: "about.intro",
    message:
      "Bugetul României este un tablou de bord cetățenesc, un proiect educațional independent care arată bugetul consolidat și indicatori economici și sociali din surse publice oficiale.",
  }),
  "about.operator": msg({
    id: "about.operator",
    message:
      "Proiectul este realizat de Cristian Nichifor. Pentru întrebări, corecturi sau date greșite:",
  }),
  "about.contactLink": msg({
    id: "about.contactLink",
    message: "deschide un issue pe GitHub",
  }),
  "about.contents": msg({ id: "about.contents", message: "Cuprins" }),
  "about.method.title": msg({ id: "about.method.title", message: "Metodă" }),
  "about.method.salary": msg({
    id: "about.method.salary",
    message:
      "Calculul salarial urmează modelul Open Budget 2026: CAS 25% și CASS 10% din brut, impozit pe venit 10% din (brut − CAS − CASS), contribuția angajatorului (CAM) 2,25% din brut și o estimare a TVA plătite din consum (21% aplicat la 75% din venitul net).",
  }),
  "about.method.estimate": msg({
    id: "about.method.estimate",
    message:
      "Regula „estimare”: orice valoare care nu vine direct dintr-o sursă, ci dintr-o formulă sau o presupunere (cota de consum, cursul valutar), este marcată „estimare” acolo unde apare.",
  }),
  "about.method.money": msg({
    id: "about.method.money",
    message:
      "Sumele sunt calculate fără virgulă mobilă (decimal.js) și rotunjite doar la afișare.",
  }),
  "about.sources.col.source": msg({
    id: "about.sources.col.source",
    message: "Sursă",
  }),
  "about.sources.col.use": msg({
    id: "about.sources.col.use",
    message: "Folosită pentru",
  }),
  "about.sources.col.licence": msg({
    id: "about.sources.col.licence",
    message: "Licență",
  }),
  "about.sources.title": msg({
    id: "about.sources.title",
    message: "Surse de date și licențe",
  }),
  "about.sources.description": msg({
    id: "about.sources.description",
    message:
      "Fiecare grafic își arată sursa pe card. Datele sunt preluate prin API-ul proiectului din sursele de mai jos, în condițiile stabilite de fiecare sursă.",
  }),
  "about.source.eurostat": msg({
    id: "about.source.eurostat",
    message:
      "Inflație, șomaj, PIB, datorie, salarii, societate, energie, piața muncii, justiție",
  }),
  "about.source.ecb": msg({
    id: "about.source.ecb",
    message: "Cursul EUR/RON și dobânda la facilitatea de depozit",
  }),
  "about.source.mfp": msg({
    id: "about.source.mfp",
    message: "Bugetul adoptat și comparația adoptat–executat",
  }),
  "about.source.soe": msg({
    id: "about.source.soe",
    message: "Companiile de stat",
  }),
  "about.source.bnr": msg({
    id: "about.source.bnr",
    message: "Ținta de inflație",
  }),
  "about.source.transparenta": msg({
    id: "about.source.transparenta",
    message: "Execuția bugetară",
  }),
  "about.source.openBudget": msg({
    id: "about.source.openBudget",
    message:
      "Datele demo pentru 2026, folosite doar când site-ul rulează fără API",
  }),
  "about.licence": msg({
    id: "about.licence",
    message: "Licență",
  }),
  "about.licence.none": msg({
    id: "about.licence.none",
    message: "sursa nu declară o licență",
  }),
  "about.licence.terms": msg({
    id: "about.licence.terms",
    message: "termenii sursei",
  }),
  "about.privacy.title": msg({
    id: "about.privacy.title",
    message: "Confidențialitate",
  }),
  "about.privacy.tracking": msg({
    id: "about.privacy.tracking",
    message:
      "Site-ul nu folosește cookie-uri, nu rulează analytics și nu urmărește vizitatorii. Nu salvează nimic în browserul tău și nu încarcă resurse de la terți.",
  }),
  "about.privacy.hosting": msg({
    id: "about.privacy.hosting",
    message:
      "Paginile și API-ul sunt găzduite pe Cloudflare Workers. Ca orice furnizor de găzduire, Cloudflare primește cererile tale, inclusiv adresa IP, ca să livreze paginile.",
  }),
  "about.code.title": msg({
    id: "about.code.title",
    message: "Cod sursă",
  }),
  "about.code.description": msg({
    id: "about.code.description",
    message: "Codul este deschis, sub licența MIT:",
  }),
  "footer.about": msg({
    id: "footer.about",
    message: "Despre",
  }),
  "soe.kpi.centralLocal": msg({
    id: "soe.kpi.centralLocal",
    message: "{central} centrale · {local} locale",
  }),
  "soe.onLoss": msg({
    id: "soe.onLoss",
    message: "{count} pe pierdere",
  }),
  "soe.county.summary": msg({
    id: "soe.county.summary",
    message: "{companies} companii · {onLoss} pe pierdere ({lossPercent})",
  }),
  "soe.county.lossShare": msg({
    id: "soe.county.lossShare",
    message: "{lossPercent} pe pierdere",
  }),
  "economy.percentGdp": msg({
    id: "economy.percentGdp",
    message: "% PIB",
  }),
  "source.budgetYear": msg({
    id: "source.budgetYear",
    message: "Sursă: Buget consolidat {year}",
  }),
  "soe.scatter.offScale": msg({
    id: "soe.scatter.offScale",
    message:
      "▲ {count} companii cu marja în afara intervalului ±100% sunt fixate pe margine; valoarea reală apare la hover.",
  }),
  "leuBridge.title": msg({
    id: "leuBridge.title",
    message: "Ce cumpără 1 leu din taxele tale",
  }),
  "leuBridge.description": msg({
    id: "leuBridge.description",
    message:
      "Cei {amount} pe lună care ajung la stat, împărțiți după destinațiile bugetului.",
  }),
  "leuBridge.estimate": msg({ id: "leuBridge.estimate", message: "Estimare" }),
  "leuBridge.destination": msg({
    id: "leuBridge.destination",
    message: "Destinație",
  }),
  "leuBridge.perLeu": msg({ id: "leuBridge.perLeu", message: "Din 1 leu" }),
  "leuBridge.perMonth": msg({
    id: "leuBridge.perMonth",
    message: "Din contribuția ta lunară",
  }),
  "leuBridge.bani": msg({ id: "leuBridge.bani", message: "bani" }),
  "leuBridge.note": msg({
    id: "leuBridge.note",
    message:
      "Estimare: taxele nu sunt alocate pe destinații. Contribuția este împărțită proporțional cu cheltuielile bugetului consolidat, deci arată unde merge un leu mediu, nu leul tău anume.",
  }),
} satisfies Record<string, MessageDescriptor>;

export type MessageId = keyof typeof m;

export function lookupMessage(id: string): MessageDescriptor {
  return (m as Record<string, MessageDescriptor>)[id] ?? { id };
}
