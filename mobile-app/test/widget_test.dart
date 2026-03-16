import 'package:flutter_test/flutter_test.dart';

import 'package:legal_doc_app/main.dart';

void main() {
  testWidgets('App boots', (WidgetTester tester) async {
    await tester.pumpWidget(const LegalDocApp());
    expect(find.text('Legal Doc Drafter'), findsWidgets);
  });
}
