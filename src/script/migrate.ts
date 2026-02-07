import "dotenv/config";
import sql from "@/app/lib/db";
import { neon } from "@neondatabase/serverless";

export interface IUser {
  id?: string;

  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "vendor" | "admin";
  phone?: string;

  // for vendors
  shop_name?: string;
  shop_address?: string;
  gst_number?: string;
  is_approved?: boolean;
  verification_status?: "pending" | "approved" | "rejected";
  requested_at?: Date;
  approved_at?: Date;
  rejection_reason?: string;

  vendor_products?: string[]; // Array of product IDs

  orders?: string[]; // Array of order IDs

  cart?: {
    productId: string;
    quantity: number;
  }[];

  created_at?: Date;
  updated_at?: Date;
}

export type userRole = "user" | "vendor" | "admin";
export type verificationStatus = "pending" | "approved" | "rejected";
async function main() {
  console.log("Starting migration...");

  // Step 2: Create user_role type safely
  await sql`
    DROP TABLE IF EXISTS users;
  `;
  await sql`
    DO $$
    BEGIN 
        IF NOT EXISTS (select 1 from pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS enum ('user', 'vendor', 'admin');
        END IF;
    END $$`;

  // Step 3: Create verification_status type safely
  await sql`
    DO $$
    BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
            CREATE TYPE verification_status AS enum ('pending', 'approved', 'rejected');
        END IF;
    END $$`;

  // Step 4: Create the table
  await sql`
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        
        -- Basic user fields
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        image TEXT,
        role user_role NOT NULL DEFAULT 'user',
        
        -- Vendor-specific fields
        shop_name TEXT,
        shop_address TEXT,
        gst_number TEXT,
        is_approved BOOLEAN DEFAULT false,

        verification_status verification_status DEFAULT 'pending',

        requested_at TIMESTAMPTZ,
        approved_at TIMESTAMPTZ,
        rejection_reason TEXT,
        
        -- Relations (stored as arrays of UUIDs)
        vendor_products UUID[] DEFAULT '{}',
        orders UUID[] DEFAULT '{}',
        
        -- Cart stored as JSONB
        cart JSONB DEFAULT '[]',
        
        -- Timestamps
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

  await sql`
    ALTER TABLE users
    ADD COLUMN phone TEXT
    CHECK (char_length(phone) BETWEEN 8 AND 13);
    `;

  console.log("Tables created successfully");
}

main().catch((err) => {
  console.error("Error during migration:", err);
});
