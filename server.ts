import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Shopee API Proxy
  app.post("/api/shopee/auth", async (req, res) => {
    const { appId, appSecret } = req.body;
    
    if (!appId || !appSecret) {
      return res.status(400).json({ error: "App ID and App Secret are required" });
    }

    try {
      // In a real scenario, we would make a test call to Shopee API to verify credentials
      // For this demo, we'll simulate the authentication and data fetching
      // Shopee Affiliate API usually requires a specific signature
      
      // Mocking a successful connection check
      // If appId is "error", we simulate a failure
      if (appId === "error") {
        throw new Error("Invalid credentials");
      }

      res.json({ status: "CONNECTED", message: "Successfully authenticated with Shopee" });
    } catch (error: any) {
      res.status(401).json({ status: "CONNECTION ERROR", error: error.message });
    }
  });

  app.post("/api/shopee/data", async (req, res) => {
    const { appId, appSecret } = req.body;
    
    // Simulate fetching data from Shopee
    // In a real app, you'd use appId/appSecret to sign requests to:
    // https://open-api.affiliate.shopee.com.br/v2/api/graphql (or similar)
    
    const mockData = {
      metrics: {
        totalProductsSold: 1245,
        totalSalesValue: 45670.50,
        commissionReceived: 3240.25,
        commissionPending: 850.75,
        commissionOverall: 4091.00,
        commissionPercentage: 8.96,
        avgOrderValue: 36.68,
        avgCommissionPerOrder: 3.28
      },
      charts: {
        daily: [
          { name: 'Seg', sales: 400, commission: 40 },
          { name: 'Ter', sales: 300, commission: 30 },
          { name: 'Qua', sales: 600, commission: 60 },
          { name: 'Qui', sales: 800, commission: 80 },
          { name: 'Sex', sales: 500, commission: 50 },
          { name: 'Sáb', sales: 900, commission: 90 },
          { name: 'Dom', sales: 700, commission: 70 },
        ],
        weekly: [
          { name: 'Semana 1', sales: 2400, commission: 240 },
          { name: 'Semana 2', sales: 1398, commission: 140 },
          { name: 'Semana 3', sales: 9800, commission: 980 },
          { name: 'Semana 4', sales: 3908, commission: 390 },
        ],
        monthly: [
          { name: 'Jan', sales: 4000, commission: 400 },
          { name: 'Fev', sales: 3000, commission: 300 },
          { name: 'Mar', sales: 2000, commission: 200 },
          { name: 'Abr', sales: 2780, commission: 278 },
          { name: 'Mai', sales: 1890, commission: 189 },
          { name: 'Jun', sales: 2390, commission: 239 },
        ]
      },
      topProducts: [
        { id: 1, name: "Fone de Ouvido Bluetooth Pro", sold: 150, revenue: 4500, commission: 450 },
        { id: 2, name: "Smartwatch Series 7", sold: 85, revenue: 12750, commission: 1275 },
        { id: 3, name: "Cabo USB-C Turbo", sold: 320, revenue: 3200, commission: 320 },
        { id: 4, name: "Mochila Impermeável", sold: 45, revenue: 2250, commission: 225 },
        { id: 5, name: "Kit de Ferramentas", sold: 60, revenue: 6000, commission: 600 },
      ]
    };

    res.json(mockData);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
