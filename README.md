# MVP E-commerce Microservices (Local practice)

This workspace is a lightweight, local-first microservices example you can use to practice an SDLC cycle: design, scaffold, implement, test, and deploy locally.

Overview

- Frontend: React app in `frontend/`
- API Gateway: `gateway/` (routes to services)
- Services (each in `services/<name>`):
  - `auth-service` — registration, login, JWT
  - `user-service` — user profile and account management
  - `product-service` — product catalog + inventory
  - `order-service` — cart and order creation
  - `payment-service` — wallet balance and payment logic (dummy)
- Infra: `infra/` contains docker-compose for local SQL Server and other infra

Design principles

- Each service is a standalone ASP.NET Core Web API project.
- Services own their own data (separate SQL Server schemas/databases).
- The API Gateway routes client requests and handles auth token validation (can be Ocelot or a simple gateway).
- Frontend talks only to the Gateway.

Functional MVP flows

1. User signup/login (Auth service) — issues JWT.
2. Product listing (Product service) — shows price & stock.
3. Add to cart & checkout (Order service) — creates order after payment success.
4. Payment (Payment service) — wallet-based; if insufficient funds, order fails.
5. Inventory (Product service) — stock decremented when order succeeds; out-of-stock prevents add-to-cart.

How to proceed (high-level)

1. `dotnet` SDK and Node (for React) installed locally.
2. Run SQL Server locally (we provide an optional Docker Compose file).
3. Scaffold each ASP.NET Core service, configure EF Core with SQL Server provider.
4. Implement Auth service first (register/login) and test with Postman.
5. Implement Product and Payment services and wire Order service.
6. Scaffold React frontend and connect to Gateway.

Next steps I will take for you (unless you prefer a different ordering)

- Scaffold repository structure (done).
- Create minimal ASP.NET Core project templates for each service (health endpoints and DB config).
- Provide docker-compose in `infra/` to run SQL Server locally and instructions to run everything.

If you want, I can now:

- Scaffold the minimal code for each backend service (Program.cs, csproj, health controller) so you can run them with `dotnet run`.
- Implement the full Auth service (register/login) connected to SQL Server and add a small React signup/login UI.

Which of the above should I do next? (I recommend: scaffold minimal projects for all services, then implement Auth.)
