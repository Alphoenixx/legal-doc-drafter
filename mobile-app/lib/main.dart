import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/auth_provider.dart';
import 'providers/local_state_providers.dart';
import 'screens/landing_screen.dart';
import 'screens/upload_tab.dart';
import 'screens/staging_preview_tab.dart';
import 'screens/history_drafts_tab.dart';

void main() {
  runApp(
    const ProviderScope(
      child: LegalDocApp(),
    ),
  );
}

class LegalDocApp extends ConsumerWidget {
  const LegalDocApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const Color bgBase = Color(0xFF0B0F14);
    const Color bgSurface = Color(0xFF111820);
    const Color accentColor = Color(0xFF2DD4BF);
    const Color textPrimary = Color(0xFFF0F4F8);

    return MaterialApp(
      title: 'Legal Doc Drafter',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: accentColor,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: bgBase,
        appBarTheme: const AppBarTheme(
          backgroundColor: bgSurface,
          elevation: 0,
          scrolledUnderElevation: 0,
          centerTitle: false,
        ),
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: bgSurface,
          indicatorColor: accentColor.withValues(alpha: 0.25),
          labelTextStyle: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return const TextStyle(color: accentColor, fontWeight: FontWeight.w600);
            }
            return const TextStyle(color: Colors.grey);
          }),
          iconTheme: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return const IconThemeData(color: accentColor);
            }
            return const IconThemeData(color: Colors.grey);
          }),
        ),
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme.apply(
            bodyColor: textPrimary,
            displayColor: textPrimary,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: accentColor,
            foregroundColor: bgBase,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: accentColor,
          ),
        ),
      ),
      home: ref.watch(authProvider).status == AuthStatus.authenticated 
          ? MainDashboardScreen() 
          : const LandingScreen(),
    );
  }
}
final GlobalKey<MainDashboardScreenState> dashboardKey = GlobalKey<MainDashboardScreenState>();

class MainDashboardScreen extends ConsumerStatefulWidget {
  MainDashboardScreen({Key? key}) : super(key: dashboardKey);

  @override
  ConsumerState<MainDashboardScreen> createState() => MainDashboardScreenState();
}

class MainDashboardScreenState extends ConsumerState<MainDashboardScreen> {
  int _currentIndex = 0;
  late final PageController _pageController;

  final List<Widget> _tabs = const [
    UploadTab(),
    StagingPreviewTab(), 
    HistoryDraftsTab(),  
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  void switchTab(int index) {
    if (index == 1) ref.read(unseenUploadsProvider.notifier).reset();
    if (index == 2) ref.read(unseenDraftsProvider.notifier).reset();
    
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
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
            const Text(
              'Legal Doc Drafter',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
          ],
        ),
        actions: [
          Consumer(
            builder: (context, ref, child) {
              return TextButton.icon(
                onPressed: () async {
                  final confirmed = await showDialog<bool>(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Confirm Logout'),
                      content: const Text('Are you sure you want to logout? Any unsent work may be lost.'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context, false),
                          child: const Text('Cancel'),
                        ),
                        ElevatedButton(
                          onPressed: () => Navigator.pop(context, true),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red.shade700,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Logout'),
                        ),
                      ],
                    ),
                  );
                  if (confirmed == true) {
                    ref.read(authProvider.notifier).logout();
                  }
                },
                icon: const Icon(Icons.logout, color: Colors.grey, size: 18),
                label: const Text('Logout', style: TextStyle(color: Colors.grey)),
              );
            }
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          if (index == 1) ref.read(unseenUploadsProvider.notifier).reset();
          if (index == 2) ref.read(unseenDraftsProvider.notifier).reset();
          setState(() => _currentIndex = index);
        },
        children: _tabs,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          if (index == 1) ref.read(unseenUploadsProvider.notifier).reset();
          if (index == 2) ref.read(unseenDraftsProvider.notifier).reset();
          _pageController.animateToPage(
            index,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
          );
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.upload_file_outlined),
            selectedIcon: Icon(Icons.upload_file),
            label: 'Upload',
          ),
          NavigationDestination(
            icon: Badge(
              label: Text('${ref.watch(unseenUploadsProvider)}'),
              isLabelVisible: ref.watch(unseenUploadsProvider) > 0,
              child: const Icon(Icons.inventory_2_outlined),
            ),
            selectedIcon: Badge(
              label: Text('${ref.watch(unseenUploadsProvider)}'),
              isLabelVisible: ref.watch(unseenUploadsProvider) > 0,
              child: const Icon(Icons.inventory_2),
            ),
            label: 'Preview',
          ),
          NavigationDestination(
            icon: Badge(
              label: Text('${ref.watch(unseenDraftsProvider)}'),
              isLabelVisible: ref.watch(unseenDraftsProvider) > 0,
              child: const Icon(Icons.history_outlined),
            ),
            selectedIcon: Badge(
              label: Text('${ref.watch(unseenDraftsProvider)}'),
              isLabelVisible: ref.watch(unseenDraftsProvider) > 0,
              child: const Icon(Icons.history),
            ),
            label: 'Final Drafts',
          ),
        ],
      ),
    );
  }
}
