import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:typed_data';

import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:docx_to_text/docx_to_text.dart';

import 'providers/auth_provider.dart';
import 'providers/s3_upload_provider.dart';
import 'providers/document_generation_provider.dart';
import 'screens/landing_screen.dart';
import 'screens/pdf_viewer_screen.dart';

// --- STATE PROVIDERS (Riverpod) --- //
final localFileListProvider = NotifierProvider<LocalFileList, List<PlatformFile>>(LocalFileList.new);
class LocalFileList extends Notifier<List<PlatformFile>> {
  @override
  List<PlatformFile> build() => [];
  void add(PlatformFile file) => state = [...state, file];
}

// Badge counters for unseen items
final unseenUploadsProvider = NotifierProvider<UnseenCounter, int>(UnseenCounter.new);
final unseenDraftsProvider = NotifierProvider<UnseenCounter, int>(UnseenCounter.new);
class UnseenCounter extends Notifier<int> {
  @override
  int build() => 0;
  void increment() => state = state + 1;
  void reset() => state = 0;
}

final selectedFileProvider = NotifierProvider<SelectedFile, PlatformFile?>(SelectedFile.new);
class SelectedFile extends Notifier<PlatformFile?> {
  @override
  PlatformFile? build() => null;
  void select(PlatformFile? file) => state = file;
}

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
          indicatorColor: accentColor.withOpacity(0.25),
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
          ? const MainDashboardScreen() 
          : const LandingScreen(),
    );
  }
}

class MainDashboardScreen extends ConsumerStatefulWidget {
  const MainDashboardScreen({super.key});

  @override
  ConsumerState<MainDashboardScreen> createState() => _MainDashboardScreenState();
}

