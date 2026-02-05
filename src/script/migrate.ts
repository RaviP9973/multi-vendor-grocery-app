import "dotenv/config";
import sql from "@/app/lib/db";
import { neon } from "@neondatabase/serverless";

// interface IUser {
//     id?: string;

//     name: string;
//     email: string;
//     password?: string;
//     image?: string;
//     role: 'user' | 'vendor' | 'admin';

//     // for vendors
//     shopName?: string;
//     shopAddress?: string;
//     gstNumber?: string;
//     isAproved?: boolean;
//     verificationStatus?: 'pending' | 'approved' | 'rejected';
//     requestedAt?: Date;
//     approvedAt?: Date;
//     rejectionReason?: string;

//     vendorProducts?: string[]; // Array of product IDs

//     orders?: string[]; // Array of order IDs

//     cart?: {
//         productId: string;
//         quantity: number;
//     }[];

//     createdAt?: Date;
//     updatedAt?: Date;

// }

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

  console.log("Tables created successfully");
}

main().catch((err) => {
  console.error("Error during migration:", err);
});
