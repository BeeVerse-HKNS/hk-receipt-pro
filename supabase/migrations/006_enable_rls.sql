ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own receipts" ON receipts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view company receipts" ON receipts
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert own receipts" ON receipts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own receipts" ON receipts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can view own reports" ON expense_reports
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view company reports" ON expense_reports
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
