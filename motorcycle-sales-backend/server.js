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
      if (err) {
        console.error("Error fetching motorcycle:", err);
        return res.status(500).send("Error fetching motorcycle");
      }
      if (motorcycleResults.length === 0) {
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

      const purchaseDateObj = new Date(purchaseDate);
      const purchaseDateOnly = purchaseDateObj.toISOString().slice(0, 10); // Format YYYY-MM-DD

      // Query untuk memeriksa apakah promo berlaku
      db.query(
        "SELECT * FROM promo_ranges WHERE start_date <= ? AND end_date >= ?",
        [purchaseDateOnly, purchaseDateOnly],
        (err, promoResults) => {
          if (err) {
            console.error("Error checking promo:", err);
            return res.status(500).send("Error checking promo");
          }

          let promoDiscount = 0;
          let promoApplied = 0;
          if (promoResults.length > 0) {
            promoApplied = 1;
            promoDiscount = installmentAmount * 0.5; // Diskon 50% untuk 2 bulan terakhir
          }

          const totalInstallmentAmount =
            installmentAmount * installmentPeriod - promoDiscount * 2; // Diskon 2 bulan terakhir
          const totalAmount = basePrice + totalInstallmentAmount;

          // Simpan data pembelian
          const query =
            "INSERT INTO purchases (buyer_name, purchase_date, motorcycle_id, installment_period, total_price, promo_applied) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(
            query,
            [
              buyerName,
              purchaseDateOnly,
              motorcycle.id,
              installmentPeriod,
              totalAmount,
              promoApplied,
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

                // Diskon untuk 2 bulan terakhir jika promo diterapkan
                if (promoApplied && i > installmentPeriod - 2) {
                  amount = installmentAmount * 0.5;
                }

                db.query(
                  "INSERT INTO installments (purchase_id, installment_no, amount, due_date) VALUES (?, ?, ?, ?)",
                  [purchaseId, i, amount, dueDate.toISOString().slice(0, 10)],
                  (err) => {
                    if (err) {
                      console.error("Error saving installment:", err);
                    }
                  }
                );
              }

              res.status(200).json({
                message: "Purchase saved successfully!",
                purchaseId: purchaseId,
              });
            }
          );
        }
      );
    }
  );
});

// API untuk mengambil detail pembelian beserta angsuran
app.get("/api/purchase/:id", (req, res) => {
  const purchaseId = req.params.id;

  // Query untuk mengambil detail pembelian
  const purchaseQuery = `
    SELECT purchases.buyer_name, purchases.purchase_date, motorcycles.name AS motorcycle_name 
    FROM purchases 
    JOIN motorcycles ON purchases.motorcycle_id = motorcycles.id 
    WHERE purchases.id = ?`;

  db.query(purchaseQuery, [purchaseId], (err, purchaseResults) => {
    if (err) {
      console.error("Error fetching purchase details:", err);
      return res.status(500).send("Error fetching purchase details");
    }

    if (purchaseResults.length === 0) {
      return res.status(404).send("Purchase not found");
    }

    const purchaseDetails = purchaseResults[0];

    // Query untuk mengambil data angsuran
    const installmentQuery = `
      SELECT installment_no, amount, due_date 
      FROM installments 
      WHERE purchase_id = ?`;

    db.query(installmentQuery, [purchaseId], (err, installmentResults) => {
      if (err) {
        console.error("Error fetching installments:", err);
        return res.status(500).send("Error fetching installments");
      }

      res.json({
        purchaseDetails,
        installments: installmentResults,
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
