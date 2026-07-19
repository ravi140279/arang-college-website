from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from paytmchecksum import PaytmChecksum

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "fee_payments.db"

load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me")

CLASS_OPTIONS = [
    "B.A.",
    "B.Com.",
    "B.Sc. Biology",
    "B.Sc. Mathematics",
    "M.Com.",
    "M.A. Hindi",
    "M.A. Political Sc.",
    "M.A. Economics",
    "M.Sc. Mathematics",
    "M.Sc. Zoology",
]

STUDENT_TYPE_OPTIONS = ["Regular", "Private"]

GENDER_OPTIONS = ["Male", "Female"]

CASTE_OPTIONS = ["General", "SC", "ST", "OBC"]

SEMESTER_YEAR_OPTIONS = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "First Year",
    "Secon Year",
    "Third Year",
]


def get_paytm_config() -> dict[str, str]:
    return {
        "mid": os.getenv("PAYTM_MID", "").strip(),
        "merchant_key": os.getenv("PAYTM_MERCHANT_KEY", "").strip(),
        "website": os.getenv("PAYTM_WEBSITE", "WEBSTAGING").strip(),
        "channel_id": os.getenv("PAYTM_CHANNEL_ID", "WEB").strip(),
        "environment": os.getenv("PAYTM_ENV", "staging").strip().lower(),
    }


def is_paytm_ready() -> bool:
    config = get_paytm_config()
    return bool(config["mid"] and config["merchant_key"])


def get_paytm_host() -> str:
    environment = get_paytm_config()["environment"]
    if environment == "production":
        return "https://securegw.paytm.in"
    return "https://securegw-stage.paytm.in"


def get_paytm_checkout_js_url() -> str:
    mid = get_paytm_config()["mid"]
    return f"{get_paytm_host()}/merchantpgpui/checkoutjs/merchants/{mid}.js"


def get_paytm_headers(body: dict[str, Any]) -> dict[str, str]:
    merchant_key = get_paytm_config()["merchant_key"]
    if not merchant_key:
        raise RuntimeError("Paytm merchant key is not configured.")

    body_json = json.dumps(body, separators=(",", ":"))
    signature = PaytmChecksum.generateSignature(body_json, merchant_key)
    return {"Content-Type": "application/json", "signature": signature}


def call_paytm_api(path: str, body: dict[str, Any]) -> dict[str, Any]:
    url = f"{get_paytm_host()}{path}"
    response = requests.post(url, data=json.dumps(body), headers=get_paytm_headers(body), timeout=30)
    response.raise_for_status()
    return response.json()


def get_fee_catalog() -> dict[str, dict[str, Any]]:
    return {
        "term": {
            "label": "Term Fees",
            "description": "Academic term fee payment",
            "amount_rupees": int(os.getenv("TERM_FEE_AMOUNT", "25000")),
        },
        "examination": {
            "label": "Examination Fees",
            "description": "Examination registration fee payment",
            "amount_rupees": int(os.getenv("EXAMINATION_FEE_AMOUNT", "3500")),
        },
    }


def get_class_options() -> list[str]:
    return CLASS_OPTIONS.copy()


def is_valid_class_name(class_name: str) -> bool:
    return class_name in CLASS_OPTIONS


def get_student_type_options() -> list[str]:
    return STUDENT_TYPE_OPTIONS.copy()


def is_valid_student_type(student_type: str) -> bool:
    return student_type in STUDENT_TYPE_OPTIONS


def get_gender_options() -> list[str]:
    return GENDER_OPTIONS.copy()


def is_valid_gender(gender: str) -> bool:
    return gender in GENDER_OPTIONS


def get_caste_options() -> list[str]:
    return CASTE_OPTIONS.copy()


def is_valid_caste(caste: str) -> bool:
    return caste in CASTE_OPTIONS


def is_valid_mobile_number(mobile_number: str) -> bool:
    return mobile_number.isdigit() and len(mobile_number) == 10


def get_semester_year_options() -> list[str]:
    return SEMESTER_YEAR_OPTIONS.copy()


def is_valid_semester_year(semester_year: str) -> bool:
    return semester_year in SEMESTER_YEAR_OPTIONS


def ensure_column_exists(connection: sqlite3.Connection, table_name: str, column_name: str) -> None:
    existing_columns = {
        row[1] for row in connection.execute(f"PRAGMA table_info({table_name})").fetchall()
    }
    if column_name not in existing_columns:
        connection.execute(
            f"ALTER TABLE {table_name} ADD COLUMN {column_name} TEXT NOT NULL DEFAULT ''"
        )


