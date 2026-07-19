import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const DB_PATH = path.join(process.cwd(), "data", "fee_payments.db");

function openDb(): Database.Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  return db;
}

function ensureColumnExists(db: Database.Database, tableName: string, columnName: string): void {
  const columns = db
    .prepare(`PRAGMA table_info(${tableName})`)
    .all() as Array<{ name: string }>;

  if (!columns.some((column) => column.name === columnName)) {
    try {
      db.exec(
        `ALTER TABLE ${tableName} ADD COLUMN ${columnName} TEXT NOT NULL DEFAULT ''`
      );
    } catch (err) {
      const msg = String(err);
      if (msg.includes("duplicate column name")) {
        // Ignore duplicate column errors from concurrent Next.js workers
        return;
      }
      throw err;
    }
  }
}

function initDb(): void {
  const db = openDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      father_name TEXT NOT NULL DEFAULT '',
      gender TEXT NOT NULL DEFAULT '',
      caste TEXT NOT NULL DEFAULT '',
      class_name TEXT NOT NULL DEFAULT '',
      student_type TEXT NOT NULL DEFAULT '',
      semester_year TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      fee_type TEXT NOT NULL,
      fee_label TEXT NOT NULL,
      amount_rupees INTEGER NOT NULL,
      currency TEXT NOT NULL,
      order_id TEXT NOT NULL UNIQUE,
      payment_id TEXT NOT NULL,
      signature TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      raw_payload TEXT NOT NULL,
      payment_category TEXT NOT NULL DEFAULT '',
      aadhar_number TEXT NOT NULL DEFAULT '',
      abc_id TEXT NOT NULL DEFAULT '',
      university TEXT NOT NULL DEFAULT '',
      semester TEXT NOT NULL DEFAULT '',
      fee_breakdown TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS pending_orders (
      order_id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      father_name TEXT NOT NULL DEFAULT '',
      gender TEXT NOT NULL DEFAULT '',
      caste TEXT NOT NULL DEFAULT '',
      class_name TEXT NOT NULL DEFAULT '',
      student_type TEXT NOT NULL DEFAULT '',
      semester_year TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      fee_type TEXT NOT NULL,
      fee_label TEXT NOT NULL,
      amount_rupees INTEGER NOT NULL,
      currency TEXT NOT NULL,
      created_at TEXT NOT NULL,
      payment_category TEXT NOT NULL DEFAULT '',
      aadhar_number TEXT NOT NULL DEFAULT '',
      abc_id TEXT NOT NULL DEFAULT '',
      university TEXT NOT NULL DEFAULT '',
      semester TEXT NOT NULL DEFAULT '',
      fee_breakdown TEXT NOT NULL DEFAULT ''
    );
  `);

  ensureColumnExists(db, "payments", "father_name");
  ensureColumnExists(db, "payments", "gender");
  ensureColumnExists(db, "payments", "caste");
  ensureColumnExists(db, "payments", "class_name");
  ensureColumnExists(db, "payments", "student_type");
  ensureColumnExists(db, "payments", "semester_year");
  ensureColumnExists(db, "payments", "payment_category");
  ensureColumnExists(db, "payments", "aadhar_number");
  ensureColumnExists(db, "payments", "abc_id");
  ensureColumnExists(db, "payments", "university");
  ensureColumnExists(db, "payments", "semester");
  ensureColumnExists(db, "payments", "fee_breakdown");

  ensureColumnExists(db, "pending_orders", "father_name");
  ensureColumnExists(db, "pending_orders", "gender");
  ensureColumnExists(db, "pending_orders", "caste");
  ensureColumnExists(db, "pending_orders", "class_name");
  ensureColumnExists(db, "pending_orders", "student_type");
  ensureColumnExists(db, "pending_orders", "semester_year");
  ensureColumnExists(db, "pending_orders", "payment_category");
  ensureColumnExists(db, "pending_orders", "aadhar_number");
  ensureColumnExists(db, "pending_orders", "abc_id");
  ensureColumnExists(db, "pending_orders", "university");
  ensureColumnExists(db, "pending_orders", "semester");
  ensureColumnExists(db, "pending_orders", "fee_breakdown");
  db.close();
}

// Initialise on module load
initDb();

export type PendingOrder = {
  order_id: string;
  student_id: string;
  student_name: string;
  father_name: string;
  gender: string;
  caste: string;
  class_name: string;
  student_type: string;
  semester_year: string;
  email: string;
  phone: string;
  fee_type: string;
  fee_label: string;
  amount_rupees: number;
  currency: string;
  created_at: string;
  
  // New fields
  payment_category: string;
  aadhar_number: string;
  abc_id: string;
  university: string;
  semester: string;
  fee_breakdown: string;
};

export type PaymentRecord = PendingOrder & {
  id?: number;
  payment_id: string;
  signature: string;
  status: string;
  raw_payload: string;
};

export function upsertPendingOrder(order: PendingOrder): void {
  const db = openDb();
  db.prepare(`
    INSERT INTO pending_orders (
      order_id, student_id, student_name, father_name, gender, caste,
      class_name, student_type, semester_year, email, phone, fee_type, fee_label,
      amount_rupees, currency, created_at,
      payment_category, aadhar_number, abc_id, university, semester, fee_breakdown
    ) VALUES (
      @order_id, @student_id, @student_name, @father_name, @gender, @caste,
      @class_name, @student_type, @semester_year, @email, @phone, @fee_type, @fee_label,
      @amount_rupees, @currency, @created_at,
      @payment_category, @aadhar_number, @abc_id, @university, @semester, @fee_breakdown
    )
    ON CONFLICT(order_id) DO UPDATE SET
      student_id = excluded.student_id,
      student_name = excluded.student_name,
      father_name = excluded.father_name,
      gender = excluded.gender,
      caste = excluded.caste,
      class_name = excluded.class_name,
      student_type = excluded.student_type,
      semester_year = excluded.semester_year,
      email = excluded.email,
      phone = excluded.phone,
      fee_type = excluded.fee_type,
      fee_label = excluded.fee_label,
      amount_rupees = excluded.amount_rupees,
      currency = excluded.currency,
      created_at = excluded.created_at,
      payment_category = excluded.payment_category,
      aadhar_number = excluded.aadhar_number,
      abc_id = excluded.abc_id,
      university = excluded.university,
      semester = excluded.semester,
      fee_breakdown = excluded.fee_breakdown
  `).run(order);
  db.close();
}

export function fetchPendingOrder(orderId: string): PendingOrder | undefined {
  const db = openDb();
  const row = db
    .prepare("SELECT * FROM pending_orders WHERE order_id = ?")
    .get(orderId) as PendingOrder | undefined;
  db.close();
  return row;
}

export function deletePendingOrder(orderId: string): void {
  const db = openDb();
  db.prepare("DELETE FROM pending_orders WHERE order_id = ?").run(orderId);
  db.close();
}

export function recordPayment(payment: Omit<PaymentRecord, "id">): void {
  const db = openDb();
  db.prepare(`
    INSERT INTO payments (
      student_id, student_name, father_name, gender, caste, class_name,
      student_type, semester_year, email, phone, fee_type, fee_label,
      amount_rupees, currency, order_id, payment_id, signature, status,
      created_at, raw_payload,
      payment_category, aadhar_number, abc_id, university, semester, fee_breakdown
    ) VALUES (
      @student_id, @student_name, @father_name, @gender, @caste, @class_name,
      @student_type, @semester_year, @email, @phone, @fee_type, @fee_label,
      @amount_rupees, @currency, @order_id, @payment_id, @signature, @status,
      @created_at, @raw_payload,
      @payment_category, @aadhar_number, @abc_id, @university, @semester, @fee_breakdown
    )
  `).run(payment);
  db.close();
}

export function fetchPayments(): PaymentRecord[] {
  const db = openDb();
  const rows = db
    .prepare("SELECT * FROM payments ORDER BY created_at DESC")
    .all() as PaymentRecord[];
  db.close();
  return rows;
}

export function fetchPaymentByOrderId(
  orderId: string
): PaymentRecord | undefined {
  const db = openDb();
  const row = db
    .prepare("SELECT * FROM payments WHERE order_id = ?")
    .get(orderId) as PaymentRecord | undefined;
  db.close();
  return row;
}
