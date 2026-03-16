import 'package:flutter/material.dart';
import 'login_screen.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  static final _featuresKey = GlobalKey();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF2DD4BF), Color(0xFF06B6D4)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.description, color: Color(0xFF0B0F14), size: 18),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'Legal Doc Drafter',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.push(
                context, 
                MaterialPageRoute(builder: (context) => const LoginScreen())
              );
            },
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              minimumSize: const Size(0, 0),
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text('Login', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // HERO SECTION
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
              width: double.infinity,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2DD4BF).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF2DD4BF).withValues(alpha: 0.3)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.cloud_done, size: 14, color: Color(0xFF2DD4BF)),
                        SizedBox(width: 8),
                        Text('Cloud-Powered', style: TextStyle(color: Color(0xFF2DD4BF), fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    'Draft legal documents\npowered by AI',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 42, 
                      fontWeight: FontWeight.w900,
                      height: 1.1,
                      letterSpacing: -1,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Upload legal documents to generate professionally drafted agreements, NDAs, and contracts. Legal Doc Drafter uses advanced AI with enterprise-grade AWS security to create legal documents in LaTeX and PDF format.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.grey, height: 1.5),
                  ),
                  const SizedBox(height: 48),
                  Wrap(
                    spacing: 16,
                    runSpacing: 16,
                    alignment: WrapAlignment.center,
                    children: [
                      ElevatedButton.icon(
                        iconAlignment: IconAlignment.end,
                        onPressed: () {
                          Navigator.push(
                            context, 
                            MaterialPageRoute(builder: (context) => const LoginScreen())
                          );
                        },
                        icon: const Icon(Icons.arrow_forward),
                        label: const Text('Get Started'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          Scrollable.ensureVisible(
                            _featuresKey.currentContext!,
                            duration: const Duration(milliseconds: 600),
                            curve: Curves.easeInOut,
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1A2332),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
                        ),
                        child: const Text('Learn More'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // FEATURES SECTION
            Container(
              key: _featuresKey,
              color: const Color(0xFF0D1219),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
              width: double.infinity,
              child: const Column(
                children: [
                  _FeatureCard(
                    icon: Icons.auto_awesome,
                    title: 'AI-Powered Drafting',
                    description: 'Leverage advanced AI to automatically generate professionally drafted legal documents from your inputs.',
                  ),
                  SizedBox(height: 24),
                  _FeatureCard(
                    icon: Icons.security,
                    title: 'Enterprise Security',
                    description: 'Enterprise-grade security with AWS Cognito authentication and S3-backed secure document storage.',
                  ),
                  SizedBox(height: 24),
                  _FeatureCard(
                    icon: Icons.picture_as_pdf,
                    title: 'LaTeX & PDF Export',
                    description: 'Get professional-quality documents in LaTeX format with instant PDF export for printing and sharing.',
                  ),
                ],
              ),
            ),
            
            // FOOTER
            Container(
              padding: const EdgeInsets.all(32),
              width: double.infinity,
              child: const Text(
                'Legal Doc Drafter — AI-Powered Legal Document Generation · Built on AWS',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;

  const _FeatureCard({required this.icon, required this.title, required this.description});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF111820),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF2DD4BF).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: const Color(0xFF2DD4BF)),
          ),
          const SizedBox(height: 16),
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(description, style: const TextStyle(color: Colors.grey, height: 1.5)),
        ],
      ),
    );
  }
}
