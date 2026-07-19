# College Fee Collection Portal

A small Flask application for collecting student term fees and examination fees through Paytm.

## What this app includes

- Student fee form with selection between term fees and examination fees
- Paytm order initiation from the backend
- Paytm callback checksum verification and transaction status confirmation
- SQLite-based register of successful payments
- Simple payment history page for office staff

## Important banking note

The transfer of collected money into the college State Bank of India current account is not controlled in application code. Paytm settles payments into the bank account that you configure in your Paytm dashboard.

To use the college SBI current account:

1. Complete Paytm KYC for the college entity.
2. Add the college State Bank of India current account as the settlement account in Paytm.
3. Use live Paytm credentials after dashboard verification is complete.
4. Optionally configure Paytm webhooks for reconciliation and email/SMS receipts.

## Setup

1. Create and activate a Python environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and update:

- `PAYTM_MID`
- `PAYTM_MERCHANT_KEY`
- `PAYTM_ENV` (`staging` or `production`)
- `PAYTM_WEBSITE`
- `PAYTM_CHANNEL_ID`
- `COLLEGE_NAME`
- `COLLEGE_ACCOUNT_LABEL`
- `TERM_FEE_AMOUNT`
- `EXAMINATION_FEE_AMOUNT`

4. Run the app:

```bash
python app.py
```

5. Open `http://127.0.0.1:5000`

## Suggested production additions

- College login for staff payment reports
- Student receipt PDF generation
- Paytm webhook verification for asynchronous reconciliation
- Email and SMS confirmation after successful payment
- Separate fee heads by department, semester, and examination type
- Export payment register to CSV or Excel
