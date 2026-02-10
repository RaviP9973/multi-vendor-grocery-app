import "dotenv/config";
import sql from "@/app/lib/db";
import { neon } from "@neondatabase/serverless";

export interface IUser {
  id?: string;

  name: string;
  email: string;
  password?: string;
  image?: string;
  role: userRole;
  phone?: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface IVendor {
  id?: string;
  user_id: string;

  shop_name?: string;
  shop_address?: string;
  gst_number?: string;

  status: verificationStatus;
  rejection_reason?: string;

  requested_at?: Date;
  approved_at?: Date;
  rejected_at?: Date;
}

export interface IProduct {
  id?: string;
  vendor_id: string;
  name: string;
  price: number;
  stock?: number;

  created_at?: Date;
  updated_at?: Date;
}

export interface ICartItem {
  id?: string;
  user_id: string;
  product_id: string;
  quantity: number;
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
        phone TEXT CHECK (char_length(phone) BETWEEN 8 AND 13),
        
        -- Timestamps
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE vendors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      shop_name TEXT,
      shop_address TEXT,
      gst_number TEXT,
      
      status verification_status DEFAULT 'pending',
      rejection_reason TEXT,

      requested_at TIMESTAMPTZ,
      approved_at TIMESTAMPTZ,
      rejected_at TIMESTAMPTZ
    )
  `;
  await sql`
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      stock INT DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE CART_ITEMS (
      ID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      USER_ID UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      PRODUCT_ID UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      QUANTITY INT NOT NULL DEFAULT 1 CHECK (quantity > 0),

      UNIQUE (USER_ID, PRODUCT_ID)

    )
    `;

  console.log("Tables created successfully");
}

main().catch((err) => {
  console.error("Error during migration:", err);
});
