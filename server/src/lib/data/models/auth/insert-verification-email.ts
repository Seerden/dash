import { query } from "@/lib/query-function";
import { TABLES } from "@shared/types/table.types";
import type { NewVerificationEmail, VerificationEmail } from "@shared/types/user.types";

/** Inserts a verification email into the database. */
export const insertVerificationEmail = query(async (sql, {email}: {email: NewVerificationEmail}) => {
   const [verificationEmail] = await sql<[VerificationEmail]>`
      INSERT INTO ${sql(TABLES.VERIFICATION_EMAILS)} ${sql(email)}
      RETURNING *
   `;
   
   return verificationEmail;

})