class _MainDashboardScreenState extends ConsumerState<MainDashboardScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = const [
    UploadTab(),
    StagingPreviewTab(), // Renamed to clarify purpose
    HistoryDraftsTab(),  // Clarifies finalized docs
  ];

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
                onPressed: () {
                  ref.read(authProvider.notifier).logout();
                },
                icon: const Icon(Icons.logout, color: Colors.grey, size: 18),
                label: const Text('Logout', style: TextStyle(color: Colors.grey)),
              );
            }
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: _tabs[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          // Clear badge counters when the user taps the corresponding tab
          if (index == 1) ref.read(unseenUploadsProvider.notifier).state = 0;
          if (index == 2) ref.read(unseenDraftsProvider.notifier).state = 0;
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
            label: 'Preview & Process',
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

// -------------------------------------------------------------
// TAB 1: UPLOAD ONLY
// -------------------------------------------------------------
class UploadTab extends ConsumerStatefulWidget {
  const UploadTab({super.key});

  @override
  ConsumerState<UploadTab> createState() => _UploadTabState();
}

class _UploadTabState extends ConsumerState<UploadTab> {
  final _textController = TextEditingController();

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Ingest Documents',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Add documents to your local staging queue.',
              style: TextStyle(color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 48),
            
            InkWell(
              onTap: () async {
                FilePickerResult? result = await FilePicker.platform.pickFiles(
                  type: FileType.custom,
                  allowedExtensions: ['pdf', 'docx', 'txt'],
                  withData: true, // Request bytes for S3 upload
                );
  
                if (result != null && result.files.isNotEmpty) {
                  ref.read(localFileListProvider.notifier).add(result.files.first);
                  ref.read(unseenUploadsProvider.notifier).state++;
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('${result.files.first.name} added to Queue')),
                    );
                  }
                }
              },
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.withOpacity(0.3), width: 2, style: BorderStyle.none),
                  borderRadius: BorderRadius.circular(16),
                  color: const Color(0xFF1A2332), // bg-elevated
                ),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2DD4BF).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.cloud_upload_outlined, color: Color(0xFF2DD4BF), size: 48),
                    ),
                    const SizedBox(height: 16),
                    const Text('Click to browse files (PDF, DOCX, TXT)', style: TextStyle(fontWeight: FontWeight.w500)),
                  ],
                ),
              ),
            ),
  
            const SizedBox(height: 32),
            const Row(
              children: [
                Expanded(child: Divider(color: Colors.grey)),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: Text('OR', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                ),
                Expanded(child: Divider(color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 32),
  
            TextField(
              controller: _textController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Paste legal document text here...',
                filled: true,
                fillColor: const Color(0xFF0D1219),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF2DD4BF)),
                )
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                 final text = _textController.text.trim();
                 if (text.isEmpty) {
                   ScaffoldMessenger.of(context).showSnackBar(
                     const SnackBar(content: Text('Please paste some text first')),
                   );
                   return;
                 }

                 // Text pasting flow simulates a PlatformFile object for consistency
                 final timestamp = DateTime.now().millisecondsSinceEpoch;
                 final fileName = "Pasted_Text_$timestamp.txt";
                 
                 // Encode text properly for the payload (Bug 5 fix)
                 final bytes = Uint8List.fromList(utf8.encode(text));

                 // Create a mock PlatformFile representing the pasted text
                 final file = PlatformFile(
                   name: fileName,
                   size: bytes.length,
                   bytes: bytes,
                 );
  
                 ref.read(localFileListProvider.notifier).add(file);
                 ref.read(unseenUploadsProvider.notifier).state++;
                 
                 // Clear controller
                 _textController.clear();
                 // Unfocus
                 FocusManager.instance.primaryFocus?.unfocus();

                 ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Text added to Staging Queue')),
                );
              },
              icon: const Icon(Icons.add),
              label: const Text('Add as Text Document'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                foregroundColor: const Color(0xFF2DD4BF),
                side: const BorderSide(color: Color(0xFF2DD4BF)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 2: STAGING & PROCESSING
// -------------------------------------------------------------
class StagingPreviewTab extends ConsumerWidget {
  const StagingPreviewTab({super.key});

  void _showDocumentTypeSelector(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF111820),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Select Document Type', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 24),
              Consumer(
                builder: (context, ref, child) {
                  void trigger(String docType) async {
                     final s3State = ref.read(s3UploadProvider);
                     if (s3State.s3Key == null) return;
                     
                     Navigator.pop(context); // Close bottom sheet
                     
                     // Trigger generation
                     ref.read(documentGenerationProvider.notifier).generateDocument(s3State.s3Key!, docType);

                     // Show loading dialog
                     showDialog(
                       context: context,
                       barrierDismissible: false,
                       builder: (BuildContext dialogContext) {
                         return Consumer(
                           builder: (context, ref, _) {
                             final genState = ref.watch(documentGenerationProvider);
                             
                             if (genState.status == GenerationStatus.success) {
                               WidgetsBinding.instance.addPostFrameCallback((_) {
                                 if (Navigator.canPop(dialogContext)) {
                                   Navigator.pop(dialogContext); // close dialog
                                 }
                                 // Reset UI queue
                                 ref.read(localFileListProvider.notifier).state = [];
                                 ref.read(selectedFileProvider.notifier).state = null;
                                 ref.read(s3UploadProvider.notifier).reset();
                                 ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Document generated! Check Final Drafts.')));
                               });
                             } else if (genState.status == GenerationStatus.error) {
                               return AlertDialog(
                                 title: const Text('Generation Failed'),
                                 content: Text(genState.errorMessage ?? 'Unknown error'),
                                 actions: [
                                   TextButton(
                                     onPressed: () => Navigator.pop(dialogContext),
                                     child: const Text('Close'),
                                   ),
                                 ],
                               );
                             }

                             return const AlertDialog(
                               content: Column(
                                 mainAxisSize: MainAxisSize.min,
                                 children: [
                                   CircularProgressIndicator(color: Color(0xFF2DD4BF)),
                                   SizedBox(height: 24),
                                   Text('AI is drafting your document...', style: TextStyle(fontWeight: FontWeight.bold)),
                                   SizedBox(height: 8),
                                   Text('This may take a few seconds.', style: TextStyle(color: Colors.grey, fontSize: 12)),
                                 ],
                               ),
                             );
                           }
                         );
                       }
                     );
                  }

                  return Flexible(
                    child: SingleChildScrollView(
                      child: GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        childAspectRatio: 2.5,
                        children: [
                          _DocTypeCard(title: 'NDA', subtitle: 'Non-Disclosure Agreement', icon: Icons.lock_outline, onTap: () => trigger('nda')),
                          _DocTypeCard(title: 'MOU', subtitle: 'Mem. of Understanding', icon: Icons.handshake_outlined, onTap: () => trigger('mou')),
                          _DocTypeCard(title: 'Service', subtitle: 'Service Agreement', icon: Icons.design_services_outlined, onTap: () => trigger('service')),
                          _DocTypeCard(title: 'Partnership', subtitle: 'Partnership Agreement', icon: Icons.group_outlined, onTap: () => trigger('partnership')),
                          _DocTypeCard(title: 'Collaboration', subtitle: 'Collaboration Agreement', icon: Icons.hub_outlined, onTap: () => trigger('collaboration')),
                          _DocTypeCard(title: 'Contract', subtitle: 'General Contract', icon: Icons.description_outlined, onTap: () => trigger('contract')),
                          _DocTypeCard(title: 'Statement', subtitle: 'Statement of Agreement', icon: Icons.article_outlined, onTap: () => trigger('statement')),
                          _DocTypeCard(title: 'Resolution', subtitle: 'Meeting Resolution', icon: Icons.gavel_outlined, onTap: () => trigger('resolution')),
                        ],
                      ),
                    ),
                  );
                }
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final fileList = ref.watch(localFileListProvider);
    final selectedFile = ref.watch(selectedFileProvider);

    // Render S3 errors silently failing in the background
    ref.listen(s3UploadProvider, (previous, next) {
      if (next.status == S3UploadStatus.error && next.errorMessage != null) {
        ScaffoldMessenger.of(context).clearSnackBars();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white),
                const SizedBox(width: 12),
                Expanded(child: Text(next.errorMessage!, style: const TextStyle(color: Colors.white))),
              ],
            ),
            backgroundColor: Colors.red.shade800,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            margin: const EdgeInsets.all(16),
            duration: const Duration(seconds: 4),
          ),
        );
      }
    });

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Expanded(
                child: Text('Local Staging Queue', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.grey)),
              ),
              Chip(label: Text('${fileList.length} files', style: const TextStyle(fontSize: 12))),
            ],
          ),
          const SizedBox(height: 16),
          
          Expanded(
            child: fileList.isEmpty 
              ? const Center(child: Text('Queue is empty. Go to Upload Tab.', style: TextStyle(color: Colors.grey)))
              : ListView.builder(
                  itemCount: fileList.length,
                  itemBuilder: (context, index) {
                    final platformFile = fileList[index];
                    final fileName = platformFile.name;
                    final isSelected = selectedFile?.name == fileName;

                    IconData iconData = Icons.insert_drive_file;
                    if (fileName.toLowerCase().endsWith('.pdf')) {
                      iconData = Icons.picture_as_pdf;
                    } else if (fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')) {
                      iconData = Icons.description;
                    } else if (fileName.toLowerCase().endsWith('.txt')) {
                      iconData = Icons.text_snippet;
                    }

                    return Card(
                      color: isSelected ? const Color(0xFF2DD4BF).withOpacity(0.1) : const Color(0xFF1A2332),
                      shape: RoundedRectangleBorder(
                        side: BorderSide(color: isSelected ? const Color(0xFF2DD4BF) : Colors.transparent),
                        borderRadius: BorderRadius.circular(8)
                      ),
                      child: InkWell(
                        onTap: () {
                           if (isSelected) {
                             // Deselect if currently selected
                             ref.read(selectedFileProvider.notifier).select(null);
                           } else {
                             // Select the file and show preview
                             ref.read(selectedFileProvider.notifier).select(platformFile);
                             showDialog(
                               context: context,
                               builder: (context) => LocalFilePreviewDialog(file: platformFile),
                             );
                           }
                        },
                        borderRadius: BorderRadius.circular(8),
                        child: ListTile(
                          leading: Radio<PlatformFile?>(
                            value: platformFile,
                            groupValue: selectedFile,
                            activeColor: const Color(0xFF2DD4BF),
                            toggleable: true,
                            onChanged: (value) => ref.read(selectedFileProvider.notifier).select(value),
                          ),
                          title: Text(fileName, style: TextStyle(fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                          trailing: Icon(iconData, color: Colors.grey),
                        ),
                      ),
                    );
                  },
              ),
          ),
          
          const Divider(height: 32),
          
          // AWS Action Buttons
          Row(
            children: [
              Expanded(
                child: Consumer(
                  builder: (context, ref, child) {
                    final s3State = ref.watch(s3UploadProvider);
                    final isUploading = s3State.status == S3UploadStatus.uploading;
                    final isSuccess = s3State.status == S3UploadStatus.success;

                    return ElevatedButton.icon(
                      onPressed: (selectedFile == null || isUploading || isSuccess) ? null : () {
                        if (selectedFile.bytes != null) {
                          ref.read(s3UploadProvider.notifier).uploadFile(selectedFile.name, selectedFile.bytes!);
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Error: File bytes are null. Cannot upload to S3.')),
                          );
                        }
                      },
                      icon: isUploading 
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                          : Icon(isSuccess ? Icons.check_circle : Icons.cloud_upload),
                      label: Text(isUploading ? 'Uploading...' : (isSuccess ? 'Uploaded' : 'Upload to S3')),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1A2332),
                        foregroundColor: isSuccess ? Colors.green : const Color(0xFF2DD4BF),
                      ),
                    );
                  }
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Consumer(
                  builder: (context, ref, child) {
                    final s3State = ref.watch(s3UploadProvider);
                    // Process button is ONLY enabled if the S3 upload was successful
                    final canProcess = s3State.status == S3UploadStatus.success;

                    return ElevatedButton.icon(
                      onPressed: canProcess ? () => _showDocumentTypeSelector(context) : null,
                      icon: const Icon(Icons.auto_awesome),
                      label: const Text('Process Selected'),
                    );
                  }
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _DocTypeCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  const _DocTypeCard({required this.title, required this.subtitle, required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1A2332),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.withOpacity(0.2)),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Row(
            children: [
              Icon(icon, color: const Color(0xFF2DD4BF)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey), overflow: TextOverflow.ellipsis),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 3: HISTORY / DRAFTED DOCS
// -------------------------------------------------------------
class LocalFilePreviewDialog extends StatefulWidget {
  final PlatformFile file;

  const LocalFilePreviewDialog({super.key, required this.file});

  @override
  State<LocalFilePreviewDialog> createState() => _LocalFilePreviewDialogState();
}

class _LocalFilePreviewDialogState extends State<LocalFilePreviewDialog> {
  Widget? customPreviewWidget;
  String previewText = "Loading preview...";
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPreview();
  }

  Future<void> _loadPreview() async {
    bool isDocx = widget.file.name.toLowerCase().endsWith('.docx');
    bool isPdf = widget.file.name.toLowerCase().endsWith('.pdf');

    if (isPdf && widget.file.bytes != null) {
      customPreviewWidget = SfPdfViewer.memory(widget.file.bytes!);
    } else if (isDocx && widget.file.bytes != null) {
      try {
        final text = docxToText(widget.file.bytes!);
        previewText = text;
      } catch (e) {
        previewText = "Unable to parse DOCX file. It may be corrupted or unsupported.";
      }
    } else if (widget.file.bytes != null) {
       try {
         final text = String.fromCharCodes(widget.file.bytes!);
         // Removed the truncation limit for plain text (.txt) files
         previewText = text;
       } catch (e) {
         previewText = "Unable to render binary preview.";
       }
    } else {
      previewText = "File data is currently unavailable in memory.";
    }

    if (mounted) {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF1A2332),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: const EdgeInsets.all(24),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.9, 
          maxHeight: MediaQuery.of(context).size.height * 0.9
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.description, color: Color(0xFF2DD4BF)),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    widget.file.name, 
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.grey),
                  onPressed: () => Navigator.pop(context),
                )
              ],
            ),
            const Divider(height: 32, color: Colors.grey),
            Expanded(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0B0F14),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.withOpacity(0.2)),
                ),
                child: isLoading 
                  ? const Center(child: CircularProgressIndicator(color: Color(0xFF2DD4BF)))
                  : customPreviewWidget ?? InteractiveViewer(
                      constrained: false,
                      minScale: 0.5,
                      maxScale: 4.0,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        child: Text(
                          previewText,
                          style: const TextStyle(fontFamily: 'monospace', fontSize: 13, height: 1.5),
                        ),
                      ),
                    ),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close Preview', style: TextStyle(color: Colors.grey)),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                       Navigator.pop(context);
                    },
                    icon: const Icon(Icons.check),
                    label: const Text('Confirm Selection', overflow: TextOverflow.ellipsis),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class HistoryDraftsTab extends ConsumerWidget {
  const HistoryDraftsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final draftedDocs = ref.watch(draftedDocumentsProvider);

    if (draftedDocs.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.history, size: 64, color: Colors.grey.withOpacity(0.5)),
            const SizedBox(height: 16),
            const Text('No Discovered Drafts', style: TextStyle(color: Colors.grey)),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(24),
      itemCount: draftedDocs.length,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final doc = draftedDocs[index];
        return Card(
          color: const Color(0xFF1A2332),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => PdfViewerScreen(
                    title: doc.title,
                    pdfUrl: doc.pdfUrl,
                  ),
                ),
              );
            },
            borderRadius: BorderRadius.circular(12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2DD4BF).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.description, color: Color(0xFF2DD4BF)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(doc.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 4),
                        Text(doc.summary, style: const TextStyle(color: Colors.grey, fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.chevron_right, color: Colors.grey),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
