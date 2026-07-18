-- CreateTable
CREATE TABLE IF NOT EXISTS "Visitor" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "attributes" JSONB NOT NULL DEFAULT '{}',
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN IF NOT EXISTS "visitorId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Visitor_appId_idx" ON "Visitor"("appId");
CREATE INDEX IF NOT EXISTS "Visitor_lastSeenAt_idx" ON "Visitor"("lastSeenAt" DESC);
CREATE INDEX IF NOT EXISTS "Visitor_email_idx" ON "Visitor"("email");
CREATE INDEX IF NOT EXISTS "Conversation_visitorId_idx" ON "Conversation"("visitorId");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Conversation_visitorId_fkey'
  ) THEN
    ALTER TABLE "Conversation"
      ADD CONSTRAINT "Conversation_visitorId_fkey"
      FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
