# SpendFlow — Personal Expense Tracker Web Application

SpendFlow is a modern, full-stack personal finance and expense tracking web application. It combines an **HTML5/CSS3/JavaScript** frontend with a robust **Java 21 Spring Boot 3.3** backend and a **MySQL** relational database.

---

## 🌟 Key Features

- **Real-Time Financial Dashboard**:
  - Live Net Balance calculation (`Income - Expenses`).
  - Total Income and Total Expenses KPI cards.
  - Remaining Monthly Budget with automatic threshold status.
  - Interactive **Chart.js** 6-Month Income vs. Expense cash flow trend.
  - Category-wise spending doughnut breakdown.
  - Recent transactions activity feed.
  - Month & Year filter syncing all metrics on the fly.
- **Complete Expense Management**:
  - Full CRUD functionality (Create, Read, Update, Delete).
  - Search expenses by description or notes.
  - Filter by category and date range (`From` / `To`).
  - Sort by date or amount (Ascending / Descending).
  - Server-side pagination with clean controls.
  - Categories: Food, Transportation, Shopping, Bills, Healthcare, Education, Entertainment, Housing, Travel, and Other.
- **Income Management**:
  - Full CRUD for income records (Salary, Freelance, Business, Investments, Other).
  - Clearly highlighted in emerald green to distinguish from expense outflows.
  - Search, category filter, date range filter, and pagination.
- **Budget & Goal Management**:
  - Set an overall monthly spending limit.
  - Set category-specific budget limits (e.g., ₹12,000 cap on Food).
  - Visual dynamic progress bars.
  - **80% Budget Warning**: Highlights in amber when spending reaches 80%.
  - **Exceeded Budget Alert**: Turns red when spending exceeds 100%.
- **Analytics & Custom Reports**:
  - Multi-month trend comparisons.
  - Category distribution pie chart.
  - Period net savings and savings rate percentage.
  - Extreme transaction analysis (highest and lowest single expenses).
  - **Export to CSV**: Download generated reports directly as a CSV spreadsheet.
- **Polished Modern UI**:
  - Built with responsive CSS (no Tailwind required).
  - Professional dark-blue and purple accent palette.
  - Modal dialogs for adding/editing records.
  - Safe confirmation dialogs before deletions.
  - Non-intrusive toast notification alerts.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Vanilla CSS3, Modern JavaScript (ES6+ Fetch API), Chart.js 4.4, FontAwesome 6 |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Web, Spring Data JPA, Hibernate, Bean Validation |
| **Database** | MySQL 8.x (with H2 in-memory profile available for instant zero-config testing) |
| **Build Tool** | Apache Maven 3.x |

---

## 📂 Project Structure

```
expense-tracker/
├── pom.xml                               # Maven build configuration & dependencies
├── README.md                             # Comprehensive project documentation
├── .env.example                          # Environment variable template
├── database/
│   └── schema.sql                        # MySQL schema creation & seed script
└── src/
    ├── main/
    │   ├── java/com/expensetracker/
    │   │   ├── ExpenseTrackerApplication.java  # Spring Boot Main Entry Point
    │   │   ├── config/                   # WebMvc & DataInitializer configuration
    │   │   ├── controller/               # REST API Controllers (Expense, Income, Budget, Dashboard, Report)
    │   │   ├── dto/                      # Data Transfer Objects & API Response wrappers
    │   │   ├── entity/                   # JPA Entities (Expense, Income, Budget)
    │   │   ├── exception/                # GlobalExceptionHandler & Custom Exceptions
    │   │   ├── repository/               # Spring Data JPA Repositories
    │   │   └── service/                  # Business Logic & Calculation Services
    │   └── resources/
    │       ├── application.properties    # Primary MySQL & App Configuration
    │       ├── application-dev.properties# Standalone H2 Dev Profile Configuration
    │       └── static/                   # Frontend Web Assets (served directly by Spring Boot)
    │           ├── index.html            # Main Single-Page Interface
    │           ├── css/
    │           │   └── style.css         # Modern Design System & Responsive Styles
    │           └── js/
    │               ├── app.js            # Core App Router, Toasts & Modals
    │               ├── dashboard.js      # Dashboard KPIs & Chart.js Visualizations
    │               ├── expenses.js       # Expense CRUD, Filter, Sort, Pagination
    │               ├── income.js         # Income CRUD, Filter, Sort, Pagination
    │               ├── budgets.js        # Budget Limits, Progress Bars & Alerts
    │               └── reports.js        # Analytics, Charts & CSV Export
    └── test/
        ├── java/com/expensetracker/      # Comprehensive Unit & MockMvc Integration Tests
        └── resources/
            └── application.properties    # H2 In-Memory Test Configuration
```

---

## 🚀 Beginner-Friendly Setup & Run Guide

### Step 1: Verify Prerequisites

Open your terminal or command prompt and verify that you have Java and Maven installed:

```bash
# Verify Java version (Java 21 or later is recommended)
java -version

# Verify Maven version
mvn -v
```

---

### Step 2: Set Up MySQL Database

1. Open your MySQL command-line client or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
2. Create the database and tables using the provided script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   *Alternatively, run the SQL manually:*
   ```sql
   CREATE DATABASE IF NOT EXISTS expense_tracker_db;
   ```
   *(Hibernate will automatically create and update the tables on first startup thanks to `spring.jpa.hibernate.ddl-auto=update`)*.

---

### Step 3: Configure Database Credentials

You can supply your MySQL credentials via **environment variables** or by editing `src/main/resources/application.properties`.

#### Option A: Using Environment Variables (Recommended)
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/expense_tracker_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="your_mysql_password"
```

#### Option B: Direct in `src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

---

### Step 4: Build the Application

Compile and package the application using Maven:

```bash
mvn clean package
```

---

### Step 5: Start the Server

#### A. Running with MySQL (Default)
```bash
mvn spring-boot:run
```

#### B. Running in Zero-Setup Standalone Mode (H2 In-Memory)
If you do not have MySQL installed or want to immediately demo the application with zero external setup, run with the `dev` profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

When the application finishes booting, you will see:
```text
Started ExpenseTrackerApplication in X.XXX seconds (process running for ...)
```

---

### Step 6: Open the Application in Your Browser

Open your browser and navigate to:
```
http://localhost:8080
```

The application automatically seeds realistic sample expenses, incomes, and budgets upon first startup so you can immediately explore charts and transaction history!

---

## 📡 REST API Reference

All responses follow a consistent JSON envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-04-11T14:50:00"
}
```

### Expenses API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/expenses` | List expenses (supports `category`, `startDate`, `endDate`, `search`, `page`, `size`, `sortBy`, `direction`) |
| `GET` | `/api/expenses/{id}` | Retrieve expense by ID |
| `POST` | `/api/expenses` | Create a new expense |
| `PUT` | `/api/expenses/{id}` | Update an existing expense |
| `DELETE` | `/api/expenses/{id}` | Delete an expense |
| `GET` | `/api/expenses/categories` | List allowed expense categories |

### Income API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/income` | List incomes (supports `category`, `startDate`, `endDate`, `search`, `page`, `size`, `sortBy`, `direction`) |
| `GET` | `/api/income/{id}` | Retrieve income by ID |
| `POST` | `/api/income` | Record a new income |
| `PUT` | `/api/income/{id}` | Update an existing income |
| `DELETE` | `/api/income/{id}` | Delete an income record |
| `GET` | `/api/income/categories` | List allowed income categories |

### Dashboard API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | Retrieve monthly summary KPIs, trends, doughnut breakdown, and recent transactions (`?year=2026&month=4`) |
| `GET` | `/api/dashboard/monthly` | Retrieve 6-month historical income vs expense comparison |
| `GET` | `/api/dashboard/categories` | Retrieve category spending breakdown for selected month |

### Budgets API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/budgets` | List budgets for specified year and month with real calculated spending |
| `GET` | `/api/budgets/{id}` | Retrieve single budget by ID |
| `POST` | `/api/budgets` | Set or update monthly budget limit |
| `PUT` | `/api/budgets/{id}` | Modify budget limit |
| `DELETE` | `/api/budgets/{id}` | Delete budget limit |

### Reports & Analytics API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reports/analytics` | Period analytics with savings rate, extremes, monthly trends, and categories (`?startDate=&endDate=`) |
| `GET` | `/api/reports/monthly` | Multi-month trend comparisons (`?months=12`) |
| `GET` | `/api/reports/categories`| Category breakdown for date range |

---

## 🧪 Running Automated Tests

Run the full automated test suite containing unit tests and MockMvc REST integration tests:

```bash
mvn test
```

All tests execute against an isolated in-memory H2 database with zero side effects on production data.

---

## 🛠️ Troubleshooting

1. **Port 8080 is already in use (`Address already in use`)**:
   - Change the port by setting the `PORT` environment variable:
     ```bash
     PORT=8081 mvn spring-boot:run
     ```
   - Or in `application.properties`:
     ```properties
     server.port=8081
     ```

2. **MySQL Access Denied (`CommunicationsException` / `Access denied for user 'root'`)**:
   - Verify MySQL server is running (`brew services start mysql` on macOS, or `systemctl start mysql` on Linux).
   - Ensure you provided the correct password in `SPRING_DATASOURCE_PASSWORD`.
   - Alternatively, test immediately using the dev profile: `mvn spring-boot:run -Dspring-boot.run.profiles=dev`.

3. **CORS or Static Resources Not Showing**:
   - The frontend is served directly out of Spring Boot's `classpath:/static/` directory via `WebMvcConfig.java`, so no separate HTTP server or CORS proxy is needed.