def init_db() -> None:
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL,
                student_name TEXT NOT NULL,
                father_name TEXT NOT NULL,
                gender TEXT NOT NULL,
                caste TEXT NOT NULL,
                class_name TEXT NOT NULL,
                student_type TEXT NOT NULL,
                semester_year TEXT NOT NULL,
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
                raw_payload TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS pending_orders (
                order_id TEXT PRIMARY KEY,
                student_id TEXT NOT NULL,
                student_name TEXT NOT NULL,
                father_name TEXT NOT NULL,
                gender TEXT NOT NULL,
                caste TEXT NOT NULL,
                class_name TEXT NOT NULL,
                student_type TEXT NOT NULL,
                semester_year TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                fee_type TEXT NOT NULL,
                fee_label TEXT NOT NULL,
                amount_rupees INTEGER NOT NULL,
                currency TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        ensure_column_exists(connection, "payments", "father_name")
        ensure_column_exists(connection, "payments", "gender")
        ensure_column_exists(connection, "payments", "caste")
        ensure_column_exists(connection, "payments", "class_name")
        ensure_column_exists(connection, "payments", "student_type")
        ensure_column_exists(connection, "payments", "semester_year")
        ensure_column_exists(connection, "pending_orders", "father_name")
        ensure_column_exists(connection, "pending_orders", "gender")
        ensure_column_exists(connection, "pending_orders", "caste")
        ensure_column_exists(connection, "pending_orders", "class_name")
        ensure_column_exists(connection, "pending_orders", "student_type")
        ensure_column_exists(connection, "pending_orders", "semester_year")


def record_payment(payment_data: dict[str, Any]) -> None:
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute(
            """
            INSERT INTO payments (
                student_id,
                student_name,
                father_name,
                gender,
                caste,
                class_name,
                student_type,
                semester_year,
                email,
                phone,
                fee_type,
                fee_label,
                amount_rupees,
                currency,
                order_id,
                payment_id,
                signature,
                status,
                created_at,
                raw_payload
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payment_data["student_id"],
                payment_data["student_name"],
                payment_data["father_name"],
                payment_data["gender"],
                payment_data["caste"],
                payment_data["class_name"],
                payment_data["student_type"],
                payment_data["semester_year"],
                payment_data["email"],
                payment_data["phone"],
                payment_data["fee_type"],
                payment_data["fee_label"],
                payment_data["amount_rupees"],
                payment_data["currency"],
                payment_data["order_id"],
                payment_data["payment_id"],
                payment_data["signature"],
                payment_data["status"],
                payment_data["created_at"],
                payment_data["raw_payload"],
            ),
        )


def fetch_payments() -> list[sqlite3.Row]:
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.row_factory = sqlite3.Row
        return connection.execute("SELECT * FROM payments ORDER BY created_at DESC").fetchall()


def upsert_pending_order(order_data: dict[str, Any]) -> None:
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute(
            """
            INSERT INTO pending_orders (
                order_id,
                student_id,
                student_name,
                father_name,
                gender,
                caste,
                class_name,
                student_type,
                semester_year,
                email,
                phone,
                fee_type,
                fee_label,
                amount_rupees,
                currency,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(order_id) DO UPDATE SET
                student_id=excluded.student_id,
                student_name=excluded.student_name,
                father_name=excluded.father_name,
                gender=excluded.gender,
                caste=excluded.caste,
                class_name=excluded.class_name,
                student_type=excluded.student_type,
                semester_year=excluded.semester_year,
                email=excluded.email,
                phone=excluded.phone,
                fee_type=excluded.fee_type,
                fee_label=excluded.fee_label,
                amount_rupees=excluded.amount_rupees,
                currency=excluded.currency,
                created_at=excluded.created_at
            """,
            (
                order_data["order_id"],
                order_data["student_id"],
                order_data["student_name"],
                order_data["father_name"],
                order_data["gender"],
                order_data["caste"],
                order_data["class_name"],
                order_data["student_type"],
                order_data["semester_year"],
                order_data["email"],
                order_data["phone"],
                order_data["fee_type"],
                order_data["fee_label"],
                order_data["amount_rupees"],
                order_data["currency"],
                order_data["created_at"],
            ),
        )


def fetch_pending_order(order_id: str) -> sqlite3.Row | None:
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.row_factory = sqlite3.Row
        return connection.execute(
            "SELECT * FROM pending_orders WHERE order_id = ?", (order_id,)
        ).fetchone()


def delete_pending_order(order_id: str) -> None:
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute("DELETE FROM pending_orders WHERE order_id = ?", (order_id,))


@app.get("/")
def index() -> str:
    fee_catalog = get_fee_catalog()
    return render_template(
        "index.html",
        college_name=os.getenv("COLLEGE_NAME", "ABC College"),
        bank_account_label=os.getenv(
            "COLLEGE_ACCOUNT_LABEL", "State Bank of India Current Account"
        ),
        class_options=get_class_options(),
        gender_options=get_gender_options(),
        caste_options=get_caste_options(),
        student_type_options=get_student_type_options(),
        semester_year_options=get_semester_year_options(),
        fee_catalog=fee_catalog,
        currency=os.getenv("CURRENCY", "INR"),
        gateway_ready=is_paytm_ready(),
        paytm_mid=get_paytm_config()["mid"],
        paytm_checkout_js_url=get_paytm_checkout_js_url(),
    )


@app.post("/create-order")
def create_order() -> Any:
    payload = request.get_json(silent=True) or {}
    required_fields = [
        "student_id",
        "student_name",
        "father_name",
        "gender",
        "caste",
        "class_name",
        "student_type",
        "semester_year",
        "email",
        "phone",
        "fee_type",
    ]
    missing = [field for field in required_fields if not str(payload.get(field, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    father_name = str(payload["father_name"]).strip()

    gender = str(payload["gender"]).strip()
    if not is_valid_gender(gender):
        return jsonify({"error": "Invalid gender selected."}), 400

    caste = str(payload["caste"]).strip()
    if not is_valid_caste(caste):
        return jsonify({"error": "Invalid caste selected."}), 400

    class_name = str(payload["class_name"]).strip()
    if not is_valid_class_name(class_name):
        return jsonify({"error": "Invalid class selected."}), 400

    student_type = str(payload["student_type"]).strip()
    if not is_valid_student_type(student_type):
        return jsonify({"error": "Invalid student type selected."}), 400

    semester_year = str(payload["semester_year"]).strip()
    if not is_valid_semester_year(semester_year):
        return jsonify({"error": "Invalid semester or year selected."}), 400

    mobile_number = str(payload["phone"]).strip()
    if not is_valid_mobile_number(mobile_number):
        return jsonify({"error": "Mobile number must be exactly 10 digits."}), 400

    fee_catalog = get_fee_catalog()
    fee_type = str(payload["fee_type"]).strip().lower()
    fee_details = fee_catalog.get(fee_type)
    if fee_details is None:
        return jsonify({"error": "Invalid fee type selected."}), 400

    if not is_paytm_ready():
        return jsonify({"error": "Paytm credentials are not configured."}), 500

    currency = os.getenv("CURRENCY", "INR")
    amount_rupees = int(fee_details["amount_rupees"])
    order_id = f"FEE{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}{uuid4().hex[:6].upper()}"
    paytm_config = get_paytm_config()
    callback_url = request.url_root.rstrip("/") + "/payment/callback"

    pending_order = {
        "order_id": order_id,
        "student_id": str(payload["student_id"]).strip(),
        "student_name": str(payload["student_name"]).strip(),
        "father_name": father_name,
        "gender": gender,
        "caste": caste,
        "class_name": class_name,
        "student_type": student_type,
        "semester_year": semester_year,
        "email": str(payload["email"]).strip(),
        "phone": mobile_number,
        "fee_type": fee_type,
        "fee_label": fee_details["label"],
        "amount_rupees": amount_rupees,
        "currency": currency,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    upsert_pending_order(pending_order)

    body = {
        "requestType": "Payment",
        "mid": paytm_config["mid"],
        "websiteName": paytm_config["website"],
        "orderId": order_id,
        "callbackUrl": callback_url,
        "txnAmount": {
            "value": f"{amount_rupees:.2f}",
            "currency": currency,
        },
        "userInfo": {
            "custId": pending_order["student_id"],
            "firstName": pending_order["student_name"],
            "mobile": pending_order["phone"],
            "email": pending_order["email"],
        },
    }

    try:
        paytm_response = call_paytm_api(
            f"/theia/api/v1/initiateTransaction?mid={paytm_config['mid']}&orderId={order_id}",
            body,
        )
    except Exception as exc:
        return jsonify({"error": f"Unable to initiate Paytm transaction: {exc}"}), 500

    result_info = paytm_response.get("body", {}).get("resultInfo", {})
    txn_token = paytm_response.get("body", {}).get("txnToken")
    if result_info.get("resultStatus") != "S" or not txn_token:
        return jsonify(
            {
                "error": result_info.get(
                    "resultMsg", "Paytm transaction initiation failed."
                )
            }
        ), 500

    return jsonify(
        {
            "order_id": order_id,
            "amount": f"{amount_rupees:.2f}",
            "amount_rupees": amount_rupees,
            "currency": currency,
            "description": fee_details["description"],
            "fee_label": fee_details["label"],
            "txn_token": txn_token,
            "mid": paytm_config["mid"],
        }
    )


@app.post("/payment/callback")
def payment_callback() -> Any:
    form = request.form
    required_fields = ["ORDERID", "TXNID", "CHECKSUMHASH"]
    missing = [field for field in required_fields if not form.get(field, "").strip()]
    if missing:
        return render_template(
            "payment_failed.html",
            error_message=f"Missing verification fields: {', '.join(missing)}",
        ), 400

    order_id = form["ORDERID"].strip()
    pending_order = fetch_pending_order(order_id)
    if pending_order is None:
        return render_template(
            "payment_failed.html",
            error_message="Order session not found for this callback.",
        ), 400

    paytm_config = get_paytm_config()
    if not paytm_config["merchant_key"]:
        return render_template(
            "payment_failed.html",
            error_message="Paytm merchant key is not configured.",
        ), 500

    callback_payload = dict(form)
    checksum_hash = callback_payload.pop("CHECKSUMHASH", "")
    try:
        checksum_valid = PaytmChecksum.verifySignature(
            callback_payload, paytm_config["merchant_key"], checksum_hash
        )
        if not checksum_valid:
            return render_template(
                "payment_failed.html",
                error_message="Paytm checksum verification failed.",
            ), 400

        status_body = {"mid": paytm_config["mid"], "orderId": order_id}
        status_response = call_paytm_api("/v3/order/status", status_body)
    except Exception as exc:
        return render_template(
            "payment_failed.html",
            error_message=f"Payment verification failed: {exc}",
        ), 400

    status_body = status_response.get("body", {})
    result_info = status_body.get("resultInfo", {})
    if result_info.get("resultStatus") != "TXN_SUCCESS":
        return render_template(
            "payment_failed.html",
            error_message=result_info.get("resultMsg", "Paytm transaction failed."),
        ), 400

    payment_record = {
        "student_id": pending_order["student_id"],
        "student_name": pending_order["student_name"],
        "father_name": pending_order["father_name"],
        "gender": pending_order["gender"],
        "caste": pending_order["caste"],
        "class_name": pending_order["class_name"],
        "student_type": pending_order["student_type"],
        "semester_year": pending_order["semester_year"],
        "email": pending_order["email"],
        "phone": pending_order["phone"],
        "fee_type": pending_order["fee_type"],
        "fee_label": pending_order["fee_label"],
        "amount_rupees": pending_order["amount_rupees"],
        "currency": pending_order["currency"],
        "order_id": order_id,
        "payment_id": status_body.get("txnId", form.get("TXNID", "")),
        "signature": checksum_hash,
        "status": "captured_via_paytm",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "raw_payload": json.dumps(
            {"callback": dict(form), "status": status_response}, ensure_ascii=True
        ),
    }

    try:
        record_payment(payment_record)
    except sqlite3.IntegrityError:
        pass

    delete_pending_order(order_id)

    return render_template(
        "payment_success.html",
        college_name=os.getenv("COLLEGE_NAME", "ABC College"),
        payment=payment_record,
        bank_account_label=os.getenv(
            "COLLEGE_ACCOUNT_LABEL", "State Bank of India Current Account"
        ),
    )


@app.get("/payment/callback")
def payment_callback_get() -> Any:
    return render_template(
        "payment_failed.html",
        error_message="Invalid callback request method.",
    ), 405


@app.get("/payments")
def payment_history() -> str:
    return render_template(
        "payments.html",
        college_name=os.getenv("COLLEGE_NAME", "ABC College"),
        payments=fetch_payments(),
    )


init_db()


if __name__ == "__main__":
    app.run(debug=True)
