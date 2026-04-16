-- CreateTable
CREATE TABLE "UserSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "amazonHourlyPay" REAL NOT NULL,
    "amazonPlannedHours" REAL NOT NULL,
    "amazonOtHours" REAL NOT NULL DEFAULT 0,
    "amazonOtMultiplier" REAL NOT NULL DEFAULT 1.5,
    "fellowshipHourlyPay" REAL NOT NULL,
    "fellowshipPlannedHours" REAL NOT NULL,
    "fellowshipWeeklyCap" REAL NOT NULL,
    "taxesPercent" REAL NOT NULL,
    "four01kPercent" REAL NOT NULL,
    "insuranceWeekly" REAL NOT NULL,
    "otherDeductionsWeekly" REAL NOT NULL,
    "uberWeekly" REAL NOT NULL,
    "fixedBillsWeekly" REAL NOT NULL,
    "foodBaselineWeekly" REAL NOT NULL,
    "commuteMinutes" INTEGER NOT NULL DEFAULT 30,
    "gymTargetSessions" INTEGER NOT NULL DEFAULT 3,
    "studyTargetMinutes" INTEGER NOT NULL DEFAULT 300,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateTime" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "rubricChecklist" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "estimatedMinutes" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DebtPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "balance" REAL NOT NULL,
    "weeksRemaining" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TuitionPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "amountDue" REAL NOT NULL,
    "weeksUntilDue" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SavingsBucket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "currentAmount" REAL NOT NULL,
    "targetAmount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeeklySnapshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weekStartDate" DATETIME NOT NULL,
    "grossIncome" REAL NOT NULL,
    "netIncome" REAL NOT NULL,
    "essentials" REAL NOT NULL,
    "surplus" REAL NOT NULL,
    "allocationsJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SymptomEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "tremor" BOOLEAN NOT NULL DEFAULT false,
    "tingling" BOOLEAN NOT NULL DEFAULT false,
    "cramps" BOOLEAN NOT NULL DEFAULT false,
    "fatigue" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "SavingsBucket_name_key" ON "SavingsBucket"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySnapshot_weekStartDate_key" ON "WeeklySnapshot"("weekStartDate");
