import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
} from 'drizzle-orm/pg-core';

export const planEnum = pgEnum('plan', ['free', 'pro', 'business']);
export const planStatusEnum = pgEnum('plan_status', [
  'active',
  'canceled',
  'past_due',
  'trialing',
]);
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'scheduled',
  'processing',
  'issued',
  'error',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  image: varchar('image', { length: 500 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  plan: planEnum('plan').default('free').notNull(),
  planStatus: planStatusEnum('plan_status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refreshToken: varchar('refresh_token', { length: 500 }),
  accessToken: varchar('access_token', { length: 500 }),
  expiresAt: integer('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: varchar('session_token', { length: 500 }).notNull().unique(),
  expires: timestamp('expires').notNull(),
});

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  cnpj: varchar('cnpj', { length: 18 }).notNull(),
  municipalTaxId: varchar('municipal_tax_id', { length: 50 }),
  serviceCode: varchar('service_code', { length: 10 }),
  taxRegime: integer('tax_regime').default(1),
  focusNfeCompanyId: varchar('focus_nfe_company_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  document: varchar('document', { length: 18 }).notNull(),
  address: jsonb('address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const schedules = pgTable('schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  description: varchar('description', { length: 500 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dayOfMonth: integer('day_of_month').notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  scheduleId: uuid('schedule_id').references(() => schedules.id, {
    onDelete: 'set null',
  }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  focusNfeId: varchar('focus_nfe_id', { length: 255 }),
  status: invoiceStatusEnum('status').default('scheduled').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: varchar('description', { length: 500 }),
  issuedAt: timestamp('issued_at'),
  pdfUrl: varchar('pdf_url', { length: 500 }),
  errorMessage: varchar('error_message', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
