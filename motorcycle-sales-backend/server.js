const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Setup MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "motorcycle_dealer",
});

// Test DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// API untuk mengambil data sepeda motor
app.get("/api/motorcycles", (req, res) => {
  db.query("SELECT * FROM motorcycles", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// API untuk memproses pembelian dan generate laporan angsuran
app.post("/api/purchase", (req, res) => {
  const { buyerName, purchaseDate, motorcycleType, installmentPeriod } =
    req.body;

  // Ambil data sepeda motor berdasarkan tipe
  db.query(
    "SELECT * FROM motorcycles WHERE name = ?",
    [motorcycleType],
    (err, motorcycleResults) => {
      if (err || motorcycleResults.length === 0) {
        return res.status(404).send("Motorcycle not found");
      }

      const motorcycle = motorcycleResults[0];
      let basePrice = motorcycle.base_price;
      let installmentAmount = 0;

      // Hitung harga angsuran sesuai periode
      if (installmentPeriod === 5) {
        installmentAmount = (basePrice * 1.3) / installmentPeriod; // 30% tambahan
      } else if (installmentPeriod === 10) {
        installmentAmount = (basePrice * 1.5) / installmentPeriod; // 50% tambahan
      } else if (installmentPeriod === 15) {
        installmentAmount = (basePrice * 1.8) / installmentPeriod; // 80% tambahan
      }

      // Ambil tanggal dari purchaseDate dan format menjadi YYYY-MM-DD
      const purchaseDateObj = new Date(purchaseDate);
      const purchaseDateOnly = purchaseDateObj
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Format YYYY-MM-DD HH:MM:SS

      // Query untuk memeriksa apakah promo berlaku berdasarkan start_date dan end_date
      db.query(
        "SELECT * FROM promo_ranges WHERE start_date <= ? AND end_date >= ?",
        [purchaseDateOnly, purchaseDateOnly],
        (err, promoResults) => {
          if (err) throw err;

          let promoDiscount = 0;
          let promoApplied = 0;
          if (promoResults.length > 0) {
            // Promo diterapkan jika ada hasil yang cocok
            promoApplied = 1;
            promoDiscount = installmentAmount * 0.5; // Diskon 50% untuk 2 bulan terakhir
          }

          // Hitung total harga setelah diskon promo
          const totalInstallmentAmount =
            installmentAmount * installmentPeriod - promoDiscount * 2; // 2 bulan terakhir dapat diskon

          const totalAmount = basePrice + totalInstallmentAmount;

          // Simpan data pembelian
          const query =
            "INSERT INTO purchases (buyer_name, purchase_date, motorcycle_id, installment_period, total_price, promo_applied) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(
            query,
            [
              buyerName,
              purchaseDateOnly, // Menggunakan tanggal yang sudah diformat
              motorcycle.id,
              installmentPeriod,
              totalAmount,
              promoApplied, // Promo diterapkan jika promo ada
            ],
            (err, result) => {
              if (err) {
                console.error("Error saving purchase:", err);
                return res.status(500).send("Error saving purchase");
              }

              const purchaseId = result.insertId;

              // Simpan data angsuran
              for (let i = 1; i <= installmentPeriod; i++) {
                let dueDate = new Date(purchaseDate);
                dueDate.setMonth(dueDate.getMonth() + i);

                let amount = installmentAmount;

                // Jika bulan ke-i adalah 2 bulan terakhir dan promo diterapkan
                if (promoApplied && i > installmentPeriod - 2) {
                  amount = installmentAmount * 0.5; // Diskon 50% untuk 2 bulan terakhir
                }

                db.query(
                  "INSERT INTO installments (purchase_id, installment_no, amount, due_date) VALUES (?, ?, ?, ?)",
                  [purchaseId, i, amount, dueDate],
                  (err) => {
                    if (err) {
                      console.log("Error saving installments:", err);
                    }
                  }
                );
              }

              res.status(200).json({ message: "Purchase saved successfully!" });
            }
          );
        }
      );
    }
  );
});

// API untuk mengambil laporan pembelian
app.get("/api/reports", (req, res) => {
  const sql = `
    SELECT 
        p.buyer_name AS buyer_name,
        DATE(p.purchase_date) AS purchase_date,
        m.name AS motorcycle_name,
        GROUP_CONCAT(CONCAT('Angsuran ke-', i.installment_no, ': ', FORMAT(i.amount, 0)) ORDER BY i.installment_no ASC SEPARATOR ', ') AS installments
    FROM 
        purchases p
    JOIN 
        motorcycles m ON p.motorcycle_id = m.id
    JOIN 
        installments i ON p.id = i.purchase_id
    GROUP BY 
        p.id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching report:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
