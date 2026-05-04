ALTER TABLE user_accounts
    ADD COLUMN email_normalized VARCHAR(150) GENERATED ALWAYS AS (LOWER(email));

CREATE UNIQUE INDEX uk_user_accounts_email_normalized ON user_accounts (email_normalized);